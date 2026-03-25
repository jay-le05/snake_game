import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-fuchsia-500/30 overflow-x-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col relative z-10">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-cyan-400 animate-gradient-x drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
              NEON
            </span>{' '}
            SNAKE
          </h1>
          <p className="text-zinc-400 tracking-widest uppercase text-sm font-semibold">
            Beats & Bytes
          </p>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center max-w-6xl mx-auto w-full">
          
          {/* Game Section */}
          <div className="flex-1 w-full flex justify-center">
            <SnakeGame />
          </div>

          {/* Music Player Section */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6 lg:sticky lg:top-8">
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef] animate-pulse"></span>
                Now Playing
              </h2>
              <MusicPlayer />
            </div>
            
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 text-sm text-zinc-400">
              <h3 className="text-white font-semibold mb-2">Vibe Check</h3>
              <p>
                Play the classic snake game while listening to AI-generated synthwave and cyber-beats. 
                The game speed increases as your score goes up. Don't hit the walls!
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
