# CLAUDE.md — 프로젝트 가이드 (for-comalmot)

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 자동으로 읽는 지침 파일이다.
**이 지침은 `for-comalmot/` 폴더 안에서만 적용된다.** 형제 폴더인 `sourcing-extension-phase1_93/`(소싱 매니저, 완전히 다른 프로젝트)의 지침·구조와는 무관하다.

---

## 1. 로컬 환경 정보

- OS: Windows 11 Pro
- 셸: PowerShell (기본). Bash 도구도 병행 가능하지만 POSIX 문법 사용
- Node.js: 이 세션 중 winget으로 설치됨 (LTS 24.19.0). 새 Bash 세션은 PATH가 갱신되지 않을 수 있어 `export PATH="/c/Program Files/nodejs:$PATH"`가 필요할 수 있음
- git: 이 저장소 전용 로컬 identity 설정됨 (`git config --local user.name/user.email`, 전역 설정 아님)

---

## 2. 프로젝트 정보

- **프로젝트 이름:** Bboggl 레시피 — "for 컴알못"
- **한 줄 설명:** PC를 잘 모르는 사람("컴알못")을 위한 팁·정보 사이트. 첫 카테고리는 "PC 최적화", 사이드바로 카테고리를 계속 늘려가는 구조.
- **기술 스택:** 순수 HTML/CSS/JS (빌드 도구·프레임워크·`package.json` 없음). JS는 `<script type="module">`로 파일 분리.
- **구조:** PART 1(프론트엔드) 우선 완성, 백엔드 필요 기능이 생기면 PART 2로 진행. 지금은 PART 1만 진행 중.
- **개발 서버:** 없음. `index.html`을 브라우저로 직접 열거나 로컬 정적 서버로 확인.
- **빌드/테스트:** 빌드 없음. `node --check js/*.js`로 문법 검증, 나머지는 브라우저 수동 확인 (자동화 테스트 스위트 없음).
- **배포:** 아직 미정. `docs/backend-setup-guide.md`의 5절에 후보 경로(Vercel/Netlify) 정리되어 있지만 확정 전까지 임의로 배포 설정을 만들지 말 것.

### 디자인 시스템 (정확히 준수)

```css
:root{--primary:#3182F6;--primary-dark:#1B64DA;--text:#4E5968;--sub:#8B95A1;--bg:#F2F4F6;--surface:#FFFFFF;--border:#E5E8EB}
```
- 버튼: `border-radius:10px; padding:12px 20px; font-weight:700;` solid Primary, hover 시 밝기 변화
- 폰트: Inter (400/500/700/800), `letter-spacing:-0.01em`, heading 700~800 / body 400~500
- 아이콘: solid(채움) 스타일

값이 바뀌면 반드시 사용자에게 먼저 확인 — 레시피에서 지정한 정확한 값이라 임의 조정 금지.

### 주요 설계 결정 (요약 — 전체는 스펙 문서 참고)

- 페이지 구조: 단일 HTML 셸 + 해시 라우팅(`#/`, `#/category/:id`, `#/tip/:id`)
- 홈/카테고리 화면: 균일 카드 그리드 (히어로 배너 없음 — 브라우저 목업 브레인스토밍에서 B안으로 확정)
- 카테고리: 단일 레벨 목록 (계층 없음)
- 팁 추가: 코드(데이터 파일) 수정으로만. 사이트 내 입력 UI 없음 → 이 프로젝트 범위에서는 백엔드 불필요
- 애드배너: 3개 슬롯(`ad-in-article`, `ad-bottom`, `ad-sidebar-sticky`)에 자리만 확보. 실제 광고 네트워크 연동은 PART 2

전체 설계 근거와 세부 사항은 [`docs/superpowers/specs/2026-08-15-bboggl-recipe-frontend-design.md`](docs/superpowers/specs/2026-08-15-bboggl-recipe-frontend-design.md) 참고.

### 백엔드 (PART 2 — 아직 시작 안 함)

백엔드/DB/배포가 필요해지면 [`docs/backend-setup-guide.md`](docs/backend-setup-guide.md) 순서를 따를 것. 사용자가 언제 PART 2를 진행할지 먼저 물어보지 않고 임의로 백엔드 작업을 시작하지 말 것 (레시피 원문의 명시적 작업 규칙).

---

## 3. 작업 원칙 (요약)

우선순위: **정확성 > 검증 > 최소 변경 > 명확성 > 유지보수성**

- 파일·구조가 존재한다고 가정하지 말고 먼저 읽어서 확인해.
- 요청된 작업에만 변경을 국한하고, 관련 없는 리팩토링은 하지 마.
- 디자인 토큰(색상/버튼/폰트/아이콘)은 임의로 바꾸지 말고, 바꿔야 할 상황이면 먼저 물어봐.
- 애매한 배치/구조 결정은 임의로 정하지 말고 질문으로 확인.
- 한 번에 다 만들지 말고 단계별로 진행 + 각 단계 검수 후 다음 단계로.
