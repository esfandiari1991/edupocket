"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, RotateCw, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { AudioWavePlaceholder } from "@/components/audio/AudioWavePlaceholder";
import { commonText } from "@/lib/i18n";
import { LocalizedText } from "@/components/site/LocalizedText";

type EduPocketPlayerProps = {
  title: string;
  titleFa?: string;
  audioSrc?: string;
  audioAvailable?: boolean;
  compact?: boolean;
};

const speeds = [0.75, 1, 1.25, 1.5, 2];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function EduPocketPlayer({ title, titleFa, audioSrc, audioAvailable = true, compact = false }: EduPocketPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [error, setError] = useState(!audioSrc || !audioAvailable);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
  }, [speed]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio || error) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  }

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio || error) return;
    audio.currentTime = value;
    setCurrentTime(value);
  }

  function skip(amount: number) {
    const audio = audioRef.current;
    if (!audio || error) return;
    seek(Math.min(Math.max(audio.currentTime + amount, 0), duration || audio.duration || 0));
  }

  if (error) {
    return (
      <div className="rounded-[8px] border border-amber-300/20 bg-amber-300/10 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase text-amber-100">EduPocket Audio</p>
          <span className="rounded-[6px] border border-slate-500/30 bg-slate-950/45 px-2 py-1 text-xs font-semibold text-slate-200">
            <LocalizedText en={commonText.audioSoon.en} fa={commonText.audioSoon.fa} />
          </span>
        </div>
        <h2 className="mt-2 text-lg font-semibold text-white">
          <LocalizedText en={title} fa={titleFa ?? title} />
        </h2>
        <p className="mt-3 text-sm leading-6 text-amber-50/80">
          <LocalizedText en="Audio file is not attached yet. The episode notes are still available." fa="فایل صوتی هنوز اضافه نشده است. یادداشت های اپیزود همچنان در دسترس هستند." />
        </p>
      </div>
    );
  }

  return (
    <div className={cn("rounded-[8px] border border-white/10 bg-white/[0.055] p-4 shadow-2xl", compact && "p-3")}>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setError(true);
        }}
      />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase text-amber-200">EduPocket Audio</p>
          <h2 className="mt-1 truncate text-base font-semibold text-white">
            <LocalizedText en={title} fa={titleFa ?? title} />
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="flex size-12 items-center justify-center rounded-full bg-amber-400 text-slate-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
            aria-label={playing ? "Pause episode" : "Play episode"}
          >
            {playing ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="ml-0.5 size-5" />}
          </button>
          <button
            type="button"
            onClick={() => skip(-15)}
            className="flex size-10 items-center justify-center rounded-full border border-white/10 text-slate-200 transition hover:border-amber-300/50 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
            aria-label="Skip back 15 seconds"
          >
            <RotateCcw aria-hidden="true" className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => skip(15)}
            className="flex size-10 items-center justify-center rounded-full border border-white/10 text-slate-200 transition hover:border-amber-300/50 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
            aria-label="Skip forward 15 seconds"
          >
            <RotateCw aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="flex items-center gap-4">
            <span className="w-10 text-xs tabular-nums text-slate-400">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={1}
              value={Math.min(currentTime, duration || currentTime)}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label="Audio progress"
              className="audio-range flex-1"
            />
            <span className="w-10 text-right text-xs tabular-nums text-slate-400">{formatTime(duration)}</span>
          </div>
          <AudioWavePlaceholder active={playing} className="mt-3" />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={speed}
            onChange={(event) => setSpeed(Number(event.target.value))}
            aria-label="Playback speed"
            className="rounded-[8px] border border-white/10 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
          >
            {speeds.map((item) => (
              <option key={item} value={item}>
                {item}x
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setMuted((value) => !value)}
            className="flex size-10 items-center justify-center rounded-[8px] border border-white/10 text-slate-200 transition hover:border-amber-300/50 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300/60"
            aria-label={muted ? "Unmute audio" : "Mute audio"}
          >
            {muted ? <VolumeX aria-hidden="true" className="size-4" /> : <Volume2 aria-hidden="true" className="size-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => setVolume(Number(event.target.value))}
            aria-label="Volume"
            className="audio-range w-28"
          />
        </div>
      </div>
    </div>
  );
}
