export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { generateNonce, isValidTokenMint } from "@/lib/crypto";
import { KVConfig } from "@/lib/types";
import { Redis } from "@upstash/redis";
import { Bot, CommandContext, InlineKeyboard, InputFile, webhookCallback } from "grammy";
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const token = process.env.TELEGRAM_BOT_TOKEN;
const secret_env = process.env.TELEGRAM_SECRET;

if (!token)
  throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");
if (!secret_env)
  throw new Error("TELEGRAM_SECRET environment variable not found.");

const redis = Redis.fromEnv();
const bot = new Bot(token);

function getSetupMessage(
  nonce: string,
  mintAddress: string | null,
  tokensAmount: number | null,
): string {
  const mintStatus = mintAddress
    ? `✅ Mint Address: \`${mintAddress.slice(0, 4)}\\.\\.\\.${mintAddress.slice(-4)}\``
    : `❌ Mint Address`;
  const tokensStatus =
    tokensAmount !== null
      ? `✅ Tokens Amount: \`${tokensAmount.toLocaleString()}\``
      : `❌ Tokens Amount`;
  const embed = `*Portal Setup*
Create your portal by pasting this command into a channel I'm admin in\\.
\`/link ${nonce}\`

${mintStatus}
${tokensStatus}`;
  return embed;
}

function getSetupKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("🔑 Set Mint Address", "set_mint")
    .text("💰 Set Tokens Amount", "set_amount")
    .row()
    .text("❌ Reset Mint", "reset_mint")
    .text("🗑️ Reset Amount", "reset_amount");
}

bot.on("chat_join_request", async (ctx) => {
  const joinRequest = ctx.chatJoinRequest;
  const link = joinRequest.invite_link!;
  if (
    link.name &&
    link.name.startsWith("GATE_") &&
    link.creates_join_request &&
    link.creator.is_bot
  ) {
    const tgUserWallet = await redis.get<string>(`link:${link.name}`);
    console.log(tgUserWallet!);
    await redis.set(`user:${joinRequest.from.id}`, `${tgUserWallet!}`);
    await redis.del(`link:${link.name}`);
    try {
      await ctx.api.approveChatJoinRequest(
        joinRequest.chat.id,
        joinRequest.from.id,
      );
    } catch {}
    try {
      await ctx.api.revokeChatInviteLink(joinRequest.chat.id, link.invite_link);
    } catch {}
  }
});

async function ensureAdmins(ctx: CommandContext<any>) {
  if (!ctx.from || !ctx.chat) {
    throw new Error("❌ Invalid context.");
  }
  const chatId = ctx.chat.id;
  const userId = ctx.from.id;
  const botId = (await ctx.api.getMe()).id;
  const userMember = await ctx.api.getChatMember(chatId, userId);
  const botMember = await ctx.api.getChatMember(chatId, botId);
  const isUserAdmin =
    userMember.status === "administrator" || userMember.status === "creator";
  const isBotAdmin =
    botMember.status === "administrator" || botMember.status === "creator";
  if (!isUserAdmin) {
    throw new Error("❌ You must be an administrator to run this command.");
  }
  if (!isBotAdmin) {
    throw new Error("❌ The bot must be an administrator to run this command.");
  }
}

bot.use(async (ctx, next) => {
  if (ctx.callbackQuery) {
    try {
      await ensureAdmins(ctx as any);
    } catch (err) {
      return ctx.answerCallbackQuery({
        text: (err as { message: string }).message,
        show_alert: true,
      });
    }
  }
  return next();
});

bot.command("start", async (ctx) => {
  const welcomeMessage = `🛡️ *Welcome to OpenGuard\\!*

*Token\\-gated Telegram communities\\. Zero manual work\\.*

🔹 *What is OpenGuard?*
A bot that automatically verifies users hold specific Solana tokens before joining your community\\.

🔹 *For Group Admins:*
• Add me to your group as admin
• Run \`/setup\` to configure token requirements
• Run \`/link\` in your channel to create a join portal
• Done\\! I'll handle verification automatically

🔹 *For Users:*
• Click the join button in any token\\-gated channel
• Connect your Solana wallet
• If you have the required tokens, you're in\\!

🔹 *Security:*
✅ Checks token balance every 15 minutes
✅ Removes users who no longer hold tokens
✅ No private keys accessed
✅ Powered by OpenKitx403 protocol

📚 Need help? Use /help
🌐 Website: openguard\\.cc`;

  await ctx.reply(welcomeMessage, {
    parse_mode: "MarkdownV2",
    reply_markup: new InlineKeyboard()
      .url("🌐 Visit Website", "https://openguard.cc")
      .row()
      .url("📖 GitHub", "https://github.com/glowiedev/OpenGuard"),
  });
});

