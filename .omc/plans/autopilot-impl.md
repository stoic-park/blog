# 구현 계획: Next.js 개인 기술블로그 리팩토링

> 생성일: 2026-03-28
> 스펙 기반: `.omc/autopilot/spec.md`
> 원칙: 기능 추가 없이 버그 수정, 코드 품질 개선, 구조 정리. 기존 동작 보존.

---

## Phase 1 — P0 즉시 수정 (버그/잘못된 동작)

### T01: OG 메타데이터 URL 경로 수정
- **설명**: `/blog/${post.slug}` → `/post/${post.slug}` 경로 수정. 실제 라우트는 `/post/[slug]`이므로 OG URL과 JSON-LD URL이 잘못됨.
- **수정 대상 파일**: `app/post/[slug]/page.tsx`
- **수정 내용**:
  - 42줄: `url: \`\${baseUrl}/blog/\${post.slug}\`` → `url: \`\${baseUrl}/post/\${post.slug}\``
  - 91줄: `url: \`\${baseUrl}/blog/\${post.slug}\`` → `url: \`\${baseUrl}/post/\${post.slug}\``
- **의존성**: 없음
- **예상 위험도**: Low — 문자열 치환만 수행, SEO 즉시 개선

### T02: HTML lang 속성 수정
- **설명**: `<html lang="en">` → `<html lang="ko">`. 한국어 블로그이므로 접근성/SEO 개선.
- **수정 대상 파일**: `app/layout.tsx`
- **수정 내용**:
  - 77줄: `lang="en"` → `lang="ko"`
- **의존성**: 없음
- **예상 위험도**: Low

### T03: 프로덕션 console.log 제거
- **설명**: 프로덕션 번들에 포함되는 불필요한 console.log 2개 제거.
- **수정 대상 파일**:
  - `app/post/[slug]/page.tsx` — 68줄: `console.log(toc, 'toc')` 삭제
  - `app/components/nav.tsx` — 24줄: `console.log('Books 탭이 표시됩니다 (개발 환경)')` 삭제
- **수정 내용**: 해당 줄 완전 삭제
- **의존성**: 없음
- **예상 위험도**: Low

---

## Phase 2 — P1 단기 (코드 품질)

### T04: global.css 중복 .prose 스타일 정리
- **설명**: `global.css`에 `.prose` 관련 스타일이 이중 선언됨. 45~156줄(1차 선언)과 190~265줄(2차 선언)에서 `.prose pre`, `.prose code`, `.prose h1~h4`, `.prose p`, `.prose strong`, `.prose ul`, `.prose ol`, `.prose img`, `.prose blockquote`이 각각 2번 정의. 2차 선언이 1차를 덮어쓰므로 1차 중복 블록 제거.
- **수정 대상 파일**: `app/global.css`
- **수정 내용**:
  - 45~156줄의 1차 `.prose` 선언 블록 삭제 (약 110줄)
  - 단, `:root` CSS 변수(1~35줄)와 `.title`(41~43줄)은 유지
  - 147~156줄의 `@media (prefers-color-scheme: dark)` 블록 중 `.prose pre`와 `.prose blockquote p`도 삭제 (2차 선언으로 대체됨)
  - 정리 후 순서: CSS변수 → html/title 기본 → 2차 .prose 블록(190줄~) → anchor → image-row → post-layout → toc
- **의존성**: 없음
- **예상 위험도**: Med — 시각적 리그레션 가능. 브라우저에서 다크모드/라이트모드 양쪽 확인 필수.

### T05: 다크모드 CSS 불일치 수정
- **설명**: Tailwind 설정은 `darkMode: 'selector'` (클래스 기반)이나, `global.css`에 `@media (prefers-color-scheme: dark)` 미디어 쿼리 6곳 존재. 수동 테마 전환(ThemeSwitch)이 `.dark` 클래스를 토글하므로, CSS 미디어 쿼리 기반 다크모드는 수동 전환과 동기화되지 않음.
- **수정 대상 파일**: `app/global.css`
- **수정 내용**:
  - 24~35줄: `@media (prefers-color-scheme: dark) { :root {...} html {...} }` → `.dark { --sh-class: ...; --sh-identifier: ...; --sh-keyword: ...; --sh-string: ...; color-scheme: dark; }` + `.dark html { color-scheme: dark; }` → 또는 `:root` 안에 넣고 `.dark:root`로 변경
  - 366~375줄: `.toc-sidebar` 다크모드 → `.dark .toc-sidebar { ... }`
  - 395~403줄: `.toc-sidebar` 스크롤바 다크모드 → `.dark .toc-sidebar::-webkit-scrollbar-track { ... }` 등
  - 433~437줄: `.toc-link:hover` 다크모드 → `.dark .toc-link:hover { ... }`
  - 449~457줄: `.toc-item-active` 다크모드 → `.dark .toc-item-active { ... }` 등
