from __future__ import annotations

import math
import wave
from pathlib import Path

import numpy as np


SR = 44_100
BPM = 128
BARS = 80
BEATS_PER_BAR = 4
BEAT = 60.0 / BPM
DURATION = BARS * BEATS_PER_BAR * BEAT
OUT = Path("assets/audio/review/cybernetic-afterpulse-loop-v3-dark-no-tick.wav")


def midi_to_hz(note: float) -> float:
    return 440.0 * 2 ** ((note - 69.0) / 12.0)


def env_percussive(length: int, attack: float, decay: float, sustain: float = 0.0) -> np.ndarray:
    a = max(1, int(attack * SR))
    d = max(1, length - a)
    out = np.empty(length, dtype=np.float32)
    out[:a] = np.linspace(0, 1, a, endpoint=False)
    out[a:] = np.exp(-np.linspace(0, 1, d) * (6.0 + sustain * 2.0)) * (1 - sustain) + sustain
    return out


def one_pole_lowpass(signal: np.ndarray, cutoff: float) -> np.ndarray:
    rc = 1.0 / (2.0 * math.pi * cutoff)
    dt = 1.0 / SR
    alpha = dt / (rc + dt)
    out = np.empty_like(signal)
    last = 0.0
    for i, sample in enumerate(signal):
        last += alpha * (sample - last)
        out[i] = last
    return out


def highpass_noise(length: int, rng: np.random.Generator) -> np.ndarray:
    noise = rng.uniform(-1, 1, length).astype(np.float32)
    return np.concatenate([[0.0], np.diff(noise)]).astype(np.float32)


def add_stereo(track: np.ndarray, start: float, mono: np.ndarray, gain: float, pan: float = 0.0) -> None:
    i = int(start * SR)
    if i >= len(track):
        return
    n = min(len(mono), len(track) - i)
    if n <= 0:
        return
    left = math.cos((pan + 1) * math.pi / 4)
    right = math.sin((pan + 1) * math.pi / 4)
    track[i : i + n, 0] += mono[:n] * gain * left
    track[i : i + n, 1] += mono[:n] * gain * right


def osc_saw(freq: float, length: int, phase: float = 0.0) -> np.ndarray:
    t = np.arange(length, dtype=np.float32) / SR
    return (2.0 * ((freq * t + phase) % 1.0) - 1.0).astype(np.float32)


def osc_square(freq: float, length: int, phase: float = 0.0) -> np.ndarray:
    t = np.arange(length, dtype=np.float32) / SR
    return np.sign(np.sin(2 * np.pi * freq * t + phase)).astype(np.float32)


def osc_sine_sweep(length: int, start_hz: float, end_hz: float) -> np.ndarray:
    t = np.arange(length, dtype=np.float32) / SR
    freqs = end_hz + (start_hz - end_hz) * np.exp(-t * 16)
    phase = 2 * np.pi * np.cumsum(freqs) / SR
    return np.sin(phase).astype(np.float32)


def make_delay(signal: np.ndarray, delay_s: float, feedback: float, wet: float) -> np.ndarray:
    delay = int(delay_s * SR)
    out = signal.copy()
    if delay <= 0:
        return out
    for ch in range(2):
        for i in range(delay, len(out)):
            out[i, ch] += out[i - delay, ch] * feedback
    return signal * (1 - wet) + out * wet


def add_kick(track: np.ndarray, beat_index: int) -> None:
    length = int(0.48 * SR)
    tone = osc_sine_sweep(length, 115, 42)
    env = env_percussive(length, 0.002, 0.42)
    click_len = int(0.018 * SR)
    click = np.zeros(length, dtype=np.float32)
    click[:click_len] = np.linspace(1, 0, click_len) * np.sin(np.linspace(0, np.pi * 34, click_len))
    mono = tone * env + click * 0.22
    add_stereo(track, beat_index * BEAT, mono, 0.9)


def add_snare(track: np.ndarray, beat_index: int, rng: np.random.Generator) -> None:
    length = int(0.34 * SR)
    env = env_percussive(length, 0.003, 0.33)
    noise = highpass_noise(length, rng)
    body = np.sin(2 * np.pi * 185 * np.arange(length) / SR).astype(np.float32) * np.exp(-np.arange(length) / (SR * 0.09))
    mono = noise * env * 0.7 + body * 0.35
    add_stereo(track, beat_index * BEAT, mono, 0.42, pan=-0.04)


