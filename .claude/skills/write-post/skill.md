---
name: write-post
description: |
  이 블로그(Next.js MDX)용 포스트 작성 스킬. 기획 → 초안 → 교정 → 최적화 → 자체 평가 순서로 진행한다.
  이 스킬은 다음 상황에서 반드시 사용한다:
  - 새 포스트나 draft를 쓸 때 ("포스트 써줘", "글 작성해줘", "draft 작성", "새 포스트", "블로그 글")
  - 기존 draft를 다듬거나 고칠 때 ("글 다듬어줘", "교정해줘", "AI 티 빼줘")
  - 트러블슈팅, 딥다이브, 도메인 정리, 회고, TIL 글의 구조를 잡을 때
  - 시리즈 포스트를 구성할 때
  - /posts, /drafts 아래 MDX 파일을 만들거나 편집할 때
  발행(파일 이동)은 publish-post 스킬이 담당한다.
---

# Write Post Skill

이 블로그의 MDX 포스트를 쓰는 스킬. 블로그 규약에 맞는 frontmatter, 구조, 컴포넌트를 적용하고, 다 쓴 뒤 스스로 평가한다.

## 핵심 원칙

1. **정확:** 기술적으로 틀린 내용이 없다. 확인 못 한 수치·주장은 쓰지 않거나 출처를 붙인다.
2. **직접 겪은 것:** 요약·소개보다 직접 해 보고 측정한 내용이 중심이다. 경험은 절대 지어내지 않는다. 없으면 `{/* TODO(경험): ... */}`로 자리만 남기고 사용자에게 묻는다.
3. **간결:** 같은 말을 두 번 하지 않는다. 본문을 다시 요약하는 정리 표는 만들지 않는다.

## 워크플로우

### 1단계: 기획
- 글 유형 정하기: 트러블슈팅 / 딥다이브·이전기 / 도메인 정리 / 회고 / TIL → `references/templates.md`에서 뼈대 선택
- 대상 독자 한 줄로 정하기 (예: "대용량 차트를 처음 다루는 프론트엔드 개발자")
- category 하나, tags 3~5개 정하기
- 사용자에게 받아야 할 경험·수치 목록 뽑기 (없으면 TODO로 둘 자리)

### 2단계: 초안
- 문체와 표기는 `references/style-guide.md`를 따른다
- 도입은 메타 문장("이 글은 ~를 정리한 것입니다") 대신 실제 상황·문제로 시작
- 그림이 전달을 돕는 곳엔 SVG 그림을 넣는다 (아래 "이미지" 참고)

### 3단계: 교정
- 문체 일관성, 기술 용어 표기 통일
- `references/style-guide.md`의 AI 티 점검표로 한 번 훑고 고친다

### 4단계: 최적화
- title 60자 이내, summary 150자 이내
- readingTime 계산 (아래)
- 관련 기존 포스트가 있으면 본문에 내부 링크

### 5단계: 자체 평가
다 쓴 뒤 아래 항목을 스스로 평가해 **표로** 사용자에게 보여준다. 문제가 있으면 고친 뒤 다시 평가한다.

| 항목 | 확인할 것 |
|---|---|
| 제목-내용 일치 | 제목이 약속한 걸 본문이 다 다루는가 |
| 논리 흐름 | 섹션 순서가 자연스러운가, 빠진 단계가 없는가 |
| 정확성 | 수치·주장마다 근거가 있는가 (경험 / 출처) |
| 직접 경험 | 경험 문장이 있는가, TODO가 몇 개 남았는가 |
| 중복 | 같은 내용을 두 번 말하지 않는가 |
| AI 티 | 점검표 기준 강한 신호가 남았는가 |
| 보안 | 회사·고객·내부 용어가 없는가 |

## Frontmatter 템플릿

```yaml
---
title: '포스트 제목'
publishedAt: 'YYYY-MM-DD'
summary: '150자 이내 핵심 요약. SEO 메타 디스크립션으로 사용됨.'
category: 'frontend'   # 필수, 하나만: frontend | domain | ai | retrospective
tags: '#태그1, #태그2, #태그3'
author: 'Stoic Park'
readingTime: 'N분'
---
```

