# Stoic Park Blog

박성택의 개발 블로그입니다. 웹 개발, JavaScript, React, Next.js 관련 기술 포스트를 공유합니다.

## 개발 환경 설정

### 서재 기능 활성화

개발 환경에서만 서재 탭을 보려면 `.env.local` 파일을 생성하고 다음 환경변수를 설정하세요:

```bash
# 개발 환경에서만 서재 탭 표시
NEXT_PUBLIC_SHOW_BOOKS=true
```

### 서적 리뷰 추가하기

서적 리뷰는 `posts/books/` 폴더에 MDX 파일로 작성합니다.

파일 구조:

```
posts/books/
├── clean-code.mdx
├── effective-typescript.mdx
└── ...
```

MDX 파일 frontmatter 예시:

```yaml
---
title: '책 제목'
author: '저자명'
date: '2024-01-15'
excerpt: '간단한 설명'
---
```

## 기술 스택

- Next.js 14
- TypeScript
- Tailwind CSS
- MDX
- Vercel Analytics

## 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build

# 프로덕션 실행
pnpm start
```

## 프로젝트 구조

```
blog/
├── app/                    # Next.js App Router
│   ├── books/             # 서재 페이지
│   ├── components/        # 공통 컴포넌트
│   ├── post/             # 블로그 포스트
│   └── ...
├── posts/                 # MDX 파일들
│   ├── books/            # 서적 리뷰 MDX
│   └── ...               # 일반 블로그 포스트
└── ...
```