def add_hat(track: np.ndarray, time_s: float, rng: np.random.Generator, open_hat: bool = False) -> None:
    length = int((0.18 if open_hat else 0.055) * SR)
    env = env_percussive(length, 0.001, 0.16 if open_hat else 0.05)
    mono = highpass_noise(length, rng) * env
    add_stereo(track, time_s, mono, 0.12 if open_hat else 0.07, pan=rng.uniform(-0.35, 0.35))


def add_dark_shaker(track: np.ndarray, time_s: float, rng: np.random.Generator) -> None:
    length = int(0.22 * SR)
    env = env_percussive(length, 0.018, 0.2)
    noise = highpass_noise(length, rng)
    noise = one_pole_lowpass(noise, 1_600)
    mono = np.tanh(noise * 1.4) * env
    add_stereo(track, time_s, mono, 0.028, pan=rng.uniform(-0.28, 0.28))


def add_bass_note(track: np.ndarray, time_s: float, note: int, length_s: float, accent: float = 1.0) -> None:
    length = int(length_s * SR)
    hz = midi_to_hz(note)
    env = env_percussive(length, 0.005, length_s * 0.85, sustain=0.05)
    raw = osc_saw(hz, length) * 0.7 + osc_square(hz / 2, length, phase=0.4) * 0.3
    raw = np.tanh(raw * 1.8)
    mono = one_pole_lowpass(raw, 420) * env
    add_stereo(track, time_s, mono, 0.25 * accent)