- **의존성**: T04 (중복 제거 후 수정해야 혼동 방지)
- **예상 위험도**: Med — 다크모드 전체 UI 확인 필요

### T06: parseFrontmatter를 gray-matter로 통합
- **설명**: `app/post/utils.ts`의 커스텀 `parseFrontmatter` 정규식 파서를 `gray-matter` 라이브러리로 교체. `app/books/utils.ts`는 이미 `gray-matter` 사용 중이므로 일관성 확보.
- **수정 대상 파일**: `app/post/utils.ts`
- **수정 내용**:
  - `import matter from 'gray-matter'` 추가
  - `parseFrontmatter` 함수(18~66줄)를 `gray-matter` 기반으로 재작성:
    ```typescript
    function parseFrontmatter(fileContent: string) {
      const { data, content } = matter(fileContent)
      // tags 문자열을 배열로 변환 (gray-matter가 문자열로 파싱할 경우)
      if (typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map((t: string) => t.trim())
      }
      // series 객체의 order를 숫자로 보장
      if (data.series && typeof data.series.order === 'string') {
        data.series.order = Number(data.series.order)
      }
      return { metadata: data as Metadata, content }
    }
    ```
  - `gray-matter`는 이미 `package.json` 의존성에 존재 (별도 설치 불필요)
- **의존성**: 없음
- **예상 위험도**: Med — 모든 12개 포스트의 frontmatter 파싱 결과가 동일한지 검증 필요. 특히 `series` 중첩 객체와 `tags` 배열 처리.

### T07: Giscus useTheme() 호환성 수정
- **설명**: `Giscus.tsx`가 `useTheme()` (next-themes)를 사용하나, `layout.tsx`에 `ThemeProvider`가 없음. `next-themes`는 `package.json`에 설치되어 있지만 Provider가 래핑되지 않아 `resolvedTheme`이 항상 undefined 반환.
- **수정 대상 파일**:
  - (방안 A — 권장) `app/components/CustomComponents/Giscus.tsx`: `useTheme()` 제거, 로컬 테마 감지 로직으로 교체
  - (방안 B) `app/layout.tsx`: `ThemeProvider` 추가
- **수정 내용 (방안 A)**:
  - `useTheme` import 제거
  - 로컬 상태로 테마 감지: `document.documentElement.classList.contains('dark')` 확인 + MutationObserver로 클래스 변경 감시
  - 이 방식이 현재 themeSwitch.tsx의 `localStorage + classList` 기반 테마 관리와 일치
- **수정 내용 (방안 B)**:
  - `layout.tsx`에 `import { ThemeProvider } from 'next-themes'` 추가
  - `<html>` 내부를 `<ThemeProvider attribute="class">...</ThemeProvider>`로 래핑
  - 기존 `themeControl` inline script 및 `ThemeSwitch` 컴포넌트와의 충돌 가능성 존재 → 대규모 변경 필요
- **의존성**: T05 (다크모드 통일 방향 결정 후)
- **예상 위험도**: Med (방안 A) / High (방안 B — 테마 시스템 전면 교체)

### T08: params, searchParams 타입 명시
- **설명**: `app/post/[slug]/page.tsx`의 `generateMetadata`와 `Blog` 컴포넌트에서 `params`가 any 타입. Next.js 14 App Router에서는 `Promise<{ slug: string }>` 또는 `{ slug: string }` 타입 명시 필요.
- **수정 대상 파일**:
  - `app/post/[slug]/page.tsx` — 19줄, 59줄: `{ params }` → `{ params }: { params: { slug: string } }`
  - `app/post/page.tsx` — 이미 타입 있으나 10~13줄의 인라인 타입을 명명된 인터페이스로 개선 가능
- **수정 내용**:
  - `app/post/[slug]/page.tsx` 상단에 인터페이스 추가:
    ```typescript
    interface PostPageProps {
      params: { slug: string }
    }
    ```
  - `generateMetadata({ params }: PostPageProps)` 및 `Blog({ params }: PostPageProps)` 적용
- **의존성**: 없음
- **예상 위험도**: Low

---

## Phase 3 — P2 구조 개선

### T09: 유틸리티 통합 — app/lib/ 디렉토리 신설
- **설명**: 유틸리티 코드가 4곳에 분산: `app/post/utils.ts`, `app/books/utils.ts`, `utils/themeControl.ts`, `app/utils/mediaQuery.ts`. `app/lib/`로 일원화.
- **수정 대상 파일**:
  - 신규: `app/lib/posts.ts` (← `app/post/utils.ts` 이동)
  - 신규: `app/lib/books.ts` (← `app/books/utils.ts` 이동)
  - 신규: `app/lib/theme.ts` (← `utils/themeControl.ts` 이동)
  - `app/utils/mediaQuery.ts` → 삭제 (T13에서 처리, 미사용 확인 완료)
  - 임포트 경로 수정 대상:
    - `app/post/[slug]/page.tsx` — 3,6줄
    - `app/post/page.tsx` — 2줄
    - `app/components/mdx.tsx` — 6줄
    - `app/components/posts.tsx` (getBlogPosts 임포트 확인 필요)
    - `app/layout.tsx` — 12줄
    - `app/sitemap.ts`, `app/rss/route.ts`, `app/og/route.tsx` (getBlogPosts 사용 시)
    - `app/books/page.tsx` — 3줄
    - `app/books/[slug]/page.tsx` — 3줄
