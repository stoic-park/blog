---
name: blog-feature
description: 이 블로그에 새 기능/컴포넌트를 추가하는 스킬. Next.js 14, TypeScript, Tailwind CSS, MDX 컴포넌트 개발. 트리거: "컴포넌트 추가", "기능 구현", "블로그에 X 추가", "새 페이지", UI 수정 요청. 단순 CSS 수정에는 사용하지 않음.
---

# Blog Feature Skill

이 블로그(Next.js 14 App Router + MDX + Tailwind CSS MD3 토큰)에 새 기능을 구현하는 스킬.

## 아키텍처 규칙

### 컴포넌트 위치

| 용도 | 위치 |
|------|------|
| MDX에서 사용하는 컴포넌트 | `app/components/CustomComponents/{Name}.tsx` |
| 일반 UI 컴포넌트 | `app/components/{Name}.tsx` |
| 페이지 | `app/{route}/page.tsx` |
| 유틸리티 함수 | `app/lib/{domain}.ts` |
| 커스텀 훅 | `app/hooks/use{Name}.ts` |

### MDX 컴포넌트 등록

`app/components/CustomComponents/` 에 새 컴포넌트를 추가하면, `app/components/mdx.tsx`의 `components` 객체에 등록해야 MDX에서 사용 가능:

```typescript
// app/components/mdx.tsx
const components = {
  // 기존 컴포넌트들...
  NewComponent: ({ ...props }) => <NewComponent {...props} />,
}
```

## 디자인 시스템 (반드시 준수)

### CSS 변수 토큰 사용

임의의 색상값(`#abc123`, `rgb(...)`) 대신 CSS 변수를 통한 Tailwind 커스텀 클래스 사용:

```tsx
// 올바른 사용
<div className="bg-surface text-on-surface border border-outline">
  <span className="text-primary">강조</span>
</div>

// 잘못된 사용
<div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
```

### 사용 가능한 커스텀 색상 클래스

```
bg-surface           text-on-surface
bg-surface-variant   text-on-surface-variant
bg-primary           text-primary
text-on-primary
border-outline       border-outline-variant
```

### 다크모드

`next-themes` + CSS 변수 방식이므로 대부분 `dark:` prefix 불필요.
단, 일부 명시적 다크모드가 필요한 경우: `dark:bg-...`, `dark:text-...`

### 폰트 클래스

```
font-headline  → Plus Jakarta Sans (제목용)
font-body      → Inter (기본, 생략 가능)
```

## Server vs Client Component

- **기본값: Server Component** (파일 상단에 `'use client'` 없음)
- `'use client'` 필요한 경우:
  - `useState`, `useEffect` 등 React hooks 사용
  - 브라우저 API 접근 (localStorage, window 등)
  - 이벤트 핸들러가 있는 인터랙티브 컴포넌트

## TypeScript 규칙

- `any` 타입 금지 → 타입 불명확 시 `unknown` 후 타입 가드
- Props에 명시적 인터페이스 정의
- `app/lib/posts.ts`의 기존 타입(`BlogPost`, `Frontmatter` 등) 재사용

## 콘텐츠 파싱 확장

`/posts/` MDX 파일에서 데이터를 가져올 때는 `app/lib/posts.ts`의 기존 함수 활용:
- `getBlogPosts()` — 전체 발행 포스트 목록
- `parseFrontmatter()` — 단일 파일 파싱
- `extractTocFromMdx()` — TOC 생성

새 frontmatter 필드가 필요하면 `parseFrontmatter()`의 반환 타입을 확장한다.

## 반응형 패턴

모바일 우선 작성:
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
```

TOC 사이드바처럼 특정 뷰포트에서만 표시:
```tsx
<aside className="hidden lg:block">  {/* 데스크톱만 */}
```

## 구현 절차

1. 요구사항 분석 — 무엇을 만들 것인지 명확화
2. 관련 기존 파일 읽기 (비슷한 컴포넌트, 사용할 유틸리티)
3. 컴포넌트/기능 구현
4. MDX 컴포넌트면 `mdx.tsx` 등록
5. 테스트 필요 여부 판단 (UI 로직, 유틸리티 함수는 테스트 추가 권장)

## 테스트

테스트 파일 위치:
- 컴포넌트: `app/components/__tests__/{Name}.test.tsx`
- 유틸리티: `app/lib/__tests__/{name}.test.ts`

기존 테스트 패턴 (`nav.test.tsx`, `posts.test.ts`) 참조.
