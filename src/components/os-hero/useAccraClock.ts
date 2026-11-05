"use client";

import { useEffect, useState } from "react";

function formatAccra(date: Date): { dateLabel: string; timeLabel: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Accra",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    dateLabel: `${pick("weekday")} ${pick("day")} ${pick("month")}`,
    timeLabel: `${pick("hour")}:${pick("minute")}`,
  };
}

export function useAccraClock(): { dateLabel: string; timeLabel: string } | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return now ? formatAccra(now) : null;
}