- **의존성**: T06 (parseFrontmatter 교체 후 이동)
- **예상 위험도**: Med — 임포트 경로 변경이 많아 누락 시 빌드 실패. tsconfig baseUrl이 `.`이므로 `app/lib/posts` 경로로 접근 가능.

### T10: Callout 컴포넌트 제네릭화
- **설명**: 5개의 개별 Callout 컴포넌트(Tip/Note/Warning/Error/Info)를 1개의 variant prop 기반 컴포넌트로 통합. MDX에서 `<Tip>`, `<Note>` 등의 사용법은 유지.
- **수정 대상 파일**:
  - `app/components/CustomComponents/Callout.tsx` — 전면 재작성
  - `app/components/mdx.tsx` — 108~112줄 임포트/매핑 수정
- **수정 내용**:
  - `Callout.tsx`에 단일 컴포넌트:
    ```typescript
    type CalloutVariant = 'tip' | 'note' | 'warning' | 'error' | 'info'
    
    const variantStyles: Record<CalloutVariant, { bg: string; border: string; label: string }> = {
      tip:     { bg: 'bg-green-300/20 dark:bg-green-700/30',   border: 'border-green-500',   label: 'Tip' },
      note:    { bg: 'bg-blue-300/20 dark:bg-blue-700/30',     border: 'border-blue-500',    label: 'Note' },
      warning: { bg: 'bg-yellow-300/20 dark:bg-yellow-700/30', border: 'border-yellow-500',  label: 'Warning' },
      error:   { bg: 'bg-red-300/20 dark:bg-red-700/30',       border: 'border-red-500',     label: 'Error' },
      info:    { bg: 'bg-indigo-300/20 dark:bg-indigo-700/30', border: 'border-indigo-500',  label: 'Info' },
    }
    
    export function Callout({ variant, children }: { variant: CalloutVariant; children: ReactNode }) { ... }
    ```
  - 하위 호환을 위해 래퍼 export 유지:
    ```typescript
    export const TipCallout = (props) => <Callout variant="tip" {...props} />
    // ... 나머지 4개 동일
    ```
  - `mdx.tsx` 임포트는 기존 그대로 유지 가능 (래퍼 존재)
- **의존성**: 없음
- **예상 위험도**: Low — 래퍼로 하위 호환 보장

### T11: EnvDebug 프로덕션 번들 제외
- **설명**: `EnvDebug` 컴포넌트는 `process.env.NODE_ENV === 'production'`이면 null 반환하지만, 여전히 클라이언트 번들에 포함됨. `next/dynamic`으로 조건부 로드.
- **수정 대상 파일**: `app/layout.tsx`
- **수정 내용**:
  - 기존: `import { EnvDebug } from './components/EnvDebug'` + `<EnvDebug />`
  - 변경:
    ```typescript
    import dynamic from 'next/dynamic'
    const EnvDebug = dynamic(() => import('./components/EnvDebug').then(m => ({ default: m.EnvDebug })), { ssr: false })
    ```
  - 또는 더 단순하게: layout.tsx에서 조건부 렌더링
    ```typescript
    {process.env.NODE_ENV === 'development' && <EnvDebug />}
    ```
    (서버 컴포넌트인 layout.tsx에서 빌드 타임에 트리셰이킹 가능)
- **의존성**: 없음
- **예상 위험도**: Low

### T12: vercel-deploy 스크립트 수정
- **설명**: `package.json`의 `"vercel-deploy": "next build && next export"` — `next export`는 Next.js 13+에서 deprecated/제거됨. App Router에서는 `output: 'export'`를 `next.config.js`에 설정하거나, Vercel 배포 시 불필요.
- **수정 대상 파일**: `package.json`
- **수정 내용**:
  - `"vercel-deploy": "next build && next export"` → `"vercel-deploy": "next build"` (Vercel이 빌드 자동 처리)
- **의존성**: 없음
- **예상 위험도**: Low

### T13: 미사용 mediaQuery.ts 제거
- **설명**: `app/utils/mediaQuery.ts`가 프로젝트 어디에서도 import되지 않음 (grep 확인 완료). 삭제.
- **수정 대상 파일**: `app/utils/mediaQuery.ts` (삭제)
- **수정 내용**: 파일 삭제. `app/utils/` 디렉토리가 비게 되면 디렉토리도 삭제.
- **의존성**: 없음
- **예상 위험도**: Low

