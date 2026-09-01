import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, setSoundEnabled, subscribeSound } from "@/lib/sound";

export function SoundToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const unsub = subscribeSound(setOn);
    return () => {
      unsub();
    };
  }, []);

  return (
    <motion.button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Mute interface sound" : "Enable interface sound"}
      onClick={() => setSoundEnabled(!isSoundEnabled())}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.06 }}
      className="glass-panel relative flex h-10 items-center gap-2 rounded-full px-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-signal"
    >
      {on ? <Volume2 className="h-4 w-4 text-signal" /> : <VolumeX className="h-4 w-4" />}
      <span className="hidden sm:inline">{on ? "sound on" : "sound off"}</span>
      {on && (
        <span className="absolute right-3 top-2 h-1.5 w-1.5 rounded-full bg-signal">
          <span className="animate-pulse-ring absolute inset-0 rounded-full bg-signal" />
        </span>
      )}
    </motion.button>
  );
}
