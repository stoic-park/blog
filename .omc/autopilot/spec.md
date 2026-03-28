# Blog Refactoring Spec

## 프로젝트 개요
- **타입**: Next.js 14 (App Router) 개인 기술 블로그
- **스택**: TypeScript, Tailwind CSS 3.4, MDX (next-mdx-remote), sugar-high, Giscus, Vercel 배포
- **현재 포스트**: 12개 (posts/), 초안 11개 (drafts/), 서적 2개 (books/)

## 리팩토링 목표
버그 수정, 코드 품질 개선, 구조 정리 — 기능 추가 없이 기존 동작 보존.

## 발견된 문제점 (우선순위별)

### P0 — 즉시 수정 (버그/잘못된 동작)
1. OG 메타데이터 URL `/blog/` → `/post/` 경로 오류 (app/post/[slug]/page.tsx 42, 91줄)
2. `<html lang="en">` → `<html lang="ko">` (SEO/접근성)
3. 프로덕션 `console.log` 2개 제거

### P1 — 단기 (코드 품질)
4. `global.css` 중복 `.prose` 스타일 선언 제거 (~100줄 중복)
5. 다크모드 불일치 수정: `@media (prefers-color-scheme: dark)` → Tailwind `dark:` 클래스 또는 CSS `.dark` selector 통일
6. `parseFrontmatter` (커스텀 정규식) → `gray-matter`로 통합 (books/utils.ts와 일치)
7. Giscus `useTheme()` 호환성 수정 (next-themes ThemeProvider 미설치 문제)
8. `params`, `searchParams` 타입 명시

### P2 — 중기 (구조 개선)
9. 유틸리티 통합: `app/lib/` 디렉토리로 일원화 (post/utils.ts, books/utils.ts, utils/themeControl.ts, app/utils/mediaQuery.ts)
10. Callout 컴포넌트 제네릭화 (5개 개별 → 1개 variant prop)
11. `EnvDebug` 프로덕션 번들 제외 (dynamic import + 조건부 렌더링)
12. `vercel-deploy` 스크립트 수정 (`next export` deprecated 제거)
13. 미사용 `mediaQuery.ts` 제거
14. `tsconfig.json` strict 모드 활성화

### P3 — 장기 (품질 기반)
15. 핵심 유틸 단위 테스트 추가 (parseFrontmatter, slugify, extractTocFromMdx, formatDate)
16. `formatDate` 상대 날짜 계산 정확도 개선
17. PDF 관련 코드 dynamic import로 분리 (~500KB 번들 절감)

## 범위 외 (이번 리팩토링 제외)
- Next.js 15 버전 업그레이드 (breaking changes 별도 작업)
- 새로운 기능 추가
- 디자인 변경
- Books 섹션 공개 여부 결정 (현상 유지)
