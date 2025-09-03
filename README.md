# Blog

주로 개발과 관련한 기술 포스트를 작성하고 가끔 이런저런 관심있는 기술들을 적용합니다

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
├── app/                  # Next.js App Router
│   ├── books/            # 서재 페이지
│   ├── components/       # 공통 컴포넌트
│   ├── post/             # 블로그 포스트
│   └── ...
├── posts/                # MDX 파일들
│   ├── books/            # 서적 리뷰 MDX
│   └── ...               # 일반 블로그 포스트
├── drafts/               # 작성 중인 글들
└── ...
```