bot.command("help", async (ctx) => {
  const helpMessage = `📚 *OpenGuard Help*

*Commands:*
• \`/start\` \\- Show welcome message
• \`/help\` \\- Show this help menu
• \`/setup\` \\- Configure portal \\(admins only\\)
• \`/link \\[nonce\\]\` \\- Link portal to channel \\(admins only\\)

*For Admins \\- Setting Up:*
1️⃣ Add bot to your group as admin
2️⃣ Run \`/setup\` in the group
3️⃣ Click "Set Mint Address" and paste token address
4️⃣ Click "Set Tokens Amount" and enter minimum amount
5️⃣ Copy the nonce from setup message
6️⃣ Run \`/link \\[nonce\\]\` in your target channel
7️⃣ Done\\! Share the join button

*For Users \\- Joining:*
1️⃣ Click the join button in a token\\-gated channel
2️⃣ Connect your Solana wallet \\(Phantom/Backpack/Solflare\\)
3️⃣ Sign the verification message
4️⃣ If you have required tokens, you'll be approved\\!

*How Verification Works:*
• Bot checks your token balance when you join
• Bot re\\-checks every 15 minutes automatically
• If you sell tokens, you'll be removed
• Always verify URL is \`openguard\\.cc\` before connecting

*Need Support?*
🌐 Website: openguard\\.cc
💬 Developers: @glowiedev @onlyzhynx
📖 GitHub: github\\.com/glowiedev/OpenGuard`;

  await ctx.reply(helpMessage, {
    parse_mode: "MarkdownV2",
  });
});

bot.command("setup", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("❌ This command must be run in a group\\.");
  }
  try {
    await ensureAdmins(ctx);
  } catch (err) {
    return ctx.reply((err as { message: string }).message);
  }

  const configKey = `config:${ctx.chat?.id}`;
  let config = await redis.get<{
    nonce: string;
    mint: string | null;
    amount: number | null;
  }>(configKey);
  if (!config) {
    config = {
      nonce: generateNonce(),
      mint: null,
      amount: null,
    };
    await redis.set(configKey, config);
  }
  const embed = getSetupMessage(config.nonce, config.mint, config.amount);
  await ctx.reply(embed, {
    parse_mode: "MarkdownV2",
    reply_markup: getSetupKeyboard(),
  });
});

bot.command("link", async (ctx) => {
  const nonce = ctx.match;
  if (ctx.chat.type === "private") {
    return ctx.reply(
      "❌ This command must be run in the channel or group you intend to use as the token-gated portal\\.",
    );
  }
  
  // Check if bot is admin
  const chatId = ctx.chat.id;
  const botId = (await ctx.api.getMe()).id;
  const botMember = await ctx.api.getChatMember(chatId, botId);
  const isBotAdmin = botMember.status === "administrator" || botMember.status === "creator";
  
  if (!isBotAdmin) {
    return ctx.reply("❌ The bot must be an administrator to run this command\\.");
  }
  
  // For channels: If someone can post, they're an admin (channels only allow admin posts)
  // For groups: Verify user is actually an admin
  if ((ctx.chat.type === "group" || ctx.chat.type === "supergroup") && ctx.from) {
    try {
      const userId = ctx.from.id;
      const userMember = await ctx.api.getChatMember(chatId, userId);
      const isUserAdmin = userMember.status === "administrator" || userMember.status === "creator";
      if (!isUserAdmin) {
        return ctx.reply("❌ You must be an administrator to run this command\\.");
      }
    } catch (err) {
      return ctx.reply("❌ Could not verify your admin status\\.");
    }
  }
  
  // For channels: Command can only be sent by admins anyway, so we're good to proceed

  const currentChatId = ctx.chat.id;
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
    return ctx.reply("❌ Link failed: Invalid or expired nonce\.");
  }
  if (config.portalChatId) {
    return ctx.reply(
      `❌ Link failed: This setup is already linked to chat ID \`${config.portalChatId}\`\.`,
    );
  }
  // For channels, if the message was posted, the user is an admin (channels don't allow non-admin posts)
  // For groups, verify the user is an admin of the original setup group
  if (ctx.chat.type === "group" || ctx.chat.type === "supergroup") {
    if (!ctx.from) {
      return ctx.reply("❌ Link failed: Could not identify user\\.");
    }
    const originalAdmins = await bot.api.getChatAdministrators(
      foundConfigKey.substring(7),
    );
    if (!!!originalAdmins.find((admin) => admin.user.id === ctx.from.id)) {
      return ctx.reply(
        "❌ Link failed: You must be an admin of the group to link the portal\.",
      );
    }
  }
  // For channels: If they can post the command, they're an admin - skip verification
  config.portalChatId = currentChatId;
  await redis.set(foundConfigKey, config);
  const embedText = `✅ *Portal Linked Successfully*\n\nClick below to verify your wallet\\.`;
  const portalUrl = process.env.NEXT_PUBLIC_DOMAIN! + "/join/" + nonce;
  const joinKeyboard = new InlineKeyboard().url("🚀 Join Portal", portalUrl);
  
  try {
    // Try to send the banner image
    const bannerPath = join(process.cwd(), "public", "banner-channel.png");
    const bannerBuffer = readFileSync(bannerPath);
    await ctx.replyWithPhoto(new InputFile(bannerBuffer), {
      caption: embedText,
      parse_mode: "MarkdownV2",
      reply_markup: joinKeyboard,
    });
  } catch (err) {
    // Fallback to text message if image fails
    await ctx.reply(embedText, {
      parse_mode: "MarkdownV2",
      reply_markup: joinKeyboard,
    });
  }
});

