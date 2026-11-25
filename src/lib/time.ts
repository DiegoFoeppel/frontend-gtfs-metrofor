const TIME_ZONE = "America/Fortaleza";

/** Minutos desde a meia-noite, no fuso de Fortaleza (independe do fuso do aparelho). */
export function nowMinutes(date = new Date()): number {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get("hour") * 60 + get("minute");
}

/** "HH:MM" ou "HH:MM:SS" → minutos (aceita 24h+, como o padrão GTFS). */
export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export type NextTrain = { time: string; inMinutes: number };

/** Primeiro horário a partir de agora, ou null se não há mais partidas hoje. */
export function nextTrain(horarios: string[], now: number): NextTrain | null {
  let best: NextTrain | null = null;
  for (const time of horarios) {
    const diff = toMinutes(time) - now;
    if (diff >= 0 && (!best || diff < best.inMinutes)) {
      best = { time, inMinutes: diff };
    }
  }
  return best;
}

export function formatEta(inMinutes: number): string {
  if (inMinutes === 0) return "agora";
  if (inMinutes < 60) return `em ${inMinutes} min`;
  const h = Math.floor(inMinutes / 60);
  const m = inMinutes % 60;
  return m ? `em ${h}h${String(m).padStart(2, "0")}` : `em ${h}h`;
}

/** Dias da semana sem operação (0 = domingo). O calendar do feed diz que há serviço todo dia, mas não é verdade. */
export const NO_SERVICE_WEEKDAYS = [0];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function hasServiceToday(date = new Date()): boolean {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
  }).format(date);
  return !NO_SERVICE_WEEKDAYS.includes(WEEKDAYS.indexOf(name));
}