### T14: tsconfig.json strict 모드 활성화
- **설명**: 현재 `"strict": false`, `"strictNullChecks": true`. strict를 true로 변경하면 `noImplicitAny`, `strictBindCallApply`, `strictFunctionTypes`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict` 등이 활성화됨.
- **수정 대상 파일**: `tsconfig.json`
- **수정 내용**:
  - `"strict": false` → `"strict": true`
  - `"strictNullChecks": true` 줄 제거 (strict에 포함)
- **의존성**: T08 (타입 명시 선행), T06 (parseFrontmatter 교체 선행), T09 (유틸 이동 선행)
- **예상 위험도**: High — `noImplicitAny` 활성화로 타입 미지정 파라미터 전부 오류 발생. `getMDXFiles(dir)`, `readMDXFile(filePath)`, `CustomLink(props)`, `RoundedImage(props)`, `Table({ data })`, `createHeading(level)`, `cx(...classes)` 등 다수 함수에 타입 추가 필요. 점진적 접근 권장: 먼저 strict 활성화 → 빌드 오류 목록 확인 → 순차 수정.

---

## Phase 4 — P3 장기 (품질 기반)

### T15: 핵심 유틸 단위 테스트 추가
- **설명**: `parseFrontmatter` (T06 교체 후), `slugify`, `extractTocFromMdx`, `formatDate` 함수에 대한 Jest 단위 테스트 작성.
- **수정 대상 파일**:
  - 신규: `app/lib/__tests__/posts.test.ts` (또는 T09 이전이면 `app/post/__tests__/utils.test.ts`)
- **수정 내용**:
  - `slugify`: 한글, 영문, 특수문자, 빈 문자열, 중복 하이픈 케이스
  - `extractTocFromMdx`: 코드 블록 내 헤딩 무시, 중복 ID 처리, 레벨 1~6
  - `formatDate`: 오늘 날짜, 1일 전, 1개월 전, 1년 전, 연도 경계 (12월→1월 크로스)
  - `parseFrontmatter` (gray-matter 래퍼): 정상 frontmatter, tags 배열, series 중첩 객체, draft 불리언
- **의존성**: T06, T09 (유틸 위치 확정 후)
- **예상 위험도**: Low

### T16: formatDate 상대 날짜 정확도 개선
- **설명**: 현재 `formatDate`의 상대 날짜 계산이 단순 `getMonth() - getMonth()` 차이로 연도 경계 무시. 예: 2025-12-30 → 2026-01-02 = "-11mo ago" (음수). 정확한 차이 계산 필요.
- **수정 대상 파일**: `app/lib/posts.ts` (T09 후) 또는 `app/post/utils.ts`
- **수정 내용**:
  - `formatDate` 함수의 상대 날짜 로직을 밀리초 기반 차이 계산으로 교체:
    ```typescript
    const diffMs = currentDate.getTime() - targetDate.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffMonths = Math.floor(diffDays / 30)
    const diffYears = Math.floor(diffDays / 365)
    ```
- **의존성**: T15 (테스트 먼저 작성하여 TDD 방식 권장)
- **예상 위험도**: Low

### T17: PDF 관련 코드 dynamic import 분리
- **설명**: `html2canvas` (~200KB) + `jsPDF` (~300KB)가 메인 번들에 포함. `usePdfDownload` 훅과 `DemoPdfBox` 컴포넌트를 dynamic import로 분리하여 ~500KB 번들 절감.
- **수정 대상 파일**:
  - `app/hooks/usePdfDownload.ts` — `html2canvas`와 `jsPDF`를 dynamic import로 변경
  - `app/post/[slug]/page.tsx` — `DemoPdfBox` import를 `next/dynamic`으로 변경
- **수정 내용**:
  - `usePdfDownload.ts`:
    ```typescript
    // 기존: import html2canvas from 'html2canvas'
    // 기존: import jsPDF from 'jspdf'
    // 변경: download 함수 내부에서 dynamic import
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')
    ```
  - `app/post/[slug]/page.tsx`:
    ```typescript
    // 기존: import DemoPdfBox from '../../components/CustomComponents/DemoPdfBox'
    import dynamic from 'next/dynamic'
    const DemoPdfBox = dynamic(() => import('../../components/CustomComponents/DemoPdfBox'), { ssr: false })
    ```
- **의존성**: 없음
- **예상 위험도**: Low — PDF 기능은 특정 포스트에서만 사용

---

## 병렬 실행 가능 태스크

### Phase 1 (전부 병렬)
```
T01 ─┐
T02 ─┼─ 모두 독립, 동시 실행 가능
T03 ─┘
```

### Phase 2
```
T04 ──→ T05 (순차: 중복 제거 후 다크모드 수정)
      ──→ T07 (T05 이후: 다크모드 방향 결정 후 Giscus 수정)
