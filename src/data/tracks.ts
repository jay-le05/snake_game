export type Track = {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverColor: string;
};

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverColor: 'from-cyan-500 to-blue-500',
  },
  {
    id: '2',
    title: 'Cybernetic Pulse',
    artist: 'Neural Network',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverColor: 'from-fuchsia-500 to-purple-500',
  },
  {
    id: '3',
    title: 'Digital Horizon',
    artist: 'Algorithm',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverColor: 'from-emerald-500 to-teal-500',
  },
];
