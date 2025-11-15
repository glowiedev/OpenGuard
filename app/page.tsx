import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <main className="max-w-4xl w-full relative z-10">
        {/* Header Section */}
        <div className="mb-16">
          <div className="flex items-start gap-6 mb-8">
            <Image 
              src="/logo-transparent.png" 
              alt="OpenGuard Logo" 
              width={120} 
              height={120}
              priority
              className="w-30 h-auto"
            />
            <div>
              <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-2 text-white">
                OpenGuard
              </h1>
              <div className="flex items-center gap-2">
                <div className="h-px w-12 bg-[#14F195]"></div>
                <p className="text-gray-400 font-mono text-sm">TOKEN_GATED_COMMUNITIES</p>
              </div>
            </div>
          </div>
          
          <p className="text-2xl text-gray-300 max-w-2xl leading-relaxed">
            Automated Telegram verification powered by x403 protocol.
            <span className="text-[#14F195]"> Zero manual work.</span>
          </p>
        </div>

        {/* Powered By Banner */}
        <div className="border-l-4 border-[#9042f8] pl-6 mb-12 bg-black/20 py-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-400 font-mono">Powered by</span>
            <a 
              href="https://www.openkitx403.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#9042f8] hover:text-[#14F195] font-bold transition-colors"
            >
              OpenKitx403
            </a>
            <span className="text-gray-600 font-mono text-xs">→ HTTP-native wallet authentication</span>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <div className="border-2 border-[#9042f8] p-6 bg-black/40 hover:bg-[#9042f8]/5 transition-colors group">
            <div className="font-mono text-[#9042f8] text-xs mb-2">[01]</div>
            <h3 className="text-xl font-bold mb-2">Automated Checks</h3>
            <p className="text-gray-400 text-sm">Verifies every 15 minutes. Removes non-holders automatically.</p>
          </div>
          
          <div className="border-2 border-[#9042f8] p-6 bg-black/40 hover:bg-[#9042f8]/5 transition-colors group">
            <div className="font-mono text-[#9042f8] text-xs mb-2">[02]</div>
            <h3 className="text-xl font-bold mb-2">Wallet Auth</h3>
            <p className="text-gray-400 text-sm">HTTP 403-based signatures via <a href="https://www.openkitx403.dev/" target="_blank" rel="noopener noreferrer" className="text-[#9042f8] hover:underline">OpenKitx403</a>. Zero key exposure.</p>
          </div>
          
          <div className="border-2 border-[#9042f8] p-6 bg-black/40 hover:bg-[#9042f8]/5 transition-colors group">
            <div className="font-mono text-[#9042f8] text-xs mb-2">[03]</div>
            <h3 className="text-xl font-bold mb-2">Any SPL Token</h3>
            <p className="text-gray-400 text-sm">Support for all Solana tokens. Custom amounts.</p>
          </div>
          
          <div className="border-2 border-[#9042f8] p-6 bg-black/40 hover:bg-[#9042f8]/5 transition-colors group">
            <div className="font-mono text-[#9042f8] text-xs mb-2">[04]</div>
            <h3 className="text-xl font-bold mb-2">Open Source</h3>
            <p className="text-gray-400 text-sm">Audit the code. No tracking. Full transparency.</p>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="border-l-4 border-[#14F195] pl-6 mb-12 bg-black/20 py-6">
          <h2 className="text-2xl font-bold mb-6 text-[#14F195]">Setup</h2>
          <div className="space-y-4 font-mono text-sm">
            <div className="flex gap-4">
              <span className="text-[#9042f8]">$</span>
              <div>
                <span className="text-gray-400">Add bot →</span>
                <code className="ml-2 text-white">@OpenGuardBot</code>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#9042f8]">$</span>
              <div>
                <span className="text-gray-400">Configure →</span>
                <code className="ml-2 text-white">/setup</code>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#9042f8]">$</span>
              <div>
                <span className="text-gray-400">Link portal →</span>
                <code className="ml-2 text-white">/link [nonce]</code>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="text-[#14F195]">✓</span>
              <span className="text-gray-400">Done. Users can join.</span>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <a
            href="https://t.me/OpenGuardBot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-[#9042f8] hover:bg-[#9042f8]/80 font-bold text-lg transition-colors border-2 border-[#9042f8]"
          >
            LAUNCH BOT
          </a>
          <a
            href="https://github.com/glowiedev/OpenGuard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 border-white hover:bg-white hover:text-black font-bold text-lg transition-colors"
          >
            GITHUB
          </a>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
          <div className="h-px flex-1 bg-gray-800"></div>
          <span>
            made by <a href="https://x.com/glowiedev" target="_blank" rel="noopener noreferrer" className="hover:text-[#9042f8]">@glowiedev</a> and <a href="https://x.com/onlyzhynx" target="_blank" rel="noopener noreferrer" className="hover:text-[#9042f8]">@onlyzhynx</a> • <a href="https://www.openkitx403.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-[#9042f8]">openkitx403</a>
          </span>
          <div className="h-px flex-1 bg-gray-800"></div>
        </div>
      </main>
    </div>
  );
}