const userState = new Map<number, "mint" | "amount" | null>();
bot.callbackQuery("set_mint", async (ctx) => {
  if (!ctx.from) return;
  userState.set(ctx.from.id, "mint");
  await ctx.answerCallbackQuery({
    text: "Ready to set the Mint Address\. Please send the address in the chat now\.",
    show_alert: false,
  });
});
bot.callbackQuery("set_amount", async (ctx) => {
  if (!ctx.from) return;
  userState.set(ctx.from.id, "amount");
  await ctx.answerCallbackQuery({
    text: "Ready to set the Tokens Amount\\. Please send the minimum number (e\\.g\\., 100000) now\\.",
    show_alert: false,
  });
});
bot.callbackQuery("reset_mint", async (ctx) => {
  await ctx.answerCallbackQuery("Mint Address has been reset.");
  const configKey = `config:${ctx.chat!.id}`;
  const config = await redis.get<KVConfig>(configKey);
  if (!config) {
    return;
  }
  config.mint = null;
  await redis.set(configKey, config);
  const newEmbed = getSetupMessage(config.nonce, config.mint, config.amount);
  await ctx.editMessageText(newEmbed, {
    reply_markup: getSetupKeyboard(),
    parse_mode: "MarkdownV2",
  });
});
bot.callbackQuery("reset_amount", async (ctx) => {
  await ctx.answerCallbackQuery("Tokens Amount has been reset.");
  const configKey = `config:${ctx.chat!.id}`;
  const config = await redis.get<KVConfig>(configKey);
  if (!config) {
    return;
  }
  config.amount = null;
  await redis.set(configKey, config);
  const newEmbed = getSetupMessage(config.nonce, config.mint, config.amount);
  await ctx.editMessageText(newEmbed, {
    reply_markup: getSetupKeyboard(),
    parse_mode: "MarkdownV2",
  });
});

bot.on("message:text", async (ctx) => {
  if (!ctx.from || !ctx.chat) return;
  const userId = ctx.from.id;
  const setting = userState.get(userId);
  if (setting) {
    const input = ctx.message.text.trim();
    const configKey = `config:${ctx.chat!.id}`;
    const config = await redis.get<KVConfig>(configKey);
    if (!config) {
      return ctx.reply(
        "Error: Configuration not found\. Please run /setup again\.",
      );
    }
    let updateSuccess = false;
    if (setting === "mint") {
      if (await isValidTokenMint(input)) {
        config.mint = input;
        updateSuccess = true;
      } else {
        userState.delete(userId);
        await ctx.reply("❌ Invalid Mint Address\.");
      }
    } else if (setting === "amount") {
      const amount = parseInt(input.replace(/,/g, ""));
      if (!isNaN(amount) && amount > 0) {
        config.amount = amount;
        updateSuccess = true;
      } else {
        userState.delete(userId);
        await ctx.reply(
          "❌ Invalid amount\. Please provide a positive integer\.",
        );
      }
    }
    if (updateSuccess) {
      await redis.set(configKey, config);
      const newEmbed = getSetupMessage(
        config.nonce,
        config.mint,
        config.amount,
      );
      await ctx.reply(newEmbed, {
        parse_mode: "MarkdownV2",
        reply_markup: getSetupKeyboard(),
      });
      userState.delete(userId);
    }
  }
});

export async function POST(
  req: NextRequest,
  ctx: RouteContext<"/api/bot/[secret]">,
) {
  const { secret } = await ctx.params;
  if (secret_env === secret) return webhookCallback(bot, "std/http")(req);
  return NextResponse.json(
    {
      error: "invalid_secret",
    },
    {
      status: 403,
    },
  );
}
