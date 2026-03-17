"use client";

import { SafeLink } from "@/components/ui/SafeLink";
import { type Service } from "@/data/services";

interface Props {
  data: Service[];
}

export function ServicesMobile({ data }: Props) {
  return (
    <div style={{ padding: "24px 20px 40px", background: "#F5F5F0" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {data.map((svc) => (
          <div
            key={svc.id}
            style={{
              background:   "#ffffff",
              borderRadius: "14px",
              overflow:     "hidden",
              border:       "0.5px solid rgba(237,28,36,0.25)",
              boxShadow:    "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            {/* Header: num + arrow */}
            <div
              style={{
                display:         "flex",
                justifyContent:  "space-between",
                alignItems:      "flex-start",
                padding:         "18px 18px 0",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize:   "11px",
                  color:      "rgba(8,8,8,0.25)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {svc.num}
              </span>
              <span style={{ fontSize: "14px", color: "rgba(237,28,36,0.7)" }}>↗</span>
            </div>

            {/* Image */}
            <div
              style={{
                margin:       "0 16px 16px",
                borderRadius: "10px",
                overflow:     "hidden",
                height:       "180px",
              }}
            >
              <img
                src={svc.thumbnail}
                alt={svc.name}
                style={{
                  width:     "100%",
                  height:    "100%",
                  objectFit: "cover",
                  display:   "block",
                }}
              />
            </div>

            {/* Content */}
            <div style={{ padding: "0 18px 18px" }}>
              {/* Title + badge */}
              <div
                style={{
                  display:       "flex",
                  alignItems:    "center",
                  gap:           "10px",
                  marginBottom:  "10px",
                  flexWrap:      "wrap",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize:   "22px",
                    color:     "#080808",
                    margin:     0,
                    lineHeight: 1.2,
                  }}
                >
                  {svc.name}
                </h3>
                {svc.tag && (
                  <span
                    style={{
                      fontSize:      "9px",
                      padding:       "3px 8px",
                      borderRadius: "100px",
                      border:       "0.5px solid rgba(8,8,8,0.12)",
                      color:        "rgba(8,8,8,0.4)",
                      background:   "rgba(8,8,8,0.04)",
                      whiteSpace:   "nowrap",
                    }}
                  >
                    {svc.tag}
                  </span>
                )}
              </div>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize:   "12px",
                  color:     "rgba(8,8,8,0.45)",
                  lineHeight: 1.6,
                  margin:    "0 0 14px 0",
                }}
              >
                {svc.description}
              </p>

              {/* Bullet list */}
              <ul
                style={{
                  display:       "flex",
                  flexDirection: "column",
                  gap:          "6px",
                  padding:     0,
                  margin:      "0 0 16px 0",
                  listStyle:    "none",
                }}
              >
                {svc.items.slice(0, 4).map((item) => (
                  <li
                    key={item}
                    style={{
                      display:       "flex",
                      alignItems:    "center",
                      gap:          "8px",
                      fontFamily:   "var(--font-sans)",
                      fontSize:     "11px",
                      color:        "rgba(8,8,8,0.5)",
                    }}
                  >
                    <span
                      style={{
                        width:        "4px",
                        height:       "4px",
                        borderRadius: "50%",
                        background:   "rgba(8,8,8,0.35)",
                        flexShrink:   0,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA button */}
              <SafeLink
                href={`/work?cat=${svc.workSlug}`}
                killScrollTrigger
                style={{
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "space-between",
                  width:           "100%",
                  padding:         "12px 16px",
                  background:     "rgba(237,28,36,0.1)",
                  border:         "0.5px solid rgba(237,28,36,0.25)",
                  borderRadius:   "8px",
                  fontFamily:     "var(--font-sans)",
                  fontSize:       "13px",
                  fontWeight:     600,
                  color:          "#ED1C24",
                  textDecoration: "none",
                  transition:     "background 0.2s ease",
                }}
              >
                <span>See {svc.name.toLowerCase()} work</span>
                <span>→</span>
              </SafeLink>
            </div>
          </div>
        ))}
      </div>

      <p
        style={{
          marginTop:   "32px",
          fontFamily:  "var(--font-sans)",
          fontSize:    "10px",
          color:      "rgba(8,8,8,0.25)",
          textAlign:   "center",
          lineHeight:  1.5,
          padding:     "0 8px",
        }}
      >
        All services available as standalone or bundled together.
      </p>
    </div>
  );
}
