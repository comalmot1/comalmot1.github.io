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
- **한 줄 설명:** PC를 잘 모르는 사람("컴알못")을 위한 팁·정보 사이트. 카테고리는 "팁 for 게이머" / "소소한 팁/정보" 2개, 사이드바로 계속 늘려가는 구조.
- **기술 스택:** 순수 HTML/CSS/JS (빌드 도구·프레임워크·`package.json` 없음). JS는 `<script type="module">`로 파일 분리, 전부 `.mjs` 확장자.
- **구조:** PART 1(프론트엔드) 우선 완성, 백엔드 필요 기능이 생기면 PART 2로 진행. 지금은 PART 1만 진행 중 — 콘텐츠(텍스트·실제 스크린샷)를 계속 채우는 단계.
- **개발 서버:** 없음. ES 모듈이라 `file://`로는 안 열림 — 반드시 `npx http-server . -p <포트> -c-1` 같은 로컬 정적 서버로 확인 (Node는 winget으로 설치되어 있음, PATH는 §1 참고).
- **빌드/테스트:** 빌드 없음. `node --check js/*.mjs`로 문법 검증, 나머지는 브라우저 수동 확인 (자동화 테스트 스위트 없음). 로컬 dev 서버 브라우저 캐시가 종종 완고하게 이전 버전을 물고 있으니, 확인이 이상하면 새 포트로 재시작하거나 `fetch(...+'?v='+Date.now())`로 캐시 우회해서 재확인할 것.
- **배포:** GitHub Pages로 진행하기로 확정 (저장소는 Public 필요, 아직 push 전). 해시 라우팅(`#/...`)이라 404.html 우회 작업 불필요. Vercel 등 다른 경로는 `docs/backend-setup-guide.md` 참고용으로만 남겨둠.
- **콘텐츠 이미지:** 실제 스크린샷은 사용자가 직접 캡처해서 `images/tips/`에 저장 — Claude는 대화창에 붙여넣은 이미지를 파일로 직접 저장할 수 없으므로, 파일명을 정해서 알려주고 사용자가 저장하면 확인 후 코드에 연결하는 방식으로 진행. 아직 없는 이미지는 `placeholderImage()`가 만드는 "스크린샷 준비중" 플레이스홀더로 대체됨(깨진 이미지 아님, 정상 동작).

### 디자인 시스템 (정확히 준수)

```css
:root{--primary:#3182F6;--primary-dark:#1B64DA;--text:#4E5968;--sub:#8B95A1;--bg:#F2F4F6;--surface:#FFFFFF;--border:#E5E8EB}
```
- 버튼: `border-radius:10px; padding:12px 20px; font-weight:700;` solid Primary, hover 시 밝기 변화
- 폰트: Inter (400/500/700/800), `letter-spacing:-0.01em`, heading 700~800 / body 400~500
- 아이콘: solid(채움) 스타일

값이 바뀌면 반드시 사용자에게 먼저 확인 — 레시피에서 지정한 정확한 값이라 임의 조정 금지.

### 주요 설계 결정 (요약 — 전체는 스펙 문서 참고)

- 페이지 구조: 단일 HTML 셸 + 해시 라우팅(`#/`, `#/category/:id`, `#/tip/:id`). 해시 라우팅은 검색엔진이 `#/tip/...`을 전부 같은 URL로 취급해서 개별 팁이 색인되지 않는 한계가 있어서 → **§SEO/정적 팁 페이지** 참고 (스크립트로 실제 정적 HTML을 별도 생성해서 보완함)
- 홈/카테고리 화면: 균일 카드 그리드 (히어로 배너 없음 — 브라우저 목업 브레인스토밍에서 B안으로 확정)
- 카테고리: 단일 레벨 목록(계층 없음), 배열이라 개수 제한 없음 — 데이터만 추가하면 코드 수정 없이 늘어남
- 팁 본문 블록 타입 3종: `paragraph`(문단), `steps`(번호 매긴 단계 목록), `image`(스크린샷+캡션) — `render.mjs`의 `renderBlock()` 참고
- 썸네일: 실제 이미지 대신 팁 제목을 자동 줄바꿈해 넣은 SVG를 코드로 생성(`placeholderThumb()`) — 카드 썸네일과 상세페이지 히어로 이미지 둘 다에 재사용됨
- 팁 추가: 코드(데이터 파일) 수정으로만. 사이트 내 입력 UI 없음 → 이 프로젝트 범위에서는 백엔드 불필요
- 애드배너: 3개 슬롯(`ad-in-article`, `ad-bottom`, `ad-sidebar-sticky`)에 자리만 확보. 실제 광고 네트워크 연동은 PART 2

