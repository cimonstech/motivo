"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SafeLink } from "@/components/ui/SafeLink";
import { type Service } from "@/data/services";
import { cn } from "@/lib/utils";

interface Props {
  data: Service[];
}

export function ServicesMobile({ data }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIdx((prev) => (prev === i ? null : i));

  return (
    <div className="px-8 md:px-14 lg:px-20 xl:px-24 py-10 bg-[#F5F5F0]">
      <div className="flex flex-col divide-y divide-black/[0.07] border-t border-black/[0.07]">
        {data.map((svc, i) => (
          <div
            key={svc.id}
            className={cn(
              "cursor-pointer transition-colors duration-200",
              openIdx === i ? "bg-black/[0.03]" : "hover:bg-black/[0.02]"
            )}
            onClick={() => toggle(i)}
          >
            <div className="flex items-center gap-4 px-2 py-5">
              <span className="text-[10px] text-black/20 font-sans w-6">
                {svc.num}
              </span>
              <span
                className={cn(
                  "font-display font-medium text-lg flex-1 transition-colors duration-200",
                  openIdx === i ? "text-black" : "text-black/40"
                )}
              >
                {svc.name}
              </span>
              <div className="flex gap-1.5">
                {svc.tags.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className={cn(
                      "text-[8px] px-2 py-0.5 rounded-full border transition-colors duration-200",
                      openIdx === i
                        ? "border-red/30 text-red/70"
                        : "border-black/10 text-black/20"
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <span
                className={cn(
                  "text-white/20 text-lg transition-all duration-300",
                  openIdx === i && "rotate-45 text-red"
                )}
              >
                +
              </span>
            </div>

            <AnimatePresence initial={false}>
              {openIdx === i && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.34, 1.1, 0.64, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-2 pb-6 grid grid-cols-1 gap-5">
                    {/* Thumbnail */}
                    <div
                      style={{
                        width:        "100%",
                        height:       "160px",
                        borderRadius: "8px",
                        overflow:     "hidden",
                        marginBottom: "12px",
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
                    <p className="text-xs text-black/40 leading-relaxed">
                      {svc.description}
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {svc.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-[11px] text-black/30"
                        >
                          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(8,8,8,0.3)", flexShrink: 0 }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <SafeLink
                      href={`/work?cat=${svc.workSlug}`}
                      className="flex items-center justify-between text-xs text-red px-4 py-3 rounded-lg bg-red/10 border border-red/20"
                    >
                      <span>See {svc.name.toLowerCase()} work</span>
                      <span>→</span>
                    </SafeLink>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <p className="mt-8 text-[10px] text-black/20 text-center leading-relaxed px-4">
        All services available as standalone or bundled together.
      </p>
    </div>
  );
}
