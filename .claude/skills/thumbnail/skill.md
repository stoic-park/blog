---
name: thumbnail
description: 블로그 포스트 썸네일/OG 이미지 시스템. OG 라우트가 자동으로 썸네일을 생성하므로 별도 이미지 파일 불필요. 트리거: "썸네일", "OG 이미지", "thumbnail", "이미지 수정".
---

# Thumbnail Skill

블로그의 썸네일/OG 이미지는 `app/og/route.tsx`에서 동적으로 생성된다.
포스트 작성 시 별도 이미지 파일을 만들 필요 없이, frontmatter의 title과 tags가 자동으로 반영된다.

## 동작 방식

### 자동 생성 (기본)

`image` frontmatter가 없으면 OG 라우트가 자동으로 썸네일을 생성한다:
- **PostCard (목록 페이지)**: `/og?title=...&tags=...` URL로 `img` 태그 렌더링
- **OG 메타 (소셜 공유)**: `{baseUrl}/og?title=...&tags=...` URL 사용

디자인: 다크 배경(#1c1b1b), 밝은 텍스트(#f0edec), 태그 칩, "Stoic Park" 브랜딩, accent line.

### 커스텀 이미지 (선택)

특별한 썸네일이 필요하면 `image` frontmatter를 설정한다:

```yaml
image: 'https://raw.githubusercontent.com/.../thumbnail.png'
```

허용된 도메인:
- `github.com/user-attachments/**`
- `raw.githubusercontent.com/**`

커스텀 이미지가 있으면 Next.js `Image` 컴포넌트로 최적화 렌더링된다.

## OG 라우트 쿼리 파라미터

```
/og?title={제목}&tags={태그1,태그2}
```

| 파라미터 | 필수 | 설명 |
|---------|------|------|
| `title` | 아니오 | 포스트 제목 (기본값: "Stoic Park, blog") |
| `tags` | 아니오 | 쉼표 구분 태그 목록 (# 없이) |

## OG 라우트 디자인 수정 시

파일: `app/og/route.tsx`
- `next/og`의 `ImageResponse` 사용
- `tw` prop으로 Tailwind 스타일 적용
- inline `style` prop으로 커스텀 색상/그라데이션
- 크기: 1200x630 (OG 표준)

## 관련 파일

| 파일 | 역할 |
|------|------|
| `app/og/route.tsx` | OG 이미지 동적 생성 |
| `app/components/PostCard.tsx` | 포스트 카드 썸네일 (자동 fallback) |
| `app/post/[slug]/page.tsx` | OG 메타데이터 (tags 포함) |
