import {
  getMint as internalgetMint,
  getAccount as internalgetAccount,
  getAssociatedTokenAddress,
} from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";
import * as crypto from "crypto";

const rpc = process.env.SOLANA_RPC_URL;
if (!rpc) throw new Error("SOLANA_RPC_URL environment variable not found.");
const connection = new Connection(rpc, "confirmed");

export function generateNonce(): string {
  const buffer = crypto.randomBytes(4);
  return buffer.toString("hex");
}

export async function isValidTokenMint(mintAddress: string): Promise<boolean> {
  let mintPublicKey: PublicKey;
  try {
    mintPublicKey = new PublicKey(mintAddress);
  } catch {
    return false;
  }
  try {
    await internalgetMint(connection, mintPublicKey);
    return true;
  } catch (error) {
    return false;
  }
}

export async function getMint(mint: PublicKey) {
  return internalgetMint(connection, mint);
}

export async function getAccount(account: PublicKey) {
  return internalgetAccount(connection, account);
}

export async function checkTokenBalance(
  mintAddress: string,
  requiredAmount: number | null,
  userWallet: string,
): Promise<boolean> {
  try {
    const mintPublicKey = new PublicKey(mintAddress);
    const userWalletPublicKey = new PublicKey(userWallet);
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
    } catch (e) {
      userRawBalance = BigInt(0);
    }
    if (requiredAmount && requiredAmount > 0) {
      const requiredRawAmount = BigInt(requiredAmount) * BigInt(10 ** decimals);
      return userRawBalance >= requiredRawAmount;
    }
    if (requiredAmount === null) {
      return userRawBalance > BigInt(0);
    }
    return true;
  } catch (e) {
    console.error(
      `Balance check failed for ${userWallet} on mint ${mintAddress}:`,
      e,
    );
    return false;
  }
}