def chord_signal(notes: list[int], length_s: float, rng: np.random.Generator) -> np.ndarray:
    length = int(length_s * SR)
    t = np.arange(length, dtype=np.float32) / SR
    sig = np.zeros(length, dtype=np.float32)
    for note in notes:
        base = midi_to_hz(note)
        for detune in (-0.006, 0.0, 0.007):
            sig += osc_saw(base * (1 + detune), length, phase=rng.random()) * 0.12
            sig += np.sin(2 * np.pi * base * 2 * (1 + detune) * t + rng.random() * 6.28).astype(np.float32) * 0.04
    fade = min(int(0.32 * SR), length // 3)
    env = np.ones(length, dtype=np.float32)
    env[:fade] = np.linspace(0, 1, fade)
    env[-fade:] = np.linspace(1, 0, fade)
    return one_pole_lowpass(np.tanh(sig), 1_300) * env


def add_lead(track: np.ndarray, time_s: float, note: int, length_s: float, pan: float) -> None:
    length = int(length_s * SR)
    hz = midi_to_hz(note)
    env = env_percussive(length, 0.006, length_s * 0.75)
    t = np.arange(length, dtype=np.float32) / SR
    vibrato = 1 + 0.004 * np.sin(2 * np.pi * 6.0 * t)
    phase = 2 * np.pi * np.cumsum(hz * vibrato) / SR
    mono = (np.sin(phase) * 0.58 + osc_square(hz, length, 0.2) * 0.16) * env
    mono = one_pole_lowpass(np.tanh(mono * 1.5), 1_450)
    add_stereo(track, time_s, mono, 0.105, pan=pan)


def add_metal_hit(track: np.ndarray, time_s: float, rng: np.random.Generator, gain: float = 0.08) -> None:
    length = int(0.42 * SR)
    t = np.arange(length, dtype=np.float32) / SR
    env = env_percussive(length, 0.001, 0.38)
    freqs = rng.choice([180, 233, 311, 467, 719], size=3, replace=False)
    sig = np.zeros(length, dtype=np.float32)
    for f in freqs:
        sig += np.sin(2 * np.pi * f * t + rng.random() * 6.28).astype(np.float32) * 0.22
    sig += highpass_noise(length, rng) * 0.28
    sig = one_pole_lowpass(np.tanh(sig * 1.8), 2_900) * env
    add_stereo(track, time_s, sig, gain, pan=rng.uniform(-0.5, 0.5))


def sidechain(track: np.ndarray) -> None:
    total = len(track)
    t = np.arange(total, dtype=np.float32) / SR
    beat_pos = np.mod(t, BEAT)
    duck = 1.0 - 0.32 * np.exp(-beat_pos / 0.12)
    track *= duck[:, None]


def main() -> None:
    rng = np.random.default_rng(5995)
    total = int(DURATION * SR)
    music = np.zeros((total, 2), dtype=np.float32)
    drums = np.zeros_like(music)

    total_beats = BARS * BEATS_PER_BAR
    for b in range(total_beats):
        add_kick(drums, b)
        if b % 4 in (1, 3):
            add_snare(drums, b, rng)
        if b % 2 == 1:
            add_dark_shaker(drums, b * BEAT + 0.58 * BEAT, rng)

    bass_pattern = [42, 42, 43, 42, 37, 42, 40, 42, 42, 45, 43, 42, 37, 40, 38, 37]
    for step in range(total_beats * 4):
        note = bass_pattern[step % len(bass_pattern)]
        bar = step // 16
        accent = 1.18 if step % 4 == 0 else 0.86
        if bar >= 40 and step % 16 in (7, 15):
            note -= 12
        add_bass_note(music, step * BEAT / 4, note, BEAT * 0.22, accent)

    chords = [
        [42, 45, 49, 52],
        [37, 42, 45, 49],
        [40, 43, 47, 50],
        [38, 42, 45, 48],
    ]
    for section in range(0, BARS, 4):
        chord = chords[(section // 4) % len(chords)]
        mono = chord_signal(chord, BEAT * 16, rng)
        add_stereo(music, section * BEATS_PER_BAR * BEAT, mono, 0.22, pan=-0.12)
        shimmer = chord_signal([n + 12 for n in chord[:3]], BEAT * 16, rng)
        add_stereo(music, section * BEATS_PER_BAR * BEAT + BEAT * 0.5, shimmer, 0.025, pan=0.18)

    lead_motif = [54, 55, 54, 52, 49, 50, 49, 47, 54, 55, 57, 55, 54, 50, 49, 47]
    for bar in range(16, BARS, 16):
        for i, note in enumerate(lead_motif):
            if i % 2 == 1 and bar < 32:
                continue
            add_lead(music, (bar * 4 + i * 0.75) * BEAT, note, BEAT * 0.58, pan=-0.18 + 0.36 * ((i % 2)))

    for bar in range(8, BARS, 8):
        add_metal_hit(music, (bar * 4 - 0.6) * BEAT, rng, gain=0.055)

    # Surgical-machine ambience and danger risers, kept subtle so the loop remains game-friendly.
    for bar in range(0, BARS, 8):
        length = int(BEAT * 8 * SR)
        t = np.arange(length, dtype=np.float32) / SR
        freq = np.linspace(90, 330, length)
        phase = 2 * np.pi * np.cumsum(freq) / SR
        riser = np.sin(phase) * np.linspace(0, 1, length) ** 1.8
        riser *= np.linspace(1, 0.2, length)
        add_stereo(music, (bar * 4 + 24) * BEAT, riser.astype(np.float32), 0.055, pan=0.35)

    sidechain(music)
    mix = music + drums
    mix = make_delay(mix, BEAT * 0.75, 0.18, 0.12)
    mix[:, 0] += np.roll(mix[:, 1], int(0.006 * SR)) * 0.04
    mix[:, 1] += np.roll(mix[:, 0], int(0.005 * SR)) * 0.04
    mix -= np.mean(mix, axis=0, keepdims=True)
    peak = np.max(np.abs(mix))
    if peak > 0:
        mix = mix / peak * 0.92
    mix = np.tanh(mix * 1.04)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pcm = np.clip(mix, -1, 1)
    pcm16 = (pcm * 32767).astype("<i2")
    with wave.open(str(OUT), "wb") as wav:
        wav.setnchannels(2)
        wav.setsampwidth(2)
        wav.setframerate(SR)
        wav.writeframes(pcm16.tobytes())

    minutes = int(DURATION // 60)
    seconds = int(round(DURATION % 60))
    print(f"Wrote {OUT}")
    print(f"Duration: {minutes}:{seconds:02d}")
    print(f"Tempo: {BPM} BPM, bars: {BARS}, key center: F# phrygian/dark minor")


if __name__ == "__main__":
    main()
