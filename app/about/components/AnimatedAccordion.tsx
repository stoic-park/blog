'use client';

import { useEffect, useRef, useState } from 'react';
import { prepare, layout, type PreparedText } from '@chenglou/pretext';

const FONT = '16px "Inter", sans-serif';
const LINE_HEIGHT = 24;
const CONTENT_PADDING = 32; // 16px top + 16px bottom

export type AccordionSection = {
  title: string;
  content: string;
  defaultOpen?: boolean;
};

type SectionState = {
  open: boolean;
  prepared: PreparedText | null;
  height: number;
};

export default function AnimatedAccordion({
  sections,
}: {
  sections: AccordionSection[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sectionStates, setSectionStates] = useState<SectionState[]>(() =>
    sections.map((s) => ({
      open: s.defaultOpen ?? false,
      prepared: null,
      height: 0,
    }))
  );

  // Prepare text (requires canvas) on mount
  useEffect(() => {
    const prepared = sections.map((s) => prepare(s.content, FONT));
    setSectionStates((prev) =>
      prev.map((state, i) => ({ ...state, prepared: prepared[i] }))
    );
  }, [sections]);

  // Calculate heights when prepared text or container width changes
  const calculateHeights = (containerWidth: number, states: SectionState[]) => {
    if (containerWidth <= 0) return states;
    return states.map((state) => {
      if (!state.prepared) return state;
      const result = layout(state.prepared, containerWidth, LINE_HEIGHT);
      return { ...state, height: result.height + CONTENT_PADDING };
    });
  };

  // Track how many sections have been prepared to trigger height recalculation
  const preparedCount = sectionStates.filter((s) => s.prepared !== null).length;

  // Recalculate on prepared text update
  useEffect(() => {
    if (!containerRef.current || preparedCount === 0) return;
    const width = containerRef.current.getBoundingClientRect().width;
    setSectionStates((prev) => calculateHeights(width, prev));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preparedCount]);

  // ResizeObserver: only re-call layout(), not prepare()
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (width <= 0) return;
      setSectionStates((prev) => calculateHeights(width, prev));
    });

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (index: number) => {
    setSectionStates((prev) =>
      prev.map((state, i) =>
        i === index ? { ...state, open: !state.open } : state
      )
    );
  };

  return (
    <div ref={containerRef} className="w-full divide-y divide-gray-200 dark:divide-gray-700">
      {sections.map((section, i) => {
        const state = sectionStates[i];
        const isOpen = state.open;
        const contentHeight = isOpen ? state.height : 0;

        return (
          <div key={i} className="w-full">
            <button
              type="button"
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <span>{section.title}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-4 h-4 w-4 shrink-0 transition-transform duration-300"
                style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div
              style={{
                height: `${contentHeight}px`,
                overflow: 'hidden',
                transition: 'height 300ms ease',
              }}
            >
              <div className="pb-4 pt-0 text-base leading-6 text-gray-600 dark:text-gray-400">
                {section.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
