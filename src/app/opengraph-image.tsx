import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "Motivo Studio - Creative Practice, Accra Ghana";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:     "#080808",
          width:          "100%",
          height:         "100%",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          fontFamily:     "sans-serif",
        }}
      >
        <div
          style={{
            fontSize:      80,
            fontWeight:    700,
            color:         "#F5F5F0",
            letterSpacing: "-2px",
            lineHeight:    1,
          }}
        >
          MOTIVO
        </div>
        <div
          style={{
            fontSize:      24,
            color:         "rgba(245,245,240,0.5)",
            marginTop:     16,
            letterSpacing: "0.1em",
          }}
        >
          STUDIO
        </div>
        <div
          style={{
            fontSize:      18,
            color:         "#ED1C24",
            marginTop:     32,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Built properly. · Accra, Ghana
        </div>
      </div>
    ),
    { ...size }
  );
}