전체 설계 근거와 세부 사항은 [`docs/superpowers/specs/2026-08-15-bboggl-recipe-frontend-design.md`](docs/superpowers/specs/2026-08-15-bboggl-recipe-frontend-design.md) 참고.

### SEO / 정적 팁 페이지 (중요 — data.mjs 수정 후 잊지 말 것)

해시 라우팅 SPA는 검색엔진이 개별 팁을 색인 못 하는 문제가 있어서, 팁마다 **진짜 정적 HTML 페이지**를 `scripts/generate-tip-pages.mjs`로 별도 생성해둔다.

- 출력: `tip/<팁id>/index.html` (팁 개수만큼), 루트의 `sitemap.xml`, `robots.txt`
- **`js/data.mjs`를 수정(팁 추가/수정/삭제)했으면 반드시 다시 실행**: `node scripts/generate-tip-pages.mjs`
- 이 정적 페이지들은 완전히 독립적인 HTML이고 JS를 안 씀(메인 SPA와 별개) — 검색엔진·공유 링크용 진입점이고, 실제 앱 안에서 검색/정렬하며 둘러보는 건 여전히 기존 SPA(`index.html`, 해시 라우팅) 몫
- `scripts/generate-tip-pages.mjs` 안의 블록 렌더링 로직은 `render.mjs`의 `renderBlock`/`renderTipDetail`을 정적 HTML용으로 다시 구현한 것 — `render.mjs`의 렌더링 방식을 바꾸면 이 스크립트도 맞춰서 고칠 것
- `scripts/generate-tip-pages.mjs` 상단의 `BASE_URL`이 아직 `REPLACE-WITH-YOUR-GITHUB-PAGES-URL` 플레이스홀더 상태 — GitHub Pages 배포 후 실제 주소로 바꾸고 재실행해야 `sitemap.xml`/`canonical`/OG 태그가 올바르게 나옴
- 애드센스 심사 준비 상태 (2026-08-16 기준):
  - ✅ 개인정보처리방침(`privacy-policy.html`)·사이트 소개/문의(`about.html`) 페이지 추가됨 — 둘 다 루트의 독립 정적 HTML, SPA 사이드바(`renderSidebar` in `render.mjs`)와 정적 팁 페이지 사이드바(`sidebarHtml` in `generate-tip-pages.mjs`) 양쪽 하단에 `sidebar-footer`로 링크되어 있고 `sitemap.xml`에도 포함됨. 이 두 파일도 새 페이지 추가 시 마찬가지로 유지보수 필요
  - ⚠️ 두 페이지의 문의처는 `[문의 이메일 준비중]` 플레이스홀더 — 실제 공개할 이메일이 정해지면 두 파일 모두에서 바꿔야 함
  - ⚠️ 콘텐츠 10편 (권장 15~25편에는 아직 못 미침 — 개수를 늘릴지, 이대로 심사 넣을지는 사용자 판단 필요)
  - ⚠️ 실제 배포 안 됨 — GitHub 계정 생성부터 필요 (계정 생성은 Claude가 대신 할 수 없는 작업), 저장소 생성·push·Pages 활성화 후 `BASE_URL` 교체 + `generate-tip-pages.mjs` 재실행 필요

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
