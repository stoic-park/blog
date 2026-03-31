---
name: blog-orchestrator
description: 블로그 멀티에이전트 워크플로우 오케스트레이터. "포스트 작성하고 검토까지", "드래프트 다듬어서 발행", "새 기능 구현하고 확인" 같은 복합 작업 요청 시 에이전트 팀을 조율. 단순 단일 작업에는 사용하지 않음.
---

# Blog Orchestrator

블로그의 복합 작업을 에이전트 팀으로 조율하는 오케스트레이터.

## 실행 모드: 서브 에이전트

블로그 작업은 대부분 순차적이므로 서브 에이전트 모드를 사용한다.
(작성 → 검토 → 발행 순서는 팀 통신보다 파이프라인이 적합)

## 에이전트 구성

| 에이전트 | 타입 | 역할 | 스킬 |
|---------|------|------|------|
| blog-writer | general-purpose | MDX 포스트 작성/편집 | write-post |
| blog-reviewer | general-purpose | 품질/SEO 검토 | (내장 체크리스트) |
| blog-dev | general-purpose | 기능 구현 | blog-feature |

## 워크플로우 패턴

### 패턴 A: 포스트 작성 + 검토

사용자가 "포스트 써서 검토까지 해줘" 요청 시:

```
1. blog-writer 서브 에이전트 실행
   - write-post 스킬 적용
   - 드래프트 파일 생성: /drafts/{slug}.mdx
   - 완성 후 파일 경로 반환

2. blog-reviewer 서브 에이전트 실행
   - 1에서 받은 파일 경로로 검토
   - 직접 수정 완료 후 검토 요약 반환

3. 최종 결과 사용자에게 보고
   - 생성된 파일 경로
   - 주요 수정 사항 요약
```

### 패턴 B: 드래프트 → 발행

사용자가 "이 드래프트 검토하고 발행해줘" 요청 시:

```
1. blog-reviewer 서브 에이전트 실행
   - 드래프트 파일 검토 및 수정

2. publish-post 스킬 적용 (직접 실행)
   - frontmatter 최종 확인
   - /drafts/ → /posts/ 이동

3. 발행 결과 보고
```

### 패턴 C: 기능 구현 + 사용 예시

사용자가 "새 컴포넌트 만들고 예시 포스트도 써줘" 요청 시:

```
1. blog-dev 서브 에이전트 실행
   - blog-feature 스킬 적용
   - 컴포넌트 구현 완료 후 사용법 반환

2. blog-writer 서브 에이전트 실행
   - 1에서 받은 사용법으로 예시 포스트 작성
   - write-post 스킬 적용

3. 결과 보고
```

## 서브 에이전트 호출 형식

```
Agent(
  prompt: "{에이전트 정의 파일 경로}를 읽고 역할에 따라 다음 작업을 수행한다: {구체적 작업 지시}",
  subagent_type: "general-purpose",
  model: "opus"
)
```

에이전트 정의 파일 경로:
- `.claude/agents/blog-writer.md`
- `.claude/agents/blog-reviewer.md`
- `.claude/agents/blog-dev.md`

## 에러 핸들링

- **에이전트 실패 시**: 해당 단계 결과 없이 진행, 최종 보고에 실패 명시
- **파일 경로 오류**: 다음 에이전트에게 경로 오류 알리고 확인 요청
- **검토 후 대규모 수정 필요 시**: 사용자에게 확인 후 재작성 여부 결정

## 단일 작업은 직접 처리

오케스트레이터는 복합 작업 전용이다. 다음은 오케스트레이터 없이 직접 처리:
- "포스트 하나만 써줘" → write-post 스킬 직접 사용
- "이 파일 검토해줘" → blog-reviewer 에이전트 직접 호출
- "컴포넌트 추가해줘" → blog-feature 스킬 직접 사용
- "발행해줘" → publish-post 스킬 직접 사용

## 테스트 시나리오

**정상 흐름:** "frontend-performance 관련 포스트 작성하고 검토까지 해줘"
→ blog-writer가 /drafts/frontend-performance-*.mdx 생성
→ blog-reviewer가 frontmatter, 구조, 코드 검토 후 수정
→ 최종 파일 경로와 검토 요약 반환

**에러 흐름:** "이 드래프트 발행해줘" + 드래프트에 publishedAt 없음
→ publish-post 스킬이 필수 항목 누락 감지
→ 발행 중단, 누락 항목 목록 보고
→ 사용자가 날짜 제공 후 재발행
