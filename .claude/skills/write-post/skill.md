---
name: write-post
description: 이 블로그용 MDX 포스트 작성 스킬. 새 포스트 작성, 드래프트 편집, 시리즈 포스트 구성 시 반드시 이 스킬을 사용한다. 트리거: "포스트 써줘", "글 작성해줘", "draft 작성", "새 포스트", "블로그 글", MDX 파일 생성/편집 요청.
---

# Write Post Skill

이 블로그의 MDX 포스트를 작성하는 스킬. 블로그 규약에 맞는 frontmatter, 구조, 컴포넌트 사용법을 적용한다.

## 파일 구조 결정

```
발행 포스트:  /posts/{slug}.mdx
북 리뷰:     /posts/books/{slug}.mdx
드래프트:    /drafts/{slug}.mdx
```

**slug 규칙:** 영문 소문자, 단어 사이 하이픈. 예: `nextjs-app-router-guide`

## Frontmatter 템플릿

```yaml
---
title: '포스트 제목'
publishedAt: 'YYYY-MM-DD'
summary: '150자 이내 핵심 요약. SEO 메타 디스크립션으로 사용됨.'
tags: '#태그1, #태그2, #태그3'
author: 'Stoic Park'
readingTime: 'N분'
---
```

**드래프트 추가:**
```yaml
draft: true
```

**시리즈 포스트 추가:**
```yaml
series:
  name: '시리즈 이름'
  order: 1
```

**이미지 추가 (있을 경우):**
```yaml
image: 'https://...'
```

## readingTime 계산

한국어 기준 분당 약 300단어. 코드 블록은 단어 수에 포함하지 않는다.
- 300단어 이하 → '2분 미만'
- 300~600단어 → '2분'
- 600~900단어 → '3분'

## MDX 컴포넌트

### Callout
각 타입별로 독립 컴포넌트를 사용한다. `<Callout type="...">` 형식은 존재하지 않음.
```mdx
<Tip>팁 내용</Tip>
<Note>참고 사항</Note>
<Warning>주의할 점</Warning>
<Error>오류 상황</Error>
<Info>추가 정보</Info>
```

### 코드 블록
언어 명시 필수:
```typescript
const example = 'code';
```

### 이미지
일반 Markdown 이미지 문법 사용:
```mdx
![대체 텍스트](이미지-URL)
```

외부 이미지는 `next.config.js`에 등록된 도메인만 허용:
- `user-attachments.githubusercontent.com`
- `raw.githubusercontent.com`

## 포스트 구조 가이드

```
## 서론 (왜 이 글을 읽어야 하는가)

## 본문 섹션 1
### 세부 항목

## 본문 섹션 2

## 마무리 / 결론
```

- H1은 title frontmatter가 담당 → 본문에 H1 사용 금지
- H2가 TOC 최상위 항목이 됨
- H2 4개 이상이면 TOC 사이드바가 유용해짐

## 기존 태그 참고

포스트 작성 전 `/posts/*.mdx`의 태그를 확인하여 일관성 유지:
- `#Next.js`, `#React`, `#TypeScript`, `#Tailwind CSS`
- `#프론트엔드`, `#성능최적화`, `#개발회고`

## 시리즈 포스트 작성 시

1. `/posts/` 내 같은 `series.name`을 가진 파일 확인
2. 가장 높은 `series.order` + 1을 새 포스트 order로 설정
3. 시리즈 첫 번째 포스트에 전체 시리즈 개요 포함 권장