T06 ─┐
T08 ─┼─ 서로 독립, 동시 실행 가능 (T04와도 독립)
     ┘
```

### Phase 3
```
T10 ─┐
T11 ─┤
T12 ─┼─ 서로 독립, 동시 실행 가능
T13 ─┤
T17 ─┘
T09 ──→ T14 (순차: 유틸 이동 후 strict 활성화)
```

### Phase 4
```
T15 ──→ T16 (순차: 테스트 먼저 → TDD로 formatDate 수정)
```

---

## 검증 방법

### Phase 1 완료 후
- [ ] `pnpm build` 성공 확인
- [ ] 빌드된 사이트에서 아무 포스트 열기 → 페이지 소스 확인 → OG URL이 `/post/slug` 형태인지 확인
- [ ] 페이지 소스에서 `<html lang="ko">` 확인
- [ ] 브라우저 콘솔에 `toc` 또는 `Books 탭` 로그 없음 확인

### Phase 2 완료 후
- [ ] `pnpm build` 성공 확인 (타입 에러 없음)
- [ ] 라이트모드/다크모드 전환 시 모든 CSS 변수(sugar-high 코드 하이라이팅 색상) 정상 적용 확인
- [ ] 다크모드에서 ToC 사이드바 배경/텍스트/스크롤바 정상 확인
- [ ] 아무 포스트에서 Giscus 댓글 영역 테마가 수동 전환과 동기화되는지 확인
- [ ] frontmatter 파싱: 12개 포스트 전부 정상 렌더링 확인 (특히 series 포스트, tags 포스트)
- [ ] `app/post/[slug]/page.tsx`에서 TypeScript params 타입 에러 없음

### Phase 3 완료 후
- [ ] `pnpm build` 성공 확인
- [ ] `app/lib/` 디렉토리에 posts.ts, books.ts, theme.ts 존재
- [ ] 기존 `app/post/utils.ts`, `app/books/utils.ts`, `utils/themeControl.ts` 삭제 확인
- [ ] `app/utils/` 디렉토리 삭제 확인
- [ ] Callout 컴포넌트: MDX 포스트에서 `<Tip>`, `<Note>` 등 정상 렌더링
- [ ] `EnvDebug`: 프로덕션 빌드에서 번들 미포함 확인 (`next build` → `.next/` 내 검색)
- [ ] `pnpm tsc --noEmit` strict 모드 통과
- [ ] PDF 다운로드 기능 정상 동작 (해당 포스트에서)

### Phase 4 완료 후
- [ ] `pnpm test` 통과 — 신규 테스트 전부 green
- [ ] `formatDate` 테스트: 연도 경계 케이스 포함
- [ ] 번들 크기 비교: `next build` 출력에서 초기 번들 크기 ~500KB 감소 확인

---

## 아키텍처 결정 사항

### AD01: Giscus 테마 — 방안 A (로컬 감지) 선택

**결정**: `next-themes` ThemeProvider 도입(방안 B) 대신, Giscus 내부에서 `document.documentElement.classList` 기반으로 테마를 감지하는 방안 A를 선택.

**이유**:
- 현재 테마 시스템이 `localStorage` + `classList.add/remove('dark')` 기반으로 동작 중
- ThemeProvider 도입 시 `themeControl.ts` inline script, `ThemeSwitch` 컴포넌트, Tailwind `darkMode: 'selector'` 설정 모두 수정 필요 → 리팩토링 범위 초과
- 방안 A는 기존 테마 인프라와 완벽 호환

**트레이드오프**: 향후 next-themes를 전면 도입하려면 방안 A 코드를 다시 변경해야 함. 하지만 현재 스펙이 "기존 동작 보존"이므로 최소 변경이 적절.

### AD02: CSS 다크모드 — prefers-color-scheme → .dark selector 통일

**결정**: `global.css`의 모든 `@media (prefers-color-scheme: dark)` 블록을 `.dark` 클래스 selector로 변환.

**이유**:
- `tailwind.config.js`의 `darkMode: 'selector'`와 일치
- `themeControl.ts`와 `ThemeSwitch`가 `.dark` 클래스 기반으로 동작
- 미디어 쿼리와 클래스 기반이 혼재하면 사용자가 수동 전환한 테마와 CSS가 불일치

**트레이드오프**: JavaScript가 비활성화된 환경에서는 `prefers-color-scheme`이 더 안전하지만, 이 블로그는 JS 필수 (React SSR/hydration).

### AD03: 유틸리티 구조 — app/lib/ 패턴

**결정**: `app/lib/` 디렉토리에 유틸리티를 통합. 프로젝트 루트 `utils/`나 `app/utils/`가 아닌 `app/lib/` 선택.

**이유**:
- Next.js App Router 관례에서 `app/lib/`은 서버 유틸리티 배치에 일반적
- `tsconfig.json`의 `baseUrl: "."` 덕분에 `app/lib/posts` 경로로 깔끔한 import 가능
- 기존 `app/post/utils.ts`처럼 라우트 디렉토리에 유틸이 섞이면 역할 구분이 불명확

**트레이드오프**: 파일 이동으로 git blame 히스토리가 끊김. `git log --follow`로 추적 가능하나 기본 blame에서는 보이지 않음.

### AD04: strict 모드 — 점진적 활성화

**결정**: Phase 3 마지막에 `strict: true` 활성화. 이전 Phase에서 주요 타입 미지정 함수들을 먼저 수정.

**이유**:
- 한 번에 strict 활성화하면 수십 개 타입 에러가 동시 발생하여 디버깅 어려움
- T06(parseFrontmatter), T08(params 타입), T09(유틸 이동)를 먼저 완료하면 strict 전환 시 잔여 에러가 크게 줄어듦

**트레이드오프**: Phase 3 전까지는 여전히 암묵적 any가 허용됨. 하지만 점진적 접근이 빌드 안정성 보장.

### AD05: Callout — 래퍼 패턴으로 하위 호환

**결정**: 제네릭 `Callout` 컴포넌트 + 기존 이름의 래퍼 export 유지.

**이유**:
- MDX 포스트에서 `<Tip>`, `<Note>` 등으로 이미 사용 중 → mdx.tsx 매핑도 `Tip: TipCallout` 형태
- 래퍼를 제거하면 모든 MDX 파일 수정 또는 mdx.tsx 매핑 변경 필요
- 래퍼는 한 줄이므로 유지 비용 미미

**트레이드오프**: `Callout.tsx` 파일에 export가 6개(1 제네릭 + 5 래퍼)로 다소 장황. 하지만 안전한 마이그레이션 우선.

---

---

## Phase D — 디자인 시스템 (Stoic Editorial 컨셉 적용)

> 참고 소스: `/Users/sungtaekpark/Downloads/stoic-editorial/`
> 컨셉: 미니멀 + 흑백 에디토리얼. "불필요한 것을 제거할 때까지만 정수만 남는다."
> 원칙: 기존 기능 보존, 레이아웃 구조 변경 최소화, 다크모드 완전 지원

---

### D01: 디자인 토큰 — CSS 변수 + Tailwind 테마 확장

- **설명**: 현재 `neutral-*` 계열 Tailwind 팔레트를 Stoic Editorial의 시맨틱 컬러 토큰으로 교체. 따뜻한 오프화이트(`#fcf9f8`) 기반 라이트 모드, 어두운 웜 다크 팔레트 정의.
- **수정 대상 파일**:
  - `app/global.css` — CSS 커스텀 프로퍼티 추가/수정
  - `tailwind.config.js` — `theme.extend`로 토큰 확장
