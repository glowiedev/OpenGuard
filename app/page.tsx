import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <main className="max-w-2xl w-full space-y-8 text-center">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-[#9042f8] to-[#14F195] bg-clip-text text-transparent">
              OpenGuard
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            Token-gate your Telegram communities with Solana
          </p>
        </div>

        {/* Description */}
        <div className="bg-[#3e1a6e]/30 backdrop-blur-sm rounded-2xl p-8 border border-[#9042f8]/20">
          <p className="text-gray-200 leading-relaxed mb-6">
            OpenGuard is a Telegram bot that automatically verifies token holdings before allowing users to join your community. 
            Set up once, and let the bot handle everything.
          </p>
          
          {/* Tutorial Steps */}
          <div className="space-y-4 text-left">
            <h2 className="text-lg font-semibold text-[#9042f8] mb-3">Quick Setup:</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex gap-3">
                <span className="text-[#9042f8] font-bold">1.</span>
                <span>Add <code className="px-2 py-1 bg-black/40 rounded">@OpenGuardBot</code> to your Telegram group as admin</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#9042f8] font-bold">2.</span>
                <span>Run <code className="px-2 py-1 bg-black/40 rounded">/setup</code> and configure your token requirements</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#9042f8] font-bold">3.</span>
                <span>Run <code className="px-2 py-1 bg-black/40 rounded">/link [nonce]</code> in your target channel</span>
              </div>
              <div className="flex gap-3">
                <span className="text-[#9042f8] font-bold">4.</span>
                <span>Share the join button - users connect wallet and join automatically</span>
              </div>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="https://t.me/OpenGuardBot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#9042f8] hover:bg-[#9042f8]/80 rounded-lg font-semibold transition-colors"
          >
            Open Telegram Bot
          </a>
          <a
            href="https://github.com/yourusername/openguard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#3e1a6e] hover:bg-[#3e1a6e]/80 rounded-lg font-semibold transition-colors border border-[#9042f8]/30"
          >
            View on GitHub
          </a>
        </div>

        {/* Footer Links */}
        <div className="pt-8 space-y-2">
          <div className="flex gap-6 justify-center text-sm text-gray-400">
            <a href="https://x.com/yourhandle" target="_blank" rel="noopener noreferrer" className="hover:text-[#9042f8] transition-colors">
              Developer X
            </a>
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-[#9042f8] transition-colors">
              GitHub
            </a>
            <Link href="/docs" className="hover:text-[#9042f8] transition-colors">
              Documentation
            </Link>
          </div>
          <p className="text-xs text-gray-500">
            Powered by Solana • Automated verification every 15 minutes
          </p>
        </div>
      </main>
    </div>
  );
}
