export const dynamic = "force-dynamic";

import { KVConfig } from "@/lib/types";
import { Redis } from "@upstash/redis";
import { Bot } from "grammy";
import { NextRequest, NextResponse } from "next/server";
import { checkTokenBalance } from "@/lib/crypto";

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) throw new Error("TELEGRAM_BOT_TOKEN not found");

const redis = Redis.fromEnv();
const bot = new Bot(token);
bot.stop();

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  let verifiedCount = 0;
  let kickedCount = 0;
  let failedKicks = 0;
  const scanResult = await redis.scan(0, { match: "config:*" });
  const configKeys = scanResult[1];
  for (const key of configKeys) {
    const config = await redis.get<KVConfig>(key);
    if (!config || !config.mint) {
      continue;
    }
    const { mint, amount } = config;
    let chatId = key.substring(7);
    const userScanResult = await redis.scan(0, { match: "user:*" });
    const userKeys = userScanResult[1];
    for (const userKey of userKeys) {
      const user = Number(userKey.substring(5));
      const wallet = await redis.get<string>(userKey);
      if (!wallet) continue;
      const hasBalance = await checkTokenBalance(mint, amount, wallet);
      if (!hasBalance) {
        try {
          await bot.api.banChatMember(chatId, user);
          await bot.api.unbanChatMember(chatId, user);
          kickedCount++;
          try {
            await bot.api.sendMessage(
              user,
              `You have been removed from the group as you no longer meet the token requirements.`,
            );
          } catch (e) {}
        } catch {
          failedKicks++;
        }
      } else {
        verifiedCount++;
      }
    }
  }
  return NextResponse.json({
    ok: true,
    message: `Verification complete. Verified: ${verifiedCount}, Kicked: ${kickedCount}, Failed to kick: ${failedKicks}.`,
  });
}