- **수정 내용**:
  ```css
  /* global.css — :root (light) */
  :root {
    --color-surface: #fcf9f8;
    --color-surface-low: #f6f3f2;
    --color-surface-lowest: #ffffff;
    --color-surface-high: #e5e2e1;
    --color-on-surface: #1c1b1b;
    --color-on-surface-variant: #474747;
    --color-outline: #777777;
    --color-outline-variant: #c6c6c6;
    --color-primary: #000000;
    --color-on-primary: #e5e2e1;
    --color-secondary-container: #d5d4d4;
  }

  /* .dark (dark mode) */
  .dark {
    --color-surface: #1c1b1b;
    --color-surface-low: #242323;
    --color-surface-lowest: #141313;
    --color-surface-high: #2e2d2d;
    --color-on-surface: #f0edec;
    --color-on-surface-variant: #b8b5b4;
    --color-outline: #888585;
    --color-outline-variant: #3a3838;
    --color-primary: #f0edec;
    --color-on-primary: #1c1b1b;
    --color-secondary-container: #3a3838;
  }
  ```
  ```js
  // tailwind.config.js
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        'surface-low': 'var(--color-surface-low)',
        'surface-lowest': 'var(--color-surface-lowest)',
        'surface-high': 'var(--color-surface-high)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
        outline: 'var(--color-outline)',
        'outline-variant': 'var(--color-outline-variant)',
        primary: 'var(--color-primary)',
        'on-primary': 'var(--color-on-primary)',
        'secondary-container': 'var(--color-secondary-container)',
      },
      fontFamily: {
        headline: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  }
  ```
- **의존성**: T04, T05 완료 후 (global.css 정리 후 변수 재정의)
- **예상 위험도**: Med — 기존 `neutral-*` 클래스를 새 토큰으로 점진적 교체 필요

---

### D02: 타이포그래피 — Plus Jakarta Sans 헤드라인 폰트 추가