- 드래프트: `draft: true` 추가
- 시리즈: `series: { name: '시리즈 이름', order: 1 }` (아래 "시리즈" 참고)
- 썸네일 지정: `image: 'https://...'` (없으면 본문 첫 이미지, 그것도 없으면 OG 라우트가 자동 생성)

**파일 위치:** 발행 `/posts/{slug}.mdx`, 북 리뷰 `/posts/books/{slug}.mdx`, 드래프트 `/drafts/{slug}.mdx`
**slug:** 영문 소문자, 단어 사이 하이픈. 예: `nextjs-app-router-guide`

## readingTime 계산

코드 블록과 참고 자료를 뺀 단어 수 ÷ 300, 반올림. 300단어 이하는 '2분 미만'.

## 스타일 규약 (요약)

자세한 규칙은 `references/style-guide.md`.

- **문체:** 존댓말. 해요체(~해요/~예요) 또는 합니다체(~합니다). 해요체 위주에 합니다체를 섞는 건 괜찮다. 반말 금지. 예외: 짧은 강조 문장, 직접 인용, 코드 주석.
- **테이블:** `<Table>` 컴포넌트만. 마크다운 파이프 테이블은 렌더링 안 됨. 셀 안 `**bold**` 등 마크다운 미적용.
- **민감 정보:** 회사명/고객명/프로젝트명/내부 시스템명/내부 용어 노출 금지. 내부 식별자는 일반화.

```mdx
<Table
 data={{
  headers: ['항목', '설명'],
  rows: [['A', 'B']],
 }}
/>
```

## MDX 컴포넌트

### Callout
타입별 독립 컴포넌트. `<Callout type="...">`는 없음. 글 하나에 1~2개만.
```mdx
<Tip>팁 내용</Tip>
<Note>참고 사항</Note>
<Warning>주의할 점</Warning>
<Error>오류 상황</Error>
<Info>추가 정보</Info>
```

### 코드 블록
언어 명시 필수.

### 이미지
로컬 그림은 `public/images/{slug 또는 주제}/`에 두고 `<figure>` + `<Image>`로 넣는다. width/height는 원본 크기.
```mdx
<figure>
 <Image
  src="/images/topic/diagram.svg"
  alt="그림이 보여주는 내용을 한 문장으로"
  width={800}
  height={300}
 />
 <figcaption>짧은 설명</figcaption>
</figure>
```

- 도식은 SVG 직접 작성. 스타일: 배경 `#f8fafc` 둥근 사각형, 제목 18px 굵게, 강조색 `#8b5cf6`, 보조색 `#64748b`, 글꼴 `-apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR'`
- 단순 이미지는 마크다운 `![대체 텍스트](URL)`도 가능
- 외부 이미지는 `next.config.js` 허용 도메인만: `github.com/user-attachments/**`, `raw.githubusercontent.com`
- 큰 PNG/JPG는 발행 전에 publish-post 스킬이 압축한다

## 구조 규칙

- H1 금지 (title이 H1). H2가 TOC 최상위.
- H2 소제목을 전부 같은 형태(예: "1. ~다")로 맞추지 않는다. 섹션마다 같은 틀(설명 → 콜아웃 → 결론) 반복도 피한다.
- 유형별 뼈대는 `references/templates.md`.

## 태그

작성 전 `/posts/*.mdx`의 태그를 확인해 기존 표기를 따른다 (예: `#React`, `#Next.js`, `#프론트엔드`, `#성능최적화`). 대소문자 다른 중복 태그를 만들지 않는다.

## 시리즈

1. `/posts/`에서 같은 `series.name` 파일 확인
2. 가장 높은 `series.order` + 1을 새 order로
3. 단편으로 충분한 주제는 시리즈로 만들지 않는다 (사용자가 원할 때만)

## Version History

- v2.0.0 (2026-10-30): 해요체 허용, 5단계 워크플로우와 자체 평가 표 추가, references 분리(style-guide, templates), 이미지 `<figure>` 패턴·허용 도메인 수정
- v1.1.0 (2026-10-17): category 필드 필수화
- v1.0.0: 초기 버전
