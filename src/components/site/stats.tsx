"use client";

import { motion } from "framer-motion";
import { stats } from "@/lib/content";
import { useCountUp } from "@/components/motion/count-up";
import { easeOutExpo } from "@/components/motion/reveal";

function StatItem({
  value,
  suffix,
  label,
  index,
}: {
  value: number;
  suffix: string;
  label: string;
  index: number;
}) {
  const { ref, value: current } = useCountUp(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, ease: easeOutExpo, delay: index * 0.08 }}
      className="flex flex-col items-center gap-1 px-4 py-5 text-center sm:py-6"
    >
      <p className="font-heading text-3xl font-semibold text-white sm:text-4xl">
        <span ref={ref}>{current}</span>
        <span className="text-brand">{suffix}</span>
      </p>
      <p className="text-xs text-white/50 sm:text-sm">{label}</p>
    </motion.div>
  );
}

export function Stats() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-10">
      <div className="glow-brand-left pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-white/10 rounded-[1.75rem] bg-white/[0.03] ring-1 ring-white/10 sm:rounded-full lg:grid-cols-4 lg:divide-x">
        {stats.map((stat, index) => (
          <StatItem key={stat.label} index={index} {...stat} />
        ))}
      </div>
    </section>
  );
}
