import {
  createChallenge,
  OpenKit403Config,
  verifyAuthorization,
} from "@openkitx403/server";
import { NextRequest, NextResponse } from "next/server";

interface OpenKitUser {
  address: string;
  challenge: any;
}

export async function handleOpenKitAuth(
  req: NextRequest,
  config: OpenKit403Config,
): Promise<NextResponse | { user: OpenKitUser }> {
  const authHeader = req.headers.get("authorization");
  const path = req.nextUrl.pathname;
  const method = req.method;
  if (!authHeader) {
    const { headerValue } = createChallenge(method, path, config);
    return NextResponse.json(
      {
        error: "wallet_auth_required",
        detail:
          "Sign the challenge using your Solana wallet and resend the request.",
      },
      {
        status: 403,
        headers: {
          "WWW-Authenticate": headerValue,
        },
      },
    );
  }
  const requestHeaders = Object.fromEntries(req.headers.entries());
  const result = await verifyAuthorization(
    authHeader,
    method,
    path,
    config,
    requestHeaders,
  );
  if (!result.ok) {
    const { headerValue } = createChallenge(method, path, config);
    return NextResponse.json(
      {
        error: result.error,
        detail: "Authentication failed. Please sign the new challenge.",
      },
      {
        status: 403,
        headers: {
          "WWW-Authenticate": headerValue,
        },
      },
    );
  }
  const user: OpenKitUser = {
    address: result.address!,
    challenge: result.challenge,
  };
  return { user };
}
