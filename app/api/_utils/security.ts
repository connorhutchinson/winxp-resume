import { NextRequest, NextResponse } from "next/server";

const ALLOWED_PRODUCTION_HOSTS = [
  "winxp-resume.vercel.app",
  "connorhutchy.com",
  "www.connorhutchy.com",
];

export function validateHost(req: NextRequest): NextResponse | null {
  const host = req.headers.get("host") || "";
  const isLocalhost =
    host.includes("localhost") || host.includes("127.0.0.1");
  const isProduction = ALLOWED_PRODUCTION_HOSTS.includes(host);

  if (!isLocalhost && !isProduction) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

export function withHostValidation(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const hostValidation = validateHost(req);
    if (hostValidation) {
      return hostValidation;
    }
    return handler(req);
  };
}

