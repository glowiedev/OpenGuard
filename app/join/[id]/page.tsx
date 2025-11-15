"use client";

import { OpenKit403Client } from "@openkitx403/client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";

type JoinState = 
  | { status: "idle" }
  | { status: "connecting"; wallet: string }
  | { status: "signing" }
  | { status: "verifying" }
  | { status: "success"; link: string }
  | { status: "error"; error: string; details?: string };

export default function Join(props: PageProps<"/join/[id]">) {
  const [client, _] = useState(() => new OpenKit403Client());
  const [state, setState] = useState<JoinState>({ status: "idle" });

  useEffect(() => {
    async function invoke() {
      const { id } = await props.params;
      
      if (!client["walletInstance"]) {
        try {
          setState({ status: "connecting", wallet: "Phantom" });
          await client.connect("phantom");
        } catch {
          try {
            setState({ status: "connecting", wallet: "Backpack" });
            await client.connect("backpack");
          } catch {
            try {
              setState({ status: "connecting", wallet: "Solflare" });
              await client.connect("solflare");
            } catch (e) {
              setState({ 
                status: "error", 
                error: "NO_WALLET_FOUND",
                details: "Install Phantom, Backpack, or Solflare"
              });
              return;
            }
          }
        }
      }

      try {
        setState({ status: "signing" });
        const result = await client.authenticate({
          resource: process.env.NEXT_PUBLIC_DOMAIN + "/api/join/" + id,
          method: "GET",
        });

        if (result) {
          setState({ status: "verifying" });
          const data = await result.json();
          
          if (data.error) {
            setState({ 
              status: "error", 
              error: data.error.toUpperCase().replace(/_/g, " "),
              details: data.message 
            });
            return;
          }

          if (data.link) {
            setState({ status: "success", link: data.link });
            setTimeout(() => {
              window.location.href = data.link;
            }, 1500);
          }
        }
      } catch (e: any) {
        setState({ 
          status: "error", 
          error: "AUTHENTICATION_FAILED",
          details: e.message || "Please try again"
        });
      }
    }
    invoke();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative">
      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b-2 border-[#9042f8] pb-6">
          <Image 
            src="/logo-transparent.png" 
            alt="OpenGuard" 
            width={80} 
            height={80}
            className="w-20 h-auto"
          />
          <div>
            <h1 className="text-4xl font-bold tracking-tighter">OpenGuard</h1>
            <p className="text-gray-400 font-mono text-xs">VERIFICATION_PORTAL</p>
          </div>
        </div>

        {/* Security Warning */}
        <div className="mb-8 border-2 border-[#14F195] bg-[#14F195]/5 p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-[#14F195] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-[#14F195] font-bold text-sm mb-1 font-mono">VERIFY URL</p>
              <p className="text-gray-300 text-xs">
                Always check you&apos;re on <span className="font-mono font-bold text-white">openguard.cc</span> before connecting your wallet
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 space-y-2">
          <div className="flex gap-4 font-mono text-xs">
            <span className={state.status === "idle" || state.status === "connecting" ? "text-[#9042f8]" : "text-gray-600"}>[CONNECT]</span>
            <span className={state.status === "signing" || state.status === "verifying" ? "text-[#9042f8]" : "text-gray-600"}>[VERIFY]</span>
            <span className={state.status === "success" ? "text-[#14F195]" : "text-gray-600"}>[ACCESS]</span>
          </div>
          <div className="h-1 bg-gray-800 relative overflow-hidden">
            <div 
              className="absolute h-full bg-[#9042f8] transition-all duration-500"
              style={{ 
                width: state.status === "idle" || state.status === "connecting" ? "33%" : 
                       state.status === "signing" || state.status === "verifying" ? "66%" :
                       state.status === "success" ? "100%" : "0%"
              }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="border-2 border-[#9042f8] bg-black/40 p-12">
          <div className="min-h-[300px] flex items-center justify-center">
            {state.status === "idle" && (
              <div className="text-center space-y-6 w-full">
                <div className="inline-block p-4 border-2 border-[#9042f8]">
                  <svg className="w-12 h-12 text-[#9042f8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">INITIALIZING</h3>
                  <p className="text-gray-400 font-mono text-sm">Preparing connection...</p>
                </div>
              </div>
            )}

            {state.status === "connecting" && (
              <div className="text-center space-y-6 w-full">
                <div className="inline-block p-4 border-2 border-[#9042f8] relative">
                  <svg className="animate-spin w-12 h-12 text-[#9042f8]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">CONNECTING</h3>
                  <p className="text-gray-400 font-mono text-sm">{state.wallet} wallet detected</p>
                  <p className="text-gray-600 font-mono text-xs mt-2">Approve connection in wallet...</p>
                </div>
              </div>
            )}

            {state.status === "signing" && (
              <div className="text-center space-y-6 w-full">
                <div className="inline-block p-4 border-2 border-[#9042f8]">
                  <svg className="animate-spin w-12 h-12 text-[#9042f8]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">SIGN MESSAGE</h3>
                  <p className="text-gray-400 font-mono text-sm">Approve in wallet to continue</p>
                </div>
              </div>
            )}

            {state.status === "verifying" && (
              <div className="text-center space-y-6 w-full">
                <div className="inline-block p-4 border-2 border-[#9042f8]">
                  <svg className="animate-spin w-12 h-12 text-[#9042f8]" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">VERIFYING</h3>
                  <p className="text-gray-400 font-mono text-sm">Checking token balance on-chain...</p>
                </div>
              </div>
            )}

            {state.status === "success" && (
              <div className="text-center space-y-6 w-full">
                <div className="inline-block p-4 border-2 border-[#14F195]">
                  <svg className="w-12 h-12 text-[#14F195]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-[#14F195]">ACCESS GRANTED</h3>
                  <p className="text-gray-400 font-mono text-sm">Redirecting to Telegram...</p>
                </div>
              </div>
            )}

            {state.status === "error" && (
              <div className="text-center space-y-6 w-full">
                <div className="inline-block p-4 border-2 border-[#FF4444]">
                  <svg className="w-12 h-12 text-[#FF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-[#FF4444]">{state.error}</h3>
                  {state.details && (
                    <p className="text-gray-400 font-mono text-sm">{state.details}</p>
                  )}
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-6 px-8 py-3 border-2 border-[#9042f8] hover:bg-[#9042f8] font-bold transition-colors"
                >
                  TRY AGAIN
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600 font-mono">
            <a href="https://www.openkitx403.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-[#9042f8]">openkitx403</a> • http 403 wallet authentication
          </p>
        </div>
      </div>
    </div>
  );
}
