"use client";
import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role:    "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  role:    "assistant",
  content: "Hey there. Tell me a bit about your project and I'll point you to the right service.",
};

const QUICK_PROMPTS = [
  "I need a brand identity",
  "I need a website built",
  "I have a campaign idea",
  "I need 3D signage",
];

export function AiChatWidget() {
  const [messages,   setMessages]   = useState<Message[]>([INITIAL_MESSAGE]);
  const [input,      setInput]      = useState("");
  const [loading,    setLoading]    = useState(false);
  const [showSend,   setShowSend]   = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const userMessages = messages.filter((m) => m.role === "user");
    if (userMessages.length >= 3) setShowSend(true);
  }, [messages]);

  const send = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setShowPrompts(false);
    const userMsg: Message = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
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
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const { text: t } = JSON.parse(data);
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: updated[updated.length - 1].content + t,
                };
                return updated;
              });
            } catch { /* ignore */ }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again or reach out directly on WhatsApp.",
        };
        return updated;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, loading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const buildWhatsAppMessage = () => {
    const conversation = messages
      .filter((_, i) => i > 0)
      .map((m) => `${m.role === "user" ? "Client" : "Motivo AI"}: ${m.content}`)
      .join("\n\n");
    const text = encodeURIComponent(
      `Hello Motivo,\n\nI'd like to discuss a project.\n\n--- Brief ---\n${conversation}\n\nLooking forward to hearing from you.`
    );
    return `https://wa.me/233549467175?text=${text}`;
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      height: "calc(100vh - 180px)", minHeight: "500px",
    }}>
      {/* Chat header bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "16px 20px",
        background: "#080808",
        borderRadius: "16px 16px 0 0",
        flexShrink: 0,
      }}>
        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "linear-gradient(135deg, #ED1C24, #B5151B)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "14px", color: "#fff",
          }}>M</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: "13px",
            fontWeight: 500, color: "#F5F5F0", lineHeight: 1.2,
          }}>
            Motivo
          </div>
          <div style={{
            fontFamily: "var(--font-sans)", fontSize: "10px",
            color: "rgba(245,245,240,0.4)", lineHeight: 1.3,
            display: "flex", alignItems: "center", gap: "5px",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#4ADE80", display: "inline-block",
            }} />
            Creative strategist · Online
          </div>
        </div>
        {/* Close-style dot menu (decorative) */}
        <div style={{ display: "flex", gap: "3px" }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: 4, height: 4, borderRadius: "50%",
              background: "rgba(245,245,240,0.25)",
            }} />
          ))}
        </div>
      </div>

      {/* Messages area */}
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowY: "auto", scrollbarWidth: "none",
          background: "#fff",
          padding: "24px 20px 16px",
          display: "flex", flexDirection: "column", gap: "4px",
        }}
      >
        {/* Date pill */}
        <div style={{
          textAlign: "center", marginBottom: "16px",
        }}>
          <span style={{
            fontFamily: "var(--font-sans)", fontSize: "10px",
            color: "rgba(8,8,8,0.3)", background: "rgba(8,8,8,0.04)",
            padding: "4px 12px", borderRadius: "100px",
            letterSpacing: "0.04em",
          }}>
            Today
          </span>
        </div>

        {messages.map((msg, i) => {
          const isUser = msg.role === "user";
          const isLast = i === messages.length - 1;
          const showTyping = loading && isLast && !isUser && !msg.content;

          return (
            <div key={i} style={{
              display: "flex", flexDirection: "column",
              alignItems: isUser ? "flex-end" : "flex-start",
              marginBottom: "12px",
            }}>
              {/* Message bubble */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px",
                flexDirection: isUser ? "row-reverse" : "row",
                maxWidth: "82%",
              }}>
                {/* Avatar for assistant */}
                {!isUser && (
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#080808", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "2px",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-display)", fontWeight: 700,
                      fontSize: "10px", color: "#F5F5F0",
                    }}>M</span>
                  </div>
                )}

                <div style={{
                  padding: "10px 14px",
                  borderRadius: isUser
                    ? "14px 14px 4px 14px"
                    : "4px 14px 14px 14px",
                  background: isUser ? "#080808" : "#f4f4f0",
                  border: isUser ? "none" : "0.5px solid rgba(8,8,8,0.06)",
                }}>
                  {showTyping ? (
                    <div style={{ display: "flex", gap: "4px", padding: "4px 2px" }}>
                      {[0, 1, 2].map((d) => (
                        <div key={d} style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "rgba(8,8,8,0.2)",
                          animation: `dotPulse 1.2s ease-in-out ${d * 0.15}s infinite`,
                        }} />
                      ))}
                    </div>
                  ) : (
                    <p style={{
                      fontFamily: "var(--font-sans)", fontSize: "13px",
                      color: isUser ? "#F5F5F0" : "rgba(8,8,8,0.8)",
                      lineHeight: 1.55, margin: 0, whiteSpace: "pre-wrap",
                    }}>
                      {msg.content}
                      {loading && isLast && !isUser && msg.content && (
                        <span style={{
                          display: "inline-block", width: "2px", height: "13px",
                          background: "#ED1C24", marginLeft: "2px",
                          verticalAlign: "middle",
                          animation: "cursorBlink 0.8s step-end infinite",
                        }} />
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Timestamp */}
              <span style={{
                fontFamily: "var(--font-sans)", fontSize: "9px",
                color: "rgba(8,8,8,0.25)", marginTop: "4px",
                paddingLeft: isUser ? 0 : "36px",
                paddingRight: isUser ? "0" : 0,
              }}>
                {timeStr}
              </span>
            </div>
          );
        })}

        {/* Quick-reply chips */}
        {showPrompts && !loading && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "8px",
            paddingLeft: "36px", marginTop: "4px",
          }}>
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => send(prompt)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(8,8,8,0.12)",
                  borderRadius: "100px",
                  padding: "7px 14px",
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  color: "rgba(8,8,8,0.55)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#ED1C24";
                  e.currentTarget.style.color = "#ED1C24";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(8,8,8,0.12)";
                  e.currentTarget.style.color = "rgba(8,8,8,0.55)";
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Send brief banner */}
        {showSend && !loading && (
          <div style={{
            margin: "8px 0 0 36px",
            padding: "12px 16px",
            background: "rgba(237,28,36,0.06)",
            border: "1px solid rgba(237,28,36,0.15)",
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: "12px",
                fontWeight: 500, color: "#080808", marginBottom: "2px",
              }}>
                Ready to go further?
              </div>
              <div style={{
                fontFamily: "var(--font-sans)", fontSize: "10px",
                color: "rgba(8,8,8,0.4)",
              }}>
                Send this conversation as a brief to the team
              </div>
            </div>
            <a
              href={buildWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#ED1C24", border: "none", borderRadius: "100px",
                padding: "8px 16px", fontFamily: "var(--font-sans)",
                fontSize: "11px", fontWeight: 500, color: "#fff",
                cursor: "pointer", textDecoration: "none",
                display: "flex", alignItems: "center", gap: "4px",
                transition: "background 0.2s ease", flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#B5151B")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#ED1C24")}
            >
              Send via WhatsApp
              <span style={{ fontSize: "12px" }}>→</span>
            </a>
          </div>
        )}
      </div>

      {/* Input area */}
      <div style={{
        display: "flex", alignItems: "flex-end", gap: "8px",
        padding: "12px 16px",
        background: "#fff",
        borderTop: "0.5px solid rgba(8,8,8,0.06)",
        borderRadius: "0 0 16px 16px",
      }}>
        <textarea
          ref={inputRef}
          className="contact-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          style={{
            flex: 1, background: "rgba(8,8,8,0.03)",
            border: "1px solid rgba(8,8,8,0.08)", borderRadius: "12px",
            padding: "10px 14px", fontFamily: "var(--font-sans)",
            fontSize: "13px", color: "#080808", resize: "none",
            outline: "none", lineHeight: 1.5, maxHeight: "100px",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(8,8,8,0.2)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(8,8,8,0.08)")}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: input.trim() && !loading ? "#ED1C24" : "rgba(8,8,8,0.06)",
            border: "none", display: "flex",
            alignItems: "center", justifyContent: "center",
            cursor: input.trim() && !loading ? "pointer" : "default",
            transition: "all 0.2s ease", flexShrink: 0,
          }}
        >
          {/* Arrow icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            style={{ transform: "rotate(-45deg)" }}
          >
            <path d="M5 12h14M12 5l7 7-7 7"
              stroke={input.trim() && !loading ? "#fff" : "rgba(8,8,8,0.25)"}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes dotPulse {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
