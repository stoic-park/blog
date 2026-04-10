'use client';

import { useEffect, useRef, useState } from 'react';
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const FONT = '700 48px "Plus Jakarta Sans", sans-serif';
const LINE_HEIGHT = 64;
const NAME = '박성택';

export default function CanvasHeroName() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [subtitleVisible, setSubtitleVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animationDone = false;

    function render(containerWidth: number) {
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const isDark = document.documentElement.classList.contains('dark');
      const textColor = isDark ? '#ffffff' : '#111111';

      const prepared = prepareWithSegments(NAME, FONT);
      const result = layoutWithLines(prepared, containerWidth, LINE_HEIGHT);

      const canvasWidth = containerWidth;
      const canvasHeight = result.height || LINE_HEIGHT;

      canvas.width = Math.round(canvasWidth * dpr);
      canvas.height = Math.round(canvasHeight * dpr);
      canvas.style.width = `${canvasWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Build per-character metadata for staggered animation
      const chars: Array<{ char: string; x: number; y: number }> = [];
      result.lines.forEach((line, lineIndex) => {
        const y = lineIndex * LINE_HEIGHT + LINE_HEIGHT * 0.8; // baseline
        let x = 0;
        for (const char of line.text) {
          chars.push({ char, x, y });
          ctx.font = FONT;
          x += ctx.measureText(char).width;
        }
      });

      if (chars.length === 0) return;

      // Animate per-character fade-in
      const DURATION_PER_CHAR = 120; // ms
      const STAGGER = 80; // ms between chars
      const totalDuration = DURATION_PER_CHAR + STAGGER * (chars.length - 1);
      let startTime: number | null = null;

      function animate(timestamp: number) {
        if (!canvas) return;
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.font = FONT;

        chars.forEach(({ char, x, y }, i) => {
          const charStart = i * STAGGER;
          const charElapsed = elapsed - charStart;
          const alpha = Math.min(1, Math.max(0, charElapsed / DURATION_PER_CHAR));

          const [r, g, b] = isDark ? [255, 255, 255] : [17, 17, 17];
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.fillText(char, x, y);
        });

        if (elapsed < totalDuration) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          // Final clean draw at full opacity
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.font = FONT;
          ctx.fillStyle = textColor;
          chars.forEach(({ char, x, y }) => {
            ctx.fillText(char, x, y);
          });
          animationDone = true;
          setSubtitleVisible(true);
        }
      }

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      if (!animationDone) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Re-render without animation on resize after initial animation
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.font = FONT;
        ctx.fillStyle = textColor;
        chars.forEach(({ char, x, y }) => {
          ctx.fillText(char, x, y);
        });
      }
    }

    render(container.clientWidth);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          render(width);
        }
      }
    });

    observer.observe(container);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <canvas ref={canvasRef} className="block" />
      <p
        className="mt-2 text-lg text-neutral-500 dark:text-neutral-400 transition-opacity duration-700"
        style={{ opacity: subtitleVisible ? 1 : 0 }}
      >
        Frontend Developer
      </p>
    </div>
  );
}
