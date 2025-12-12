import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import resumeData from "./resume.json";

export async function POST(req: NextRequest) {
  try {
    // Simple origin check: only allow requests from localhost (dev) or production domains
    const host = req.headers.get("host") || "";
    const isLocalhost =
      host.includes("localhost") || host.includes("127.0.0.1");
    const isProduction =
      host === "winxp-resume.vercel.app" ||
      host === "connorhutchy.com" ||
      host === "www.connorhutchy.com";

    if (!isLocalhost && !isProduction) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Log user message
    const userIp =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";
    const timestamp = new Date().toISOString();

    console.log(
      JSON.stringify({
        type: "chat_message",
        timestamp,
        host,
        userIp: userIp.split(",")[0].trim(), // Get first IP if multiple
        userAgent,
        message: message.substring(0, 500), // Limit length for logging
        messageLength: message.length,
        hasHistory: !!history && history.length > 0,
        historyLength: history?.length || 0,
      })
    );

    // Store userIp for use in response logging
    const loggedUserIp = userIp.split(",")[0].trim();

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "API key is not configured" },
        { status: 500 }
      );
    }

    const systemPrompt = `${resumeData.scope}
        ${
          resumeData.conversation_guidelines.tone
            ? `Tone: ${resumeData.conversation_guidelines.tone}`
            : ""
        }
        ${
          resumeData.conversation_guidelines.style
            ? `Style: ${resumeData.conversation_guidelines.style}`
            : ""
        }
        ${
          resumeData.conversation_guidelines.scope_enforcement
            ? `Scope: ${resumeData.conversation_guidelines.scope_enforcement}`
            : ""
        }

        RESUME DATA:
        ${JSON.stringify(resumeData, null, 2)}

        IMPORTANT INSTRUCTIONS:
        - Keep responses SHORT and CONCISE (2-4 sentences maximum, unless asked for details)
        - Use markdown formatting: **bold** for emphasis, *italic* for subtle emphasis
        - Break long answers into multiple short message bubbles if needed
        - Be conversational and friendly like MSN Messenger chat
        - Reference specific details from the resume data when answering questions
        - Keep emojis to a minimum
    `;

    // Build messages array with history and current message
    const messagesArray =
      history && Array.isArray(history)
        ? [...history, { role: "user" as const, content: message }]
        : [{ role: "user" as const, content: message }];

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-0",
      system: systemPrompt,
      messages: messagesArray,
      max_tokens: 1024,
    });

    const reply =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Log bot response
    console.log(
      JSON.stringify({
        type: "chat_response",
        timestamp: new Date().toISOString(),
        host,
        userIp: loggedUserIp,
        replyLength: reply.length,
        replyPreview: reply.substring(0, 200), // First 200 chars for preview
        tokensUsed: response.usage?.output_tokens || 0,
      })
    );

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
