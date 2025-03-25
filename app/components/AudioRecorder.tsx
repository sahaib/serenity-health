import React, { useState, useEffect, useRef } from 'react';
import { Mic, StopCircle } from 'lucide-react';
import { SpliteBar } from './ui/splite-bar';
import { cn } from '../utils/cn';

interface AudioRecorderProps {
  onAudioCapture: (audioBlob: Blob) => void;
  className?: string;
}

export function AudioRecorder({ onAudioCapture, className }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        onAudioCapture(audioBlob);

        // Stop all tracks from the stream
        stream.getTracks().forEach(track => track.stop());
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Update recording time
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <div className={cn('flex flex-col space-y-2', className)}>
      <div className="flex items-center space-x-3 bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          className={cn(
            'p-3 rounded-full transition-colors flex items-center justify-center',
            isRecording 
              ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' 
              : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
          )}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? <StopCircle size={20} /> : <Mic size={20} />}
        </button>
        
        <div className="flex-1">
          {isRecording ? (
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-red-500 flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
                Recording... {formatTime(recordingTime)}
              </span>
              <SpliteBar 
                value={recordingTime} 
                max={300} // Max 5 minutes
                className="w-full" 
                trackClassName="bg-gray-100 dark:bg-gray-800"
                rangeClassName="bg-red-500"
              />
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Click to record a voice message</span>
          )}
        </div>
      </div>
    </div>
  );
} 