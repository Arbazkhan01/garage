import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { STATS_DATA } from '../data/automotiveData';
import { Award, Car, ThumbsUp, Clock } from 'lucide-react';

export const StatsStrip: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);

  useEffect(() => {
    if (!isInView) return;

    const durations = [1500, 2000, 1800, 1200];
    const targets = STATS_DATA.map(s => s.value);
    const startTimestamp = performance.now();

    const animateCounts = (now: number) => {
      const elapsed = now - startTimestamp;
      const nextCounts = targets.map((target, idx) => {
        const progress = Math.min(elapsed / durations[idx], 1);
        // Easing out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        return Math.floor(ease * target);
      });

      setCounts(nextCounts);

      if (elapsed < Math.max(...durations)) {
        requestAnimationFrame(animateCounts);
      } else {
        setCounts(targets);
      }
    };

    const animId = requestAnimationFrame(animateCounts);
    return () => cancelAnimationFrame(animId);
  }, [isInView]);

  const ICONS = [Award, Car, ThumbsUp, Clock];

  return (
    <section
      ref={containerRef}
      className="relative z-20 border-y border-white/10 bg-gradient-to-b from-[#0e121a] to-[#0a0c10]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
          {STATS_DATA.map((stat, index) => {
            const IconComponent = ICONS[index % ICONS.length];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12 }}
                className={`flex flex-col items-center text-center ${
                  index !== 0 ? 'pt-6 lg:pt-0 lg:pl-6' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#171d28] border border-white/10 flex items-center justify-center text-[#ff5500] mb-3 shadow-inner">
                  <IconComponent className="w-5 h-5" />
                </div>

                <div className="flex items-baseline justify-center gap-0.5">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white tracking-tight">
                    {counts[index].toLocaleString()}
                  </span>
                  <span className="text-2xl sm:text-3xl font-display font-extrabold text-[#ff5500]">
                    {stat.suffix}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-tech font-bold uppercase tracking-wider text-neutral-200 mt-1">
                  {stat.label}
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 max-w-[200px]">
                  {stat.sublabel}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
