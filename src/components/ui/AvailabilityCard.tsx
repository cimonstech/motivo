"use client";
import { useRouter } from "next/navigation";

// Update these values manually when availability changes
const AVAILABILITY = {
  nextSlot:       "Q2 2026",
  spotsRemaining: 4,
  totalSpots:     8,
};

export function AvailabilityCard() {
  const router = useRouter();

  const spotsLeft  = AVAILABILITY.spotsRemaining;
  const totalSpots = AVAILABILITY.totalSpots;
  const isFull     = spotsLeft === 0;

  return (
    <div
      style={{
        position:      "absolute",
        top:           "34%",
        right:         0,
        width:         "clamp(200px, 18vw, 260px)",
        background:    "#F5F5F0",
        borderRadius:  "16px",
        padding:       "20px",
        border:        "0.5px solid rgba(245,245,240,0.15)",
        zIndex:        30,
        backdropFilter:"blur(8px)",
        boxShadow:     "0 8px 40px rgba(0,0,0,0.25)",
        pointerEvents:  "auto",
      }}
    >
      {/* Label */}
      <span style={{
        fontFamily:    "var(--font-sans)",
        fontSize:      "9px",
        fontWeight:    600,
        letterSpacing: "0.14em",
        textTransform: "uppercase" as const,
        color:         "rgba(8,8,8,0.35)",
        display:       "block",
        marginBottom:  "12px",
      }}>
        Availability
      </span>

      {/* Next slot */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{
          fontFamily:    "var(--font-sans)",
          fontSize:      "10px",
          color:         "rgba(8,8,8,0.4)",
          margin:        "0 0 3px 0",
        }}>
          Next project slot
        </p>
        <p style={{
          fontFamily:    "var(--font-display)",
          fontWeight:    700,
          fontSize:      "22px",
          color:         "#080808",
          letterSpacing: "-0.02em",
          margin:        0,
          lineHeight:    1,
        }}>
          {AVAILABILITY.nextSlot}
        </p>
      </div>

      {/* Spots remaining */}
      <div style={{ marginBottom: "16px" }}>
        <p style={{
          fontFamily: "var(--font-sans)",
          fontSize:   "10px",
          color:      "rgba(8,8,8,0.4)",
          margin:     "0 0 8px 0",
        }}>
          Spots remaining
        </p>

        {/* Spot indicators */}
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {Array.from({ length: totalSpots }).map((_, i) => (
            <div
              key={i}
              style={{
                width:        "28px",
                height:       "6px",
                borderRadius: "100px",
                background:   i < spotsLeft
                  ? "#ED1C24"
                  : "rgba(8,8,8,0.12)",
                transition:   "background 0.3s ease",
              }}
            />
          ))}
          <span style={{
            fontFamily: "var(--font-sans)",
            fontSize:   "11px",
            fontWeight: 600,
            color:      spotsLeft > 0 ? "#ED1C24" : "rgba(8,8,8,0.4)",
            marginLeft: "4px",
          }}>
            {isFull ? "Full" : `${spotsLeft} left`}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height:       "0.5px",
        background:   "rgba(8,8,8,0.08)",
        marginBottom: "14px",
      }} />

      {/* CTA */}
      <button
        onClick={() => router.push("/contact")}
        style={{
          width:        "100%",
          padding:      "10px 0",
          background:   isFull ? "rgba(8,8,8,0.06)" : "#ED1C24",
          border:       "none",
          borderRadius: "100px",
          fontFamily:   "var(--font-sans)",
          fontSize:     "12px",
          fontWeight:   600,
          color:        isFull ? "rgba(8,8,8,0.4)" : "#ffffff",
          cursor:       isFull ? "default" : "pointer",
          transition:   "background 0.2s ease",
          letterSpacing:"0.02em",
        }}
        disabled={isFull}
        onMouseEnter={(e) => {
          if (!isFull) (e.currentTarget.style.background = "#B5151B");
        }}
        onMouseLeave={(e) => {
          if (!isFull) (e.currentTarget.style.background = "#ED1C24");
        }}
      >
        {isFull ? "Currently full" : "Secure your spot →"}
      </button>
    </div>
  );
}
