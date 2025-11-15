"use client";

import { OpenKit403Client } from "@openkitx403/client";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

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
      
      // Try wallet connections
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
                error: "No wallet found",
                details: "Please install Phantom, Backpack, or Solflare wallet"
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
              error: data.error,
              details: data.message 
            });
            return;
          }

          if (data.link) {
            setState({ status: "success", link: data.link });
            // Small delay to show success state
            setTimeout(() => {
              window.location.href = data.link;
            }, 1500);
          }
        }
      } catch (e: any) {
        setState({ 
          status: "error", 
          error: "Authentication failed",
          details: e.message || "Please try again"
        });
      }
    }
    invoke();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9042f8] to-[#14F195] bg-clip-text text-transparent mb-2">
            OpenGuard
          </h1>
          <p className="text-gray-400 text-sm">Token-gated access</p>
        </div>

        {/* Main Card */}
        <div className="bg-[#3e1a6e]/30 backdrop-blur-sm rounded-2xl border border-[#9042f8]/20 p-8">
          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            <StepIndicator 
              step={1} 
              label="Connect" 
              active={state.status === "idle" || state.status === "connecting"}
              completed={state.status !== "idle" && state.status !== "connecting" && state.status !== "error"}
            />
            <div className="flex-1 h-0.5 bg-[#3e1a6e] self-center mx-2 mt-3">
              <div 
                className="h-full bg-[#9042f8] transition-all duration-500"
                style={{ 
                  width: state.status === "idle" || state.status === "connecting" ? "0%" : "100%"
                }}
              />
            </div>
            <StepIndicator 
              step={2} 
              label="Verify" 
              active={state.status === "signing" || state.status === "verifying"}
              completed={state.status === "success"}
            />
            <div className="flex-1 h-0.5 bg-[#3e1a6e] self-center mx-2 mt-3">
              <div 
                className="h-full bg-[#9042f8] transition-all duration-500"
                style={{ 
                  width: state.status === "success" ? "100%" : "0%"
                }}
              />
            </div>
            <StepIndicator 
              step={3} 
              label="Join" 
              active={state.status === "success"}
              completed={false}
            />
          </div>

          {/* Content based on state */}
          <div className="min-h-[200px] flex items-center justify-center">
            {state.status === "idle" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-[#9042f8]/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#9042f8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Initializing...</h3>
                  <p className="text-gray-400 text-sm">Preparing wallet connection</p>
                </div>
              </div>
            )}

            {state.status === "connecting" && (
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto">
                    <svg className="animate-spin text-[#9042f8]" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Connecting to {state.wallet}</h3>
                  <p className="text-gray-400 text-sm">Please approve the connection in your wallet</p>
                </div>
              </div>
            )}

            {state.status === "signing" && (
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto">
                    <svg className="animate-spin text-[#9042f8]" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Signing message</h3>
                  <p className="text-gray-400 text-sm">Please sign the message in your wallet</p>
                </div>
              </div>
            )}

            {state.status === "verifying" && (
              <div className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto">
                    <svg className="animate-spin text-[#9042f8]" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Verifying token balance</h3>
                  <p className="text-gray-400 text-sm">Checking your tokens on Solana...</p>
                </div>
              </div>
            )}

            {state.status === "success" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-[#14F195]/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#14F195]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#14F195]">Verified! ✓</h3>
                  <p className="text-gray-400 text-sm">Redirecting to Telegram...</p>
                </div>
              </div>
            )}

            {state.status === "error" && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-[#FF4444]/20 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#FF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-[#FF4444]">{state.error}</h3>
                  {state.details && (
                    <p className="text-gray-400 text-sm">{state.details}</p>
                  )}
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-[#9042f8] hover:bg-[#9042f8]/80 rounded-lg font-semibold transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Secured by OpenKit • Verified on Solana
          </p>
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ step, label, active, completed }: { 
  step: number; 
  label: string; 
  active: boolean; 
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`
          w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all
          ${completed ? "bg-[#14F195] text-black" : active ? "bg-[#9042f8] text-white" : "bg-[#3e1a6e] text-gray-400"}
        `}
      >
        {completed ? "✓" : step}
      </div>
      <span className={`text-xs mt-2 ${active || completed ? "text-white" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  );
}
