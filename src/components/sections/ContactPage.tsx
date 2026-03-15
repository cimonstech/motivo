"use client";
import { AiChatWidget }    from "@/components/contact/AiChatWidget";
import { ContactSidebar }  from "@/components/contact/ContactSidebar";

export function ContactPage() {
  return (
    <div
      style={{
        background:    "#F5F5F0",
        minHeight:     "100vh",
        paddingTop:    "80px", // navbar height
        display:       "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin:   "0 auto",
          width:    "100%",
          padding:  "48px 48px 80px",
          display:  "grid",
          gridTemplateColumns: "1fr 1px 380px",
          gap:      "0",
          flex:     1,
        }}
      >
        {/* Left — AI chat */}
        <AiChatWidget />

        {/* Divider */}
        <div style={{ background: "rgba(8,8,8,0.08)", margin: "0 40px" }} />

        {/* Right — contact details */}
        <ContactSidebar />
      </div>
    </div>
  );
}