- **설명**: 현재 `geist` 패키지만 사용. Stoic Editorial의 에디토리얼 분위기는 **Plus Jakarta Sans** (extrabold, tracking-tighter)에서 나옴. Google Fonts 또는 `next/font`로 추가.
- **수정 대상 파일**:
  - `app/layout.tsx` — `next/font/google`으로 Plus Jakarta Sans + Inter 추가
  - `app/global.css` — `body`에 `font-body` 적용
- **수정 내용**:
  ```typescript
  // layout.tsx
  import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

  const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-headline',
    weight: ['500', '700', '800'],
    display: 'swap',
  })
  const inter = Inter({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
  })
  // <html>에 className에 변수 추가
  ```
  - 포스트 목록 `h1`: `text-2xl font-semibold` → `text-5xl md:text-7xl font-headline font-extrabold tracking-tighter`
  - MDX prose `h1/h2/h3`: `font-headline tracking-tight` 추가
- **의존성**: D01 (font family 변수 정의 후)
- **예상 위험도**: Low — `next/font` 자동 최적화, 기존 geist와 병존 가능

---

### D03: Navbar — 고정 상단 + 활성 상태 언더라인

- **설명**: 현재 Navbar는 `aside` 태그 + 단순 hover. Stoic Editorial의 `fixed top + backdrop-blur + border-b-2 active state` 패턴 적용.
- **수정 대상 파일**:
  - `app/components/nav.tsx`
  - `app/layout.tsx` — body에 `pt-20` (fixed nav 높이 보상) 추가
- **수정 내용**:
  - `aside` → `header` 태그, `fixed top-0 w-full z-50`
  - 배경: `bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20`
  - 높이: `h-16` 컨테이너
  - 활성 링크: `font-bold border-b-2 border-primary` (현재 시각적 구분 없음)
  - 비활성 링크: `text-on-surface/60 hover:text-primary`
  - 브랜드명 "Stoic Park": `font-headline font-bold tracking-tighter`
- **의존성**: D01 (색상 토큰 정의 후)
- **예상 위험도**: Med — fixed 전환 시 레이아웃 전체에 padding-top 보상 필요

---

### D04: PostCard — 에디토리얼 그리드 레이아웃

- **설명**: 현재 PostCard는 고정 크기 이미지(`w-72 h-48`) + neutral bg 카드. Stoic Editorial의 12컬럼 그리드 (이미지 4col / 콘텐츠 8col), 이미지 hover:scale-105, 메타데이터 uppercase 패턴으로 교체.
- **수정 대상 파일**:
  - `app/components/PostCard.tsx`
  - `app/components/posts.tsx` — `space-y-8` → `space-y-16 md:space-y-24`
- **수정 내용**:
  ```tsx
  // PostCard.tsx — 새 레이아웃
  <Link href={...} className="group grid md:grid-cols-12 gap-8 md:gap-12 items-start">
    {/* 이미지: 4컬럼, aspect-4/3, hover:scale-105 */}
    {metadata.image && (
      <div className="md:col-span-4 aspect-[4/3] bg-surface-low overflow-hidden">
        <Image ... className="... group-hover:scale-105 transition-transform duration-700" />
      </div>
    )}
    {/* 콘텐츠: 8컬럼 */}
    <div className={metadata.image ? "md:col-span-8" : "md:col-span-12"}>
      {/* 날짜 + 태그: uppercase tracking-widest text-[10px] */}
      <div className="flex items-center gap-4 mb-3">
        {metadata.tags?.[0] && (
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-outline">
            {metadata.tags[0]}
          </span>
        )}
        <time className="text-[10px] tracking-widest uppercase text-on-surface-variant">
          {formatDate(metadata.publishedAt, false)}
        </time>
        {metadata.readingTime && (
          <span className="text-[10px] tracking-widest uppercase text-on-surface-variant">
            {metadata.readingTime}
          </span>
        )}
      </div>
      {/* 제목 */}
      <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight mb-4
                     group-hover:text-primary transition-colors leading-tight">
        {metadata.title}
      </h2>
      {/* 요약 */}
      <p className="text-on-surface-variant leading-relaxed mb-6 font-body">
        {metadata.summary}
      </p>
      {/* Read more */}
      <span className="text-sm font-bold border-b-2 border-primary pb-0.5
                       group-hover:border-transparent transition-all">
        읽기
      </span>
    </div>
  </Link>
  ```
- **의존성**: D01, D02 (토큰 + 폰트 정의 후)
- **예상 위험도**: Med — 이미지 없는 포스트의 레이아웃 처리 확인 필요

---

### D05: 태그 필터 — 샤프 코너 + 에디토리얼 스타일

