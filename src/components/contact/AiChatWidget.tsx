"use client";
import { useState, useRef, useEffect } from "react";

interface Message {
  role:    "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role:    "assistant",
  content: "Hey, what are you building? Tell me about your project and I'll point you to the right service.",
};

export function AiChatWidget() {
  const [messages,  setMessages]  = useState<Message[]>([INITIAL_MESSAGE]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [showSend,  setShowSend]  = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show "Send brief" after 3+ exchanges
  useEffect(() => {
    const userMessages = messages.filter((m) => m.role === "user");
    if (userMessages.length >= 3) setShowSend(true);
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages      = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Add empty assistant message to stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          messages: newMessages.map((m) => ({
            role:    m.role,
            content: m.content,
          })),
        }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer      = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const { text } = JSON.parse(data);
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role:    "assistant",
                  content: updated[updated.length - 1].content + text,
                };
                return updated;
              });
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role:    "assistant",
          content: "Sorry, something went wrong. Please try again or reach out directly on WhatsApp.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Build WhatsApp pre-filled message
  const buildWhatsAppMessage = () => {
    const conversation = messages
      .filter((m) => m.role !== "assistant" || messages.indexOf(m) > 0)
      .map((m) => `${m.role === "user" ? "Client" : "Motivo AI"}: ${m.content}`)
      .join("\n\n");

    const text = encodeURIComponent(
      `Hello Motivo,\n\nI'd like to discuss a project.\n\n--- Brief conversation ---\n${conversation}\n\nLooking forward to hearing from you.`
    );
    return `https://wa.me/233549467175?text=${text}`;
  };

  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        height:        "calc(100vh - 220px)",
        minHeight:     "500px",
        paddingRight:  "40px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <span style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      "10px",
          fontWeight:    500,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color:         "rgba(8,8,8,0.3)",
          display:       "block",
          marginBottom:  "12px",
        }}>
          Start your brief
        </span>
        <h1 style={{
          fontFamily:    "var(--font-display)",
          fontWeight:    700,
          fontSize:      "clamp(28px, 3.5vw, 52px)",
          color:         "#080808",
          letterSpacing: "-0.02em",
          lineHeight:    1.0,
          margin:        0,
        }}>
          Tell us what<br />
          you&apos;re <span style={{ color: "#ED1C24", fontStyle: "italic" }}>building.</span>
        </h1>
      </div>

      {/* Messages */}
      <div
        style={{
          flex:           1,
          overflowY:      "auto",
          scrollbarWidth: "none",
          display:        "flex",
          flexDirection:  "column",
          gap:            "16px",
          paddingBottom:  "16px",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display:       "flex",
              flexDirection: "column",
              alignItems:    msg.role === "user" ? "flex-end" : "flex-start",
              gap:           "4px",
            }}
          >
            <span style={{
              fontFamily:    "var(--font-sans)",
              fontSize:      "9px",
              color:         "rgba(8,8,8,0.3)",
              letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
            }}>
              {msg.role === "user" ? "You" : "Motivo"}
            </span>
            <div
              style={{
                maxWidth:     "85%",
                padding:      "12px 16px",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
                background:   msg.role === "user"
                  ? "#ED1C24"
                  : "rgba(8,8,8,0.04)",
                border:       msg.role === "user"
                  ? "none"
                  : "0.5px solid rgba(8,8,8,0.1)",
              }}
            >
              <p style={{
                fontFamily: "var(--font-sans)",
                fontSize:   "13px",
                color:      msg.role === "user" ? "#ffffff" : "rgba(8,8,8,0.8)",
                lineHeight: 1.6,
                margin:     0,
              }}>
                {msg.content}
                {/* Typing cursor on last assistant message while loading */}
                {loading && i === messages.length - 1 && msg.role === "assistant" && (
                  <span style={{
                    display:         "inline-block",
                    width:           "2px",
                    height:          "13px",
                    background:      "#ED1C24",
                    marginLeft:      "2px",
                    verticalAlign:   "middle",
                    animation:       "blink 0.8s step-end infinite",
                  }} />
                )}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Send brief button */}
      {showSend && (
        <a
          href={buildWhatsAppMessage()}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "12px 16px",
            background:     "rgba(237,28,36,0.1)",
            border:         "0.5px solid rgba(237,28,36,0.3)",
            borderRadius:   "10px",
            marginBottom:   "12px",
            textDecoration: "none",
            transition:     "background 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(237,28,36,0.18)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(237,28,36,0.1)")}
        >
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize:   "12px",
            fontWeight: 500,
            color:      "#ED1C24",
          }}>
            Send this brief to the team via WhatsApp
          </span>
          <span style={{ color: "#ED1C24", fontSize: "14px" }}>→</span>
        </a>
      )}

      {/* Input */}
      <div
        style={{
          display:      "flex",
          gap:          "10px",
          alignItems:   "flex-end",
          borderTop:    "0.5px solid rgba(8,8,8,0.08)",
          paddingTop:   "16px",
        }}
      >
        <textarea
          ref={inputRef}
          className="contact-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe your project..."
          rows={1}
          style={{
            flex:           1,
            background:     "rgba(8,8,8,0.03)",
            border:         "0.5px solid rgba(8,8,8,0.12)",
            borderRadius:   "10px",
            padding:        "12px 14px",
            fontFamily:     "var(--font-sans)",
            fontSize:       "13px",
            color:          "#080808",
            resize:         "none",
            outline:        "none",
            lineHeight:     1.5,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#ED1C24")}
          onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(8,8,8,0.12)")}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            background:   input.trim() && !loading ? "#ED1C24" : "rgba(8,8,8,0.06)",
            border:       "none",
            borderRadius: "10px",
            padding:      "12px 18px",
            fontFamily:   "var(--font-sans)",
            fontSize:     "12px",
            fontWeight:   500,
            color:        input.trim() && !loading ? "#fff" : "rgba(8,8,8,0.25)",
            cursor:       input.trim() && !loading ? "pointer" : "default",
            transition:   "all 0.2s ease",
            flexShrink:   0,
          }}
        >
          {loading ? "..." : "Send →"}
        </button>
      </div>

      {/* CSS for cursor blink */}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
