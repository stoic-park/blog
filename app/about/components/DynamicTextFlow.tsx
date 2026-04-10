'use client';

import { useEffect, useRef } from 'react';
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';
import type { LayoutCursor } from '@chenglou/pretext';

const FONT = '16px "Inter", sans-serif';
const LINE_HEIGHT = 24;
const OBSTACLE_SIZE = 120;
const GAP = 16;
const BIO =
  '안녕하세요, 프론트엔드 개발자 박성택입니다. 다양한 프로젝트에서 대시보드 서비스, 보고서 다운로드 기능, 국제화 서비스, 디자인 시스템, 모노레포 환경 등을 경험했습니다. 사용자 경험을 최우선으로 생각하며, 성능 최적화와 깔끔한 코드 작성을 추구합니다. 현재는 AI 기반 서비스의 프론트엔드 개발에 집중하고 있습니다.';

export default function DynamicTextFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    function render(containerWidth: number) {
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const isDark = document.documentElement.classList.contains('dark');

      const textColor = isDark ? '#e5e5e5' : '#171717';
      const obstacleBg = isDark ? '#262626' : '#f5f5f5';
      const obstacleBorder = isDark ? '#404040' : '#d4d4d4';
      const initialsColor = isDark ? '#a3a3a3' : '#737373';

      const prepared = prepareWithSegments(BIO, FONT);

      // Layout all lines with variable maxWidth
      type RenderedLine = { text: string; x: number; y: number };
      const renderedLines: RenderedLine[] = [];

      let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
      let lineIndex = 0;

      while (true) {
        const y = lineIndex * LINE_HEIGHT;
        const obstacleBottom = OBSTACLE_SIZE + GAP;
        const isNextToObstacle = y + LINE_HEIGHT <= obstacleBottom;

        const maxWidth = isNextToObstacle
          ? containerWidth - OBSTACLE_SIZE - GAP
          : containerWidth;

        const x = isNextToObstacle ? OBSTACLE_SIZE + GAP : 0;

        if (maxWidth <= 0) {
          lineIndex++;
          continue;
        }

        const line = layoutNextLine(prepared, cursor, maxWidth);
        if (!line) break;

        renderedLines.push({ text: line.text, x, y });
        cursor = line.end;
        lineIndex++;
      }

      const totalLines = renderedLines.length;
      const canvasHeight = Math.max(
        OBSTACLE_SIZE,
        totalLines * LINE_HEIGHT + LINE_HEIGHT
      );

      canvas.width = Math.round(containerWidth * dpr);
      canvas.height = Math.round(canvasHeight * dpr);
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${canvasHeight}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, containerWidth, canvasHeight);

      // Draw obstacle (profile image placeholder)
      const radius = 12;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(OBSTACLE_SIZE - radius, 0);
      ctx.quadraticCurveTo(OBSTACLE_SIZE, 0, OBSTACLE_SIZE, radius);
      ctx.lineTo(OBSTACLE_SIZE, OBSTACLE_SIZE - radius);
      ctx.quadraticCurveTo(OBSTACLE_SIZE, OBSTACLE_SIZE, OBSTACLE_SIZE - radius, OBSTACLE_SIZE);
      ctx.lineTo(radius, OBSTACLE_SIZE);
      ctx.quadraticCurveTo(0, OBSTACLE_SIZE, 0, OBSTACLE_SIZE - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();

      ctx.fillStyle = obstacleBg;
      ctx.fill();
      ctx.strokeStyle = obstacleBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw initials inside obstacle
      ctx.font = '600 24px "Inter", sans-serif';
      ctx.fillStyle = initialsColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SP', OBSTACLE_SIZE / 2, OBSTACLE_SIZE / 2);

      // Draw bio text
      ctx.font = FONT;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      for (const line of renderedLines) {
        ctx.fillText(line.text, line.x, line.y);
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
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
