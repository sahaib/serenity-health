import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { SpliteBar } from './ui/splite-bar';
import { cn } from '../utils/cn';

interface AudioPlayerProps {
  audioUrl: string;
  className?: string;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
}

export function AudioPlayer({ audioUrl, className, onPlayStart, onPlayEnd }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onPlayEnd) onPlayEnd();
    };

    // Event listeners
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleAudioEnd);

    return () => {
      audio.pause();
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleAudioEnd);
    };
  }, [audioUrl, onPlayEnd]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      if (onPlayStart) onPlayStart();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeChange = (time: number) => {
    setCurrentTime(time);
  };

  const handleTimeSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('flex flex-col space-y-2 w-full max-w-md', className)}>
      <div className="flex items-center justify-between">
        <button
          onClick={togglePlay}
          className="p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        
        <div className="flex-1 mx-3">
          <SpliteBar
            value={currentTime}
            max={duration || 100}
            onChange={handleTimeChange}
            onSeek={handleTimeSeek}
            className="w-full"
          />
        </div>
        
        <div className="text-xs font-medium tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleMute}
          className="text-foreground hover:text-primary"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        
        <SpliteBar
          value={isMuted ? 0 : volume}
          max={1}
          onChange={handleVolumeChange}
          className="w-20"
        />
      </div>
    </div>
  );
} 