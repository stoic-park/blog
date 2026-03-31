---
name: publish-post
description: 드래프트 포스트를 발행하는 스킬. "발행해줘", "publish", "draft를 포스트로", "올려줘" 요청 시 반드시 이 스킬 사용. 드래프트 검증 → frontmatter 정리 → 파일 이동 → 확인 순서로 진행.
---

# Publish Post Skill

`/drafts/` 에 있는 드래프트를 검증하고 `/posts/`로 발행하는 스킬.

## 발행 체크리스트

### 1. Frontmatter 필수 항목 확인

- [ ] `title` 존재 및 적절한 길이 (60자 이내 권장)
- [ ] `publishedAt` 형식 확인 (`YYYY-MM-DD`), 없으면 오늘 날짜 사용
- [ ] `summary` 존재 (150자 이내 권장)
- [ ] `draft: true` **제거** (발행 시 반드시 삭제)

### 2. 콘텐츠 최소 검증

- [ ] 본문에 H1 없음 (title이 H1 역할)
- [ ] 코드 블록에 언어 명시
- [ ] 외부 이미지 URL이 허용된 도메인 (`githubusercontent.com`)인지 확인
- [ ] Callout type이 올바른지 확인 (tip/note/warning/error/info)

### 3. 파일 이동

```
/drafts/{slug}.mdx → /posts/{slug}.mdx
```

북 리뷰 드래프트는:
```
/drafts/{slug}.mdx → /posts/books/{slug}.mdx
```

**파일 이동 방법:** 드래프트 내용을 읽어 새 경로에 Write, 원본 드래프트 삭제 확인 후 Bash로 제거.

### 4. 발행 확인

파일 이동 후:
- 새 경로에 파일 존재 확인
- frontmatter에 `draft: true` 없음 확인
- 발행된 파일 경로 사용자에게 보고

## 에러 처리

**필수 frontmatter 누락 시:** 발행 중단, 누락 필드 목록 사용자에게 보고.
**slug 충돌 시 (같은 이름 파일이 /posts/에 이미 존재):** 사용자에게 확인 후 진행.

## 발행 후

발행 완료 메시지에 포함:
- 발행된 파일 경로
- 예상 URL: `/post/{slug}`
