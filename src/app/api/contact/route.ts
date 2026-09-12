import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields (Name, Email, Subject, Message) are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const emailUser = process.env.EMAIL_USER || "saifzayat@gmail.com";
    const emailPass = process.env.EMAIL_PASS;
    const emailTo = process.env.EMAIL_TO || emailUser;

    // Mailto fallback URL if SMTP credentials are missing or default placeholder
    const mailtoFallback = `mailto:${emailTo}?subject=${encodeURIComponent(
      `[Portfolio Contact] ${subject}`
    )}&body=${encodeURIComponent(
      `From: ${name} (${email})\n\nMessage:\n${message}`
    )}`;

    if (!emailPass || emailPass === "your_16_character_app_password_here") {
      return NextResponse.json(
        {
          error:
            "Email service is not yet configured. Please set your Gmail App Password in .env.local (EMAIL_PASS).",
          fallbackMailto: mailtoFallback,
          needsConfig: true,
        },
        { status: 503 }
      );
    }

    // Configure Nodemailer Gmail Transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass.replace(/\s+/g, ""), // Remove any spaces in 16-char app password
      },
    });

    const sanitizedMessage = String(message)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>");

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 24px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #0d0d0d; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(90deg, #f6c14c, #fceabb, #b2892f); color: #000; padding: 20px 24px; font-weight: bold; font-size: 20px; }
    .content { padding: 24px; }
    .field-card { background-color: #141414; border: 1px solid #222; border-radius: 8px; padding: 14px 18px; margin-bottom: 16px; }
    .label { color: #f6c14c; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; margin-bottom: 4px; }
    .value { color: #e5e5e5; font-size: 15px; }
    .message-box { background-color: #141414; border-left: 3px solid #f6c14c; border-radius: 4px; padding: 16px; color: #e5e5e5; line-height: 1.6; font-size: 14px; margin-top: 12px; }
    .btn { display: inline-block; background: linear-gradient(90deg, #f6c14c, #b2892f); color: #000 !important; font-weight: bold; padding: 12px 24px; border-radius: 25px; text-decoration: none; margin-top: 20px; }
    .footer { padding: 16px 24px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #1a1a1a; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ✉️ New Message from Portfolio
    </div>
    <div class="content">
      <div class="field-card">
        <div class="label">Sender Name</div>
        <div class="value">${name}</div>
      </div>
      <div class="field-card">
        <div class="label">Sender Email</div>
        <div class="value"><a href="mailto:${email}" style="color: #f6c14c; text-decoration: none;">${email}</a></div>
      </div>
      <div class="field-card">
        <div class="label">Subject</div>
        <div class="value">${subject}</div>
      </div>
      <div class="field-card">
        <div class="label">Message</div>
        <div class="message-box">${sanitizedMessage}</div>
      </div>
      <a href="mailto:${email}?subject=${encodeURIComponent("Re: " + subject)}" class="btn">
        Reply Directly to ${name}
      </a>
    </div>
    <div class="footer">
      This message was submitted via your Portfolio Contact Form.
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: `"Portfolio Contact Form" <${emailUser}>`,
      to: emailTo,
      replyTo: `"${name}" <${email}>`,
      subject: `[Portfolio Contact] ${subject} - from ${name}`,
      text: `New message from: ${name} (${email})\n\nSubject: ${subject}\n\nMessage:\n${message}`,
      html: htmlContent,
    });

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error: unknown) {
    console.error("Failed to send contact email:", error);
    const msg = error instanceof Error ? error.message : "Failed to send email";
    return NextResponse.json(
      {
        error: `Failed to send email: ${msg}`,
      },
      { status: 500 }
    );
  }
}
