import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, MoveHorizontal, CheckCircle2 } from 'lucide-react';
import { BEFORE_AFTER_ITEMS } from '../data/automotiveData';

export const BeforeAfterSlider: React.FC = () => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeItem = BEFORE_AFTER_ITEMS[activeItemIndex];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  // Global mouse up handling
  useEffect(() => {
    const stopDrag = () => setIsDragging(false);
    window.addEventListener('mouseup', stopDrag);
    return () => window.removeEventListener('mouseup', stopDrag);
  }, []);

  return (
    <section className="relative py-24 bg-[#0a0d13] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161a24] border border-white/10 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
            <span className="text-[11px] font-tech font-bold uppercase tracking-widest text-[#ff5500]">
              TRANSFORMATION SHOWCASE
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
            Before & After Precision.
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 mt-4 leading-relaxed">
            Drag the interactive slider horizontally to inspect our restorative craftsmanship. See the definitive contrast between worn, oxidized parts and our showroom finish.
          </p>

          {/* Scenario Tabs */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
            {BEFORE_AFTER_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItemIndex(idx);
                  setSliderPosition(50);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-tech font-bold uppercase tracking-wider transition-all ${
                  activeItemIndex === idx
                    ? 'bg-[#ff5500] text-white shadow-lg shadow-[#ff5500]/25'
                    : 'bg-[#141822] text-neutral-400 hover:text-white border border-white/8 hover:border-white/20'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Comparison Stage */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-3 flex items-center justify-between text-xs font-tech text-neutral-400">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              {activeItem.beforeLabel}
            </span>
            <span className="flex items-center gap-1.5 text-[#ff5500] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-pulse" />
              {activeItem.afterLabel}
            </span>
          </div>

          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-[380px] sm:h-[480px] w-full rounded-2xl overflow-hidden border border-white/15 select-none cursor-ew-resize shadow-2xl shadow-black/80 bg-neutral-900 group"
          >
            {/* AFTER Image (Full background) */}
            <img
              src={activeItem.afterImg}
              alt={activeItem.afterLabel}
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.9] contrast-[1.05]"
              draggable={false}
            />

            {/* BEFORE Image (Clipped overlay) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={activeItem.beforeImg}
                alt={activeItem.beforeLabel}
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.75] sepia-[0.15]"
                style={{
                  width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
                  maxWidth: 'none'
                }}
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Slider Dividing Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,85,0,0.8)] pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              {/* Drag Handle Knob */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#0d1017] border-2 border-[#ff5500] flex items-center justify-center text-white shadow-2xl">
                <MoveHorizontal className="w-4 h-4 text-[#ff5500] animate-pulse" />
              </div>
            </div>

            {/* Inset Pills for Clarity */}
            <div className="absolute bottom-5 left-5 pointer-events-none">
              <span className="px-3 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-tech font-bold uppercase tracking-widest text-neutral-300">
                BEFORE SERVICE
              </span>
            </div>

            <div className="absolute bottom-5 right-5 pointer-events-none">
              <span className="px-3 py-1 rounded-md bg-[#ff5500]/90 backdrop-blur-md text-[10px] font-tech font-bold uppercase tracking-widest text-white shadow-lg">
                TORQX FINISHED
              </span>
            </div>
          </div>

          {/* Context footnote */}
          <div className="mt-4 p-4 rounded-xl bg-[#11151e] border border-white/6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#ff5500] flex-shrink-0" />
              <span className="text-xs text-neutral-300">
                <strong className="text-white font-semibold">{activeItem.carModel}: </strong>
                {activeItem.description}
              </span>
            </div>
            <span className="text-[11px] font-tech text-neutral-400 whitespace-nowrap">
              Pune Workshop Bay 3
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
