# OnSurvey Frontend

React + TypeScript + Vite 기반의 온라인 설문조사 플랫폼 프론트엔드입니다.

## 🛠️ 기술 스택

- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Axios** - HTTP 클라이언트
- **Biome** - 코드 포맷팅 & 린팅
- **Husky** - Git 훅 관리
- **CodeRabbit** - AI 코드 리뷰

## 🤖 CodeRabbit 설정

이 프로젝트는 CodeRabbit AI를 사용하여 자동 코드 리뷰를 제공합니다.

### 설정 파일
- `.coderabbit.yaml` - CodeRabbit 설정
- `.github/workflows/coderabbit.yml` - GitHub Actions 워크플로우

### 기능
- ✅ **코드 품질 체크** - Biome 규칙 강제
- ✅ **TypeScript 타입 체크** - 타입 안전성 검증
- ✅ **보안 체크** - 보안 취약점 감지
- ✅ **성능 개선 제안** - 최적화 방안 제안
- ✅ **접근성 체크** - 웹 접근성 검증

### 사용법
1. PR 생성 시 자동으로 CodeRabbit이 리뷰 시작
2. AI가 코드를 분석하여 개선사항 제안
3. 한국어로 친근한 리뷰 제공

## 🔧 개발 환경 설정

### 설치
```bash
pnpm install
```

### 개발 서버 실행
```bash
pnpm dev
```

### 빌드
```bash
pnpm build
```

### 코드 품질 체크
```bash
pnpm lint        # Biome 체크
pnpm lint:fix    # 자동 수정
pnpm format      # 포맷팅
```

## 📋 Git 훅

- **pre-commit**: Biome 코드 체크 & 포맷팅
- **pre-push**: 빌드 성공 여부 확인
- **post-checkout**: 의존성 자동 설치