- **설명**: 현재 태그 버튼 `rounded-sm`, 소문자 `text-sm`. Stoic Editorial의 **직각 코너**, uppercase, tracking-widest, xs 폰트 패턴으로 교체.
- **수정 대상 파일**: `app/post/page.tsx`
- **수정 내용**:
  ```tsx
  // 활성 태그
  "px-5 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all
   bg-primary text-on-primary"  // rounded 없음 (직각)

  // 비활성 태그
  "px-5 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-all
   bg-surface-high text-on-surface-variant hover:bg-secondary-container"

  // 페이지 h1: text-2xl → text-5xl md:text-7xl font-headline font-extrabold tracking-tighter
  // 태그 컨테이너 간격: gap-2 → gap-3, mb-8 유지
  ```
- **의존성**: D01
- **예상 위험도**: Low

---

### D06: Footer — 에디토리얼 스타일 복원

- **설명**: 현재 footer.tsx는 링크가 주석 처리됨. Stoic Editorial 패턴으로 `bg-surface-low`, uppercase tracking-widest 링크 스타일 복원.
- **수정 대상 파일**: `app/components/footer.tsx`
- **수정 내용**:
  ```tsx
  <footer className="mt-32 py-12 bg-surface-low">
    <div className="flex flex-col md:flex-row justify-between items-center
                    px-4 max-w-4xl mx-auto gap-6">
      <span className="font-headline font-bold text-primary tracking-tighter">
        Stoic Park.
      </span>
      <div className="flex gap-8">
        <a href="/rss" className="text-xs tracking-widest uppercase opacity-60
                                   hover:opacity-100 transition-opacity">
          RSS
        </a>
        <a href="https://github.com/stoic-park/blog" target="_blank"
           className="text-xs tracking-widest uppercase opacity-60
                      hover:opacity-100 transition-opacity">
          GitHub
        </a>
      </div>
      <p className="text-xs tracking-widest uppercase opacity-60">
        © {new Date().getFullYear()} Stoic Park
      </p>
    </div>
  </footer>
  ```
- **의존성**: D01
- **예상 위험도**: Low

---

### D07: Prose 타이포그래피 — 에디토리얼 헤딩 스타일

- **설명**: MDX 포스트 본문의 `h1/h2/h3` 헤딩에 `font-headline tracking-tight` 적용. 현재 global.css의 `.prose h1~h4`는 font-family 미지정.
- **수정 대상 파일**: `app/global.css`
- **수정 내용**:
  ```css
  .prose h1, .prose h2, .prose h3, .prose h4 {
    font-family: var(--font-headline);
    letter-spacing: -0.02em;
    font-weight: 700;
  }
  ```
- **의존성**: D02 (폰트 변수 정의 후)
- **예상 위험도**: Low

---

## 디자인 Phase 병렬 실행 맵

```
D01 (토큰) ──┬──→ D02 (폰트) ──→ D07 (prose)
             ├──→ D03 (navbar)
             ├──→ D04 (postcard) ← D02 완료 후
             ├──→ D05 (태그)
             └──→ D06 (footer)
```

D01이 완료되면 D03/D05/D06은 병렬 실행 가능. D04는 D02 완료 후 시작.

## 디자인 Phase 검증

- [ ] `pnpm build` 성공
- [ ] 라이트/다크 모드에서 CSS 토큰 정상 적용 (따뜻한 오프화이트 vs 웜 다크)
- [ ] PostCard: 이미지 있는 포스트 + 이미지 없는 포스트 양쪽 레이아웃 확인
- [ ] Navbar: 고정 위치, 스크롤 시 backdrop-blur 동작, 활성 페이지 border-b 표시
- [ ] 태그 필터: 직각 코너, 활성/비활성 색상 대비
- [ ] 폰트: 헤드라인(Plus Jakarta Sans)과 본문(Inter) 구분 확인
- [ ] 모바일(375px) 반응형 깨짐 없음

---

## 전체 실행 순서 요약

```
Phase 1 (즉시, ~30분)
├── T01 + T02 + T03  (병렬)
└── 검증: pnpm build + 수동 확인

Phase 2 (단기, ~2시간)
├── T06 + T08  (병렬)
├── T04 → T05 → T07  (순차)
└── 검증: pnpm build + 다크모드/Giscus/frontmatter 확인

Phase D (디자인, ~3시간) ← Phase 2 완료 후 시작 권장
├── D01  (토큰 기반 선행)
├── D02 + D03 + D05 + D06  (병렬, D01 완료 후)
├── D04 + D07  (D02 완료 후)
└── 검증: 라이트/다크/모바일 시각 확인

Phase 3 (중기, ~3시간)
├── T10 + T11 + T12 + T13 + T17  (병렬)
├── T09 → T14  (순차)
└── 검증: pnpm build + pnpm tsc --noEmit

Phase 4 (장기, ~2시간)
├── T15 → T16  (순차, TDD)
└── 검증: pnpm test
```

총 예상 소요: ~10.5시간 (단일 개발자 기준, 디자인 Phase 추가)
