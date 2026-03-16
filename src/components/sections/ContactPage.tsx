"use client";
import { AiChatWidget }   from "@/components/contact/AiChatWidget";
import { ContactSidebar }  from "@/components/contact/ContactSidebar";

export function ContactPage() {
  return (
    <div
      style={{
        background:    "#F5F5F0",
        minHeight:     "100vh",
        paddingTop:    "80px",
        display:       "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin:   "0 auto",
          width:    "100%",
          padding:  "32px 48px 48px",
          display:  "grid",
          gridTemplateColumns: "1fr 340px",
          gap:      "48px",
          flex:     1,
        }}
      >
        {/* Left — header + AI chat */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "28px" }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: 500,
              letterSpacing: "0.14em", textTransform: "uppercase" as const,
              color: "rgba(8,8,8,0.3)", display: "block", marginBottom: "12px",
            }}>
              Start your brief
            </span>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 52px)", color: "#080808",
              letterSpacing: "-0.02em", lineHeight: 1.0, margin: 0,
            }}>
              Tell us what<br />
              you&apos;re <span style={{ color: "#ED1C24", fontStyle: "italic" }}>building.</span>
            </h1>
          </div>
          <AiChatWidget />
        </div>

        {/* Right — contact details */}
        <ContactSidebar />
      </div>
    </div>
  );
}
