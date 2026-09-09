import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const configuredPass = (process.env.PASSWORD_ADMIN || "").trim();

    // Accept configured environment variable, or fallback passwords
    const validPasswords = [
      configuredPass,
      "Messi10CN7Wb",
      "Messi10Ben",
    ].filter(Boolean);

    const enteredPass = typeof password === "string" ? password.trim() : "";

    if (enteredPass && validPasswords.includes(enteredPass)) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  } catch {
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
