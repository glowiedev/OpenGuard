export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { generateNonce, getAccount, getMint } from "@/lib/crypto";
import { RedisReplayStore } from "@/lib/store";
import { KVConfig } from "@/lib/types";
import { handleOpenKitAuth } from "@/lib/withOpenKitAuth";
import { inMemoryLRU, OpenKit403Config } from "@openkitx403/server";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { Redis } from "@upstash/redis";
import { Bot } from "grammy";
import { NextRequest, NextResponse } from "next/server";

const myOpenKitConfig: OpenKit403Config = {
  issuer: "OPENGUARD-v1",
  audience: process.env.NEXT_PUBLIC_DOMAIN!,
  ttlSeconds: 60,
  bindMethodPath: true,
  replayStore: new RedisReplayStore(),
};

const redis = Redis.fromEnv();

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token)
  throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");
const bot = new Bot(token);
bot.stop();

export async function GET(
  req: NextRequest,
  ctx: RouteContext<"/api/join/[nonce]">,
) {
  const authResult = await handleOpenKitAuth(req, myOpenKitConfig);
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { nonce } = await ctx.params;
  const scanResult = await redis.scan(0, { match: "config:*" });
  const keys = scanResult[1];
  let foundConfigKey: string | null = null;
  let config: KVConfig | null = null;
  for (const key of keys) {
    const potentialConfig = await redis.get<KVConfig>(key);
    if (potentialConfig && potentialConfig.nonce === nonce) {
      foundConfigKey = key;
      config = potentialConfig;
      break;
    }
  }
  if (!config || !foundConfigKey) {
    return NextResponse.json(
      {
        error: "invalid_portal",
      },
      {
        status: 404,
      },
    );
  }
  const { mint, amount } = config;
  const { user } = authResult;
  if (mint) {
    try {
      const mintPublicKey = new PublicKey(mint);
      const userWalletPublicKey = new PublicKey(user.address);
      const mintInfo = await getMint(mintPublicKey);
      const decimals = mintInfo.decimals;
      const ataAddress = await getAssociatedTokenAddress(
        mintPublicKey,
        userWalletPublicKey,
      );
      let userRawBalance: bigint;
      try {
        const ataAccountInfo = await getAccount(ataAddress);
        userRawBalance = ataAccountInfo.amount;
      } catch (e: any) {
        userRawBalance = BigInt(0);
      }
      if (amount && amount > 0) {
        const requiredRawAmount = BigInt(amount) * BigInt(10 ** decimals);
        if (userRawBalance < requiredRawAmount) {
          return NextResponse.json(
            {
              error: "insufficient_funds",
              message: `You do not have the required ${amount.toLocaleString()} tokens.`,
            },
            { status: 403 },
          );
        }
      } else if (amount === null) {
        if (userRawBalance <= BigInt(0)) {
          return NextResponse.json(
            {
              error: "insufficient_funds",
              message: `You must hold the required token to join (any amount > 0).`,
            },
            { status: 403 },
          );
        }
      }
    } catch (e: any) {
      let errorMessage =
        "An error occurred while verifying your token balance.";
      if (e.message.includes("Invalid public key")) {
        errorMessage = "Configuration error: The Mint Address is invalid.";
      }
      return NextResponse.json(
        {
          error: "balance_check_failed",
          message: errorMessage,
        },
        { status: 500 },
      );
    }
  }
  try {
    const inviteLinkResponse = await bot.api.createChatInviteLink(
      foundConfigKey.substring(7),
      {
        creates_join_request: true,
        name: `GATE_${generateNonce()}`,
      },
    );
    const joinLink = inviteLinkResponse.invite_link;
    await redis.set(`link:${inviteLinkResponse.name}`, user.address);
    return NextResponse.json({
      link: joinLink,
    });
  } catch (e) {
    console.error("Error creating invite link:", e);
    return NextResponse.json(
      {
        error: "telegram_api_error",
        message:
          "Could not create single-use invite link. Ensure bot has admin rights.",
      },
      { status: 500 },
    );
  }
}
