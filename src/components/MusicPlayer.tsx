import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { TRACKS } from '../data/tracks';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-zinc-900/80 backdrop-blur-md border border-fuchsia-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(217,70,239,0.15)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-6">
        {/* Album Art Placeholder */}
        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${currentTrack.coverColor} shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20"></div>
          <div className={`w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
            <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div>
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 truncate">
            {currentTrack.title}
          </h3>
          <p className="text-zinc-400 text-sm">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={prevTrack}
            className="p-2 text-zinc-400 hover:text-fuchsia-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
          >
            <SkipBack size={24} />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-fuchsia-500 text-black hover:bg-fuchsia-400 transition-all shadow-[0_0_15px_rgba(217,70,239,0.5)] hover:shadow-[0_0_25px_rgba(217,70,239,0.8)] hover:scale-105"
          >
            {isPlaying ? <Pause size={24} className="fill-black" /> : <Play size={24} className="fill-black ml-1" />}
          </button>
          
          <button
            onClick={nextTrack}
            className="p-2 text-zinc-400 hover:text-fuchsia-400 transition-colors hover:drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]"
          >
            <SkipForward size={24} />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-zinc-400 hover:text-cyan-400 transition-colors"
          >
            {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-24 h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          />
        </div>
      </div>
    </div>
  );
}
