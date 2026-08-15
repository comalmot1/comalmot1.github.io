# for 컴알못 — PART 1 프론트엔드 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** "for 컴알못" 팁 사이트의 PART 1(프론트엔드)를 완성한다 — 사이드바 카테고리(PC 최적화, 더미 팁 6개), 검색/정렬, 팁 상세 페이지(애드배너 자리 3곳 포함)를 갖춘, 빌드 도구 없는 정적 사이트.

**Architecture:** 단일 `index.html` 셸 + ES 모듈(JS) + 해시 라우팅(`#/`, `#/category/:id`, `#/tip/:id`). 데이터는 코드에 하드코딩된 더미 배열(`data.mjs`), 렌더링은 순수 DOM 조작(`innerHTML` 템플릿), 상태는 전역 변수 몇 개로만 관리.

**Tech Stack:** 순수 HTML/CSS/JavaScript (ES Modules). 빌드 도구·프레임워크·`package.json` 없음. Node.js는 로컬 검증(`node --check`, 정적 서버)에만 사용, 런타임 의존성은 아니다.

## Global Constraints

- 디자인 토큰은 스펙에 정의된 값을 정확히 그대로 사용한다 (색상 HEX, radius 10px, Inter 폰트, solid 아이콘). 임의로 값을 바꾸지 않는다.
- `package.json`을 만들지 않는다. 이 계획의 모든 JS 파일은 확장자를 **`.mjs`**로 쓴다 — 이유: `package.json`(`"type":"module"`) 없이 `node --check`로 ES 모듈(`import`/`export`) 문법을 올바르게 검증하려면 `.js`가 아니라 `.mjs` 확장자가 필요하다 (Node는 `.js`를 기본 CommonJS로 파싱해 `export` 문에서 문법 오류를 낸다). 브라우저의 `<script type="module">`은 확장자와 무관하게 정상 동작하므로 기능·구조에는 영향이 없다. (스펙 대비 확정한 구현 세부사항)
- **로컬 확인은 정적 서버로 한다.** ES 모듈은 `file://`로 열면 브라우저 CORS 정책 때문에 로드가 차단된다. 각 태스크의 "브라우저 확인" 단계는 프로젝트 루트에서 `npx http-server . -p 8080` (Node가 이미 설치되어 있어 별도 설치 없이 실행됨) 실행 후 `http://localhost:8080`으로 접속해서 진행한다.
- 자동화 테스트 프레임워크는 두지 않는다 (스펙 10절). 각 태스크의 검증은 `node --check`(문법) + 브라우저 수동 확인(동작/화면) + DevTools 콘솔 에러 0건 확인으로 구성한다.
- 팁 썸네일은 실제 이미지 파일이 아니라 `data.mjs` 안에서 생성하는 인라인 SVG data URI로 대체한다 (바이너리 이미지 자산을 만들 방법이 없으므로). `images/tips/` 폴더는 만들지 않는다. (스펙 대비 확정한 구현 세부사항)
- 아이콘은 별도 `icons/` 폴더 대신 `render.mjs` 안에 인라인 SVG 문자열 상수로 둔다 — PART 1에서 필요한 아이콘이 사이드바 카테고리용 1개뿐이라 폴더를 따로 둘 실익이 없다. (스펙 대비 확정한 구현 세부사항, YAGNI)

---

## 파일 구조

```
for-comalmot/
├── index.html
├── css/
│   ├── tokens.css
│   ├── layout.css
│   └── components.css
└── js/
    ├── data.mjs
    ├── router.mjs
    ├── render.mjs
    ├── search.mjs
    └── main.mjs
```

---

### Task 1: 디자인 토큰 CSS + 기본 HTML 셸

**Files:**
- Create: `css/tokens.css`
- Create: `index.html`

**Interfaces:**
- Produces: CSS 커스텀 프로퍼티 `--primary`, `--primary-dark`, `--text`, `--sub`, `--bg`, `--surface`, `--border` (이후 모든 CSS 파일이 사용). `.btn`, `.icon`, `body`, `h1/h2/h3` 베이스 스타일.

- [ ] **Step 1: `css/tokens.css` 작성**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');

:root {
  --primary: #3182F6;
  --primary-dark: #1B64DA;
  --text: #4E5968;
  --sub: #8B95A1;
  --bg: #F2F4F6;
  --surface: #FFFFFF;
  --border: #E5E8EB;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  letter-spacing: -0.01em;
  background: var(--bg);
  color: var(--text);
}

h1, h2, h3 {
  font-weight: 800;
  margin: 0;
}

a {
  color: var(--primary);
  text-decoration: none;
}

.btn {
  border-radius: 10px;
  padding: 12px 20px;
  font-weight: 700;
  background: var(--primary);
  color: #fff;
  border: none;
  cursor: pointer;
  transition: .15s;
  font-family: inherit;
  font-size: 14px;
}
.btn:hover {
  filter: brightness(.95);
}

.icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
  stroke: none;
  flex-shrink: 0;
}
```

- [ ] **Step 2: `index.html` 작성 (임시 스모크 테스트용 — Task 3에서 본문을 실제 셸로 교체함)**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>for 컴알못</title>
  <link rel="stylesheet" href="css/tokens.css">
</head>
<body>
  <div style="padding:40px">
    <h1>for 컴알못</h1>
    <p>디자인 토큰 확인용 임시 화면</p>
    <button class="btn">테스트 버튼</button>
  </div>
</body>
</html>
```

- [ ] **Step 3: 정적 서버로 브라우저 확인**

Run: `npx http-server . -p 8080` (for-comalmot 루트에서 실행)
브라우저로 `http://localhost:8080` 접속.

Expected:
- 탭 제목이 "for 컴알못"
- 배경이 옅은 회색(`#F2F4F6`), 본문 글자가 Inter 폰트로 렌더링됨 (일반 sans-serif와 다르게 보임)
- "테스트 버튼"이 파란색(`#3182F6`), 모서리가 둥글고(10px), 글자가 굵게 보임
- 버튼에 마우스를 올리면 살짝 어두워짐
- DevTools 콘솔에 에러 없음

- [ ] **Step 4: Commit**

```bash
git add css/tokens.css index.html
git commit -m "feat: add design token CSS and smoke-test HTML shell"
```

---

### Task 2: 더미 데이터 모듈

**Files:**
- Create: `js/data.mjs`

**Interfaces:**
- Produces:
  - `export const categories: { id: string, name: string, icon: string }[]` — 길이 1 (`pc-optimization`)
  - `export const tips: { id: string, category: string, title: string, summary: string, thumbnail: string, body: { type: 'paragraph', text: string }[], tags: string[], date: string }[]` — 길이 6, `body`는 각 3개 문단, `date`는 내림차순(최신이 배열 앞)
  - 내부 함수 `placeholderThumb(index)` — `data:image/svg+xml;...` 형태의 문자열 반환 (export 안 함, 모듈 내부 전용)

- [ ] **Step 1: `js/data.mjs` 작성**

```js
function placeholderThumb(index) {
  const palette = ['#DBEAFE', '#DCFCE7', '#FEF3C7', '#FCE7F3', '#E0E7FF', '#FFE4E6'];
  const color = palette[index % palette.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240">` +
    `<rect width="400" height="240" fill="${color}"/>` +
    `<text x="200" y="130" font-family="Inter,sans-serif" font-size="32" font-weight="800" fill="#1B64DA" text-anchor="middle">TIP ${index + 1}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const categories = [
  { id: 'pc-optimization', name: 'PC 최적화', icon: 'bolt' },
];

export const tips = [
  {
    id: 'pc-optimization-1',
    category: 'pc-optimization',
    title: '시작프로그램 정리로 부팅 속도 빠르게 하기',
    summary: '작업 관리자에서 불필요한 시작프로그램을 꺼서 부팅 시간을 크게 줄이는 방법.',
    thumbnail: placeholderThumb(0),
    body: [
      { type: 'paragraph', text: 'PC를 켤 때마다 한참을 기다리고 있다면, 원인은 대부분 시작프로그램입니다. 컴퓨터가 켜질 때 자동으로 함께 실행되도록 등록된 프로그램이 많을수록 부팅이 오래 걸립니다.' },
      { type: 'paragraph', text: '작업 관리자(Ctrl+Shift+Esc)를 열고 "시작프로그램" 탭으로 이동하면, 부팅 시 자동 실행되는 프로그램 목록과 "시작 시 영향" 정도를 확인할 수 있습니다. 평소 자주 쓰지 않는 프로그램을 선택해 "사용 안 함"으로 바꿔주세요.' },
      { type: 'paragraph', text: '백신 프로그램이나 그래픽 드라이버 관련 항목은 끄지 않는 것이 안전합니다. 잘 모르겠는 항목은 이름을 검색해보고 판단하세요.' },
    ],
    tags: ['부팅', '시작프로그램'],
    date: '2026-08-10',
  },
  {
    id: 'pc-optimization-2',
    category: 'pc-optimization',
    title: '디스크 정리로 저장공간 확보하는 법',
    summary: 'Windows 기본 기능만으로 필요 없는 파일을 지우고 저장공간을 되찾는 방법.',
    thumbnail: placeholderThumb(1),
    body: [
      { type: 'paragraph', text: '저장 공간이 부족하다는 알림이 뜬다면, Windows에 기본 내장된 "디스크 정리" 기능부터 사용해보세요. 임시 파일과 휴지통, 이전 업데이트 파일 등을 한 번에 지울 수 있습니다.' },
      { type: 'paragraph', text: '검색창에 "디스크 정리"를 입력해 실행한 뒤, 정리할 드라이브(보통 C:)를 선택하면 삭제 가능한 항목이 용량별로 나옵니다. "임시 인터넷 파일", "휴지통" 정도는 안심하고 지워도 됩니다.' },
      { type: 'paragraph', text: '"시스템 파일 정리"를 누르면 이전 Windows 설치 파일까지 지울 수 있어 수 GB를 추가로 확보할 수 있지만, 최근에 업데이트했다면 신중하게 선택하세요.' },
    ],
    tags: ['저장공간', '디스크정리'],
    date: '2026-08-08',
  },
  {
    id: 'pc-optimization-3',
    category: 'pc-optimization',
    title: 'SSD 교체, 체감 속도가 이렇게 다릅니다',
    summary: '하드디스크를 SSD로 바꾸면 부팅과 프로그램 실행이 얼마나 빨라지는지 정리했습니다.',
    thumbnail: placeholderThumb(2),
    body: [
      { type: 'paragraph', text: '오래된 PC가 느린 가장 큰 원인은 CPU보다 저장장치인 경우가 많습니다. 하드디스크(HDD)를 SSD로 바꾸는 것만으로 부팅과 프로그램 실행 속도가 눈에 띄게 빨라집니다.' },
      { type: 'paragraph', text: '특히 부팅 시간은 1~2분에서 10~20초 수준으로 줄어드는 경우가 흔합니다. 이미 SSD를 쓰고 있다면 이 팁은 해당되지 않습니다.' },
      { type: 'paragraph', text: '노트북은 M.2 또는 2.5인치 SATA 방식인지 먼저 확인해야 하고, 데스크탑은 메인보드 슬롯을 확인해야 합니다. 확실하지 않다면 컴퓨터 매장에 문의하는 걸 추천합니다.' },
    ],
    tags: ['SSD', '하드웨어'],
    date: '2026-08-05',
  },
  {
    id: 'pc-optimization-4',
    category: 'pc-optimization',
    title: '그래픽 드라이버 업데이트로 끊김 줄이기',
    summary: '화면 끊김이나 버벅임의 흔한 원인인 오래된 그래픽 드라이버를 업데이트하는 방법.',
    thumbnail: placeholderThumb(3),
    body: [
      { type: 'paragraph', text: '화면이 가끔 끊기거나 버벅인다면 그래픽 드라이버가 오래됐을 가능성이 있습니다. 그래픽 카드 제조사(NVIDIA, AMD, Intel)에서 최신 드라이버를 받아 설치하면 해결되는 경우가 많습니다.' },
      { type: 'paragraph', text: '내 그래픽 카드가 뭔지 모르겠다면, 작업 관리자의 "성능" 탭에서 "GPU" 항목을 확인하면 이름이 표시됩니다. 이름을 그대로 검색해서 제조사 공식 홈페이지에서 드라이버를 받으세요.' },
      { type: 'paragraph', text: '다운로드한 사이트가 공식 홈페이지가 맞는지 꼭 확인하고, 출처가 불분명한 사이트에서는 받지 마세요.' },
    ],
    tags: ['그래픽드라이버', '끊김'],
    date: '2026-08-03',
  },
  {
    id: 'pc-optimization-5',
    category: 'pc-optimization',
    title: '백그라운드 앱 정리로 메모리 확보하기',
    summary: '모르는 사이 메모리를 잡아먹는 백그라운드 프로그램을 찾아 정리하는 방법.',
    thumbnail: placeholderThumb(4),
    body: [
      { type: 'paragraph', text: 'PC가 느려졌다 싶으면 작업 관리자를 열어 "프로세스" 탭에서 메모리를 많이 쓰는 프로그램을 확인해보세요. 안 쓰는데 계속 켜져 있는 프로그램이 의외로 많습니다.' },
      { type: 'paragraph', text: '특히 채팅 프로그램이나 클라우드 동기화 앱은 평소 잘 안 보이지만 백그라운드에서 계속 실행되는 경우가 많습니다. 당장 필요 없다면 종료하거나 시작프로그램에서 꺼두세요.' },
      { type: 'paragraph', text: '"설정 > 앱 > 백그라운드 앱 사용 권한"에서 특정 앱이 백그라운드에서 실행되지 않도록 아예 막아둘 수도 있습니다.' },
    ],
    tags: ['메모리', '백그라운드'],
    date: '2026-08-01',
  },
  {
    id: 'pc-optimization-6',
    category: 'pc-optimization',
    title: '임시 파일 자동 삭제 설정하는 법',
    summary: 'Windows의 저장소 센스 기능을 켜두면 임시 파일이 자동으로 정리됩니다.',
    thumbnail: placeholderThumb(5),
    body: [
      { type: 'paragraph', text: 'Windows에는 일정 기간 지난 임시 파일을 자동으로 지워주는 "저장소 센스(Storage Sense)" 기능이 있습니다. 한 번 켜두면 신경 쓰지 않아도 계속 공간을 정리해줍니다.' },
      { type: 'paragraph', text: '"설정 > 시스템 > 저장소"로 들어가 "저장소 센스"를 켜고, 삭제 주기를 원하는 기간(예: 30일)으로 설정하면 됩니다.' },
      { type: 'paragraph', text: '다운로드 폴더의 오래된 파일까지 함께 정리할지 여부도 옵션으로 선택할 수 있으니, 다운로드 폴더를 임시 보관용으로 쓰는 편이라면 함께 켜두는 게 좋습니다.' },
    ],
    tags: ['임시파일', '저장소센스'],
    date: '2026-07-28',
  },
];
```

- [ ] **Step 2: 문법 검증**

Run: `node --check js/data.mjs`
Expected: 출력 없음 (에러 없으면 정상)

- [ ] **Step 3: 데이터 shape 검증**

Run:
```bash
node -e "import('./js/data.mjs').then(m => { console.assert(m.categories.length === 1, 'categories should be 1'); console.assert(m.tips.length === 6, 'tips should be 6'); console.assert(m.tips.every(t => t.body.length === 3), 'each tip should have 3 body paragraphs'); console.log('OK', m.categories.length, m.tips.length); })"
```
Expected: `OK 1 6` 출력, assert 실패 메시지 없음

- [ ] **Step 4: Commit**

```bash
git add js/data.mjs
git commit -m "feat: add dummy tip and category data"
```

---

### Task 3: 사이드바 렌더링 + 반응형 레이아웃

**Files:**
- Create: `css/layout.css`
- Create: `js/render.mjs`
- Create: `js/main.mjs`
- Modify: `index.html` (본문을 실제 셸 구조로 교체)

**Interfaces:**
- Consumes: `data.mjs`의 `categories` (Task 2)
- Produces:
  - `render.mjs`: `export function renderSidebar(el, categories, activeCategoryId)` — `el.innerHTML`을 사이드바 마크업으로 채움. 이후 태스크(4, 6, 7)가 이 함수를 계속 사용.
  - `main.mjs`: 앱 진입점. 이후 태스크가 이 파일에 라우팅/검색 배선을 계속 추가함.

- [ ] **Step 1: `css/layout.css` 작성**

```css
.app-shell {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: var(--surface);
  border-right: 1px solid var(--border);
  padding: 20px 16px;
}

.sidebar-logo {
  font-size: 20px;
  color: var(--primary);
  margin-bottom: 24px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--text);
  font-weight: 500;
  white-space: nowrap;
}
.sidebar-link.active {
  background: var(--bg);
  color: var(--primary);
  font-weight: 700;
}

.main-content {
  flex: 1;
  min-width: 0;
  padding: 24px 32px;
}

@media (max-width: 768px) {
  .app-shell {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    display: flex;
    align-items: center;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: 12px 16px;
    gap: 8px;
  }
  .sidebar-nav {
    flex-direction: row;
  }
  .sidebar-logo {
    display: none;
  }
  .main-content {
    padding: 16px;
  }
}
```

- [ ] **Step 2: `js/render.mjs` 작성**

```js
const ICONS = {
  bolt: '<svg class="icon" viewBox="0 0 24 24"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
};

export function renderSidebar(el, categories, activeCategoryId) {
  el.innerHTML = `
    <div class="sidebar-logo"><strong>for 컴알못</strong></div>
    <nav class="sidebar-nav">
      <a href="#/" class="sidebar-link ${!activeCategoryId ? 'active' : ''}">전체</a>
      ${categories.map((c) => `
        <a href="#/category/${c.id}" class="sidebar-link ${c.id === activeCategoryId ? 'active' : ''}">
          ${ICONS[c.icon] || ''}<span>${c.name}</span>
        </a>
      `).join('')}
    </nav>
  `;
}
```

- [ ] **Step 3: `index.html` 본문을 실제 셸로 교체**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>for 컴알못</title>
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/layout.css">
</head>
<body>
  <div class="app-shell">
    <aside class="sidebar" id="sidebar"></aside>
    <main class="main-content" id="main-content">
      <div id="content-area"></div>
    </main>
  </div>
  <script type="module" src="js/main.mjs"></script>
</body>
</html>
```

- [ ] **Step 4: `js/main.mjs` 작성 (임시 — Task 5에서 라우터로 교체됨)**

```js
import { categories } from './data.mjs';
import { renderSidebar } from './render.mjs';

renderSidebar(document.getElementById('sidebar'), categories, null);
```

- [ ] **Step 5: 브라우저 확인**

Run: `npx http-server . -p 8080` (아직 실행 중이 아니라면)
브라우저로 `http://localhost:8080` 접속.

Expected:
- 왼쪽에 240px 폭 사이드바, "for 컴알못" 로고, "전체"(활성 상태 파란 배경) / "PC 최적화" 링크 2개
- 브라우저 창을 768px 이하로 좁히면 사이드바가 상단으로 이동하고 가로 스크롤 가능한 형태로 바뀜, 로고는 숨겨짐
- DevTools 콘솔에 에러 없음

- [ ] **Step 6: Commit**

```bash
git add css/layout.css js/render.mjs js/main.mjs index.html
git commit -m "feat: add sidebar rendering and responsive shell layout"
```

---

### Task 4: 홈 카드 그리드

**Files:**
- Create: `css/components.css`
- Modify: `js/render.mjs` (카드/그리드 렌더 함수 추가)
- Modify: `js/main.mjs` (그리드 렌더 호출)
- Modify: `index.html` (components.css 링크 추가)

**Interfaces:**
- Consumes: `data.mjs`의 `tips` (Task 2), `renderSidebar` (Task 3)
- Produces:
  - `render.mjs`: `export function renderTipGrid(el, tips)` — 카드 그리드 마크업 렌더. 내부 헬퍼 `tipCardHtml(tip)`는 export 안 함(모듈 내부 전용이지만, Task 6에서 관련 팁 카드에도 재사용하므로 그때 export로 승격).

- [ ] **Step 1: `css/components.css` 작성**

```css
.tip-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 1024px) {
  .tip-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .tip-grid {
    grid-template-columns: 1fr;
  }
}

.tip-card {
  display: block;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: .15s;
}
.tip-card:hover {
  border-color: var(--primary);
}

.tip-card-thumb {
  width: 100%;
  aspect-ratio: 5 / 3;
  object-fit: cover;
  display: block;
}

.tip-card-body {
  padding: 16px;
}
.tip-card-body h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 6px;
}
.tip-card-body p {
  font-size: 14px;
  color: var(--sub);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

- [ ] **Step 2: `js/render.mjs`에 그리드 렌더 함수 추가**

`js/render.mjs` 전체를 아래 내용으로 교체:

```js
const ICONS = {
  bolt: '<svg class="icon" viewBox="0 0 24 24"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
};

export function renderSidebar(el, categories, activeCategoryId) {
  el.innerHTML = `
    <div class="sidebar-logo"><strong>for 컴알못</strong></div>
    <nav class="sidebar-nav">
      <a href="#/" class="sidebar-link ${!activeCategoryId ? 'active' : ''}">전체</a>
      ${categories.map((c) => `
        <a href="#/category/${c.id}" class="sidebar-link ${c.id === activeCategoryId ? 'active' : ''}">
          ${ICONS[c.icon] || ''}<span>${c.name}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

function tipCardHtml(tip) {
  return `
    <a class="tip-card" href="#/tip/${tip.id}">
      <img class="tip-card-thumb" src="${tip.thumbnail}" alt="${tip.title}">
      <div class="tip-card-body">
        <h3>${tip.title}</h3>
        <p>${tip.summary}</p>
      </div>
    </a>
  `;
}

export function renderTipGrid(el, tips) {
  el.innerHTML = `<div class="tip-grid">${tips.map(tipCardHtml).join('')}</div>`;
}
```

- [ ] **Step 3: `js/main.mjs` 전체를 아래 내용으로 교체**

```js
import { categories, tips } from './data.mjs';
import { renderSidebar, renderTipGrid } from './render.mjs';

const sidebarEl = document.getElementById('sidebar');
const contentEl = document.getElementById('content-area');

renderSidebar(sidebarEl, categories, null);
renderTipGrid(contentEl, tips);
```

- [ ] **Step 4: `index.html`의 `<head>`에 components.css 링크 추가**

`<link rel="stylesheet" href="css/layout.css">` 바로 아래 줄에 추가:

```html
  <link rel="stylesheet" href="css/components.css">
```

- [ ] **Step 5: 브라우저 확인**

Run: 서버가 이미 떠 있지 않다면 `npx http-server . -p 8080`, 브라우저 새로고침.

Expected:
- 사이드바 오른쪽에 팁 카드 6개가 3열 그리드로 표시됨 (색상 있는 썸네일 + 제목 + 요약)
- 브라우저 폭을 1024px 이하로 줄이면 2열, 768px 이하로 줄이면 1열로 바뀜
- 카드에 마우스를 올리면 테두리가 파란색으로 바뀜
- DevTools 콘솔에 에러 없음

- [ ] **Step 6: Commit**

```bash
git add css/components.css js/render.mjs js/main.mjs index.html
git commit -m "feat: add uniform tip card grid for home view"
```

---

### Task 5: 해시 라우터 연결

**Files:**
- Create: `js/router.mjs`
- Modify: `js/main.mjs` (라우트 등록으로 교체)

**Interfaces:**
- Consumes: `renderSidebar`, `renderTipGrid` (Task 3, 4), `categories`, `tips` (Task 2)
- Produces:
  - `router.mjs`: `export function onRouteChange(pattern: RegExp, handler: (params: Record<string,string>) => void)`, `export function startRouter()`
  - 라우트 3종: `#/`, `#/category/:id`, `#/tip/:id` (마지막은 Task 6에서 핸들러 내용 채움)

- [ ] **Step 1: `js/router.mjs` 작성**

```js
const routes = [];
const FALLBACK_HASH = '#/';

export function onRouteChange(pattern, handler) {
  routes.push({ pattern, handler });
}

export function startRouter() {
  window.addEventListener('hashchange', dispatch);
  dispatch();
}

function dispatch() {
  const path = location.hash.replace(/^#/, '') || '/';
  for (const { pattern, handler } of routes) {
    const match = path.match(pattern);
    if (match) {
      handler(match.groups || {});
      return;
    }
  }
  location.hash = FALLBACK_HASH;
}
```

- [ ] **Step 2: 문법 검증**

Run: `node --check js/router.mjs`
Expected: 출력 없음

- [ ] **Step 3: `js/main.mjs` 전체를 아래 내용으로 교체**

팁 상세 라우트는 이번 태스크에서는 "준비 중" 문구만 띄워두고, Task 6에서 실제 상세 렌더링으로 교체한다.

```js
import { categories, tips } from './data.mjs';
import { renderSidebar, renderTipGrid } from './render.mjs';
import { onRouteChange, startRouter } from './router.mjs';

const sidebarEl = document.getElementById('sidebar');
const contentEl = document.getElementById('content-area');

function findCategory(id) {
  return categories.find((c) => c.id === id);
}
function findTip(id) {
  return tips.find((t) => t.id === id);
}

onRouteChange(/^\/$/, () => {
  renderSidebar(sidebarEl, categories, null);
  renderTipGrid(contentEl, tips);
});

onRouteChange(/^\/category\/(?<id>[^/]+)$/, ({ id }) => {
  const category = findCategory(id);
  if (!category) {
    location.hash = '#/';
    return;
  }
  renderSidebar(sidebarEl, categories, id);
  renderTipGrid(contentEl, tips.filter((t) => t.category === id));
});

onRouteChange(/^\/tip\/(?<id>[^/]+)$/, ({ id }) => {
  const tip = findTip(id);
  if (!tip) {
    location.hash = '#/';
    return;
  }
  renderSidebar(sidebarEl, categories, tip.category);
  contentEl.innerHTML = `<p>"${tip.title}" 상세 페이지 준비 중...</p>`;
});

startRouter();
```

- [ ] **Step 4: 브라우저 확인**

서버가 떠 있지 않다면 `npx http-server . -p 8080`, 브라우저로 `http://localhost:8080` 접속.

Expected:
- 처음 접속 시 홈 그리드(6개 카드)가 보임
- 사이드바 "PC 최적화" 클릭 → URL이 `#/category/pc-optimization`으로 바뀌고 같은 6개 카드가 보임(카테고리가 1개뿐이라 전체와 동일), 사이드바에서 "PC 최적화"가 활성 표시됨
- 카드 하나 클릭 → URL이 `#/tip/pc-optimization-1` 등으로 바뀌고 "...상세 페이지 준비 중..." 문구가 보임
- 주소창에서 `#/tip/없는아이디`로 직접 바꿔보면 자동으로 `#/`로 돌아가며 홈 그리드가 다시 보임
- DevTools 콘솔에 에러 없음

- [ ] **Step 5: Commit**

```bash
git add js/router.mjs js/main.mjs
git commit -m "feat: add hash-based router for home/category/tip routes"
```

---

### Task 6: 팁 상세 페이지 + 애드배너 슬롯

**Files:**
- Modify: `js/render.mjs` (`tipCardHtml` export로 승격 + `renderTipDetail` 추가)
- Modify: `js/main.mjs` (팁 라우트 핸들러에서 `renderTipDetail` 호출)
- Modify: `css/layout.css` (상세 페이지 2단 레이아웃)
- Modify: `css/components.css` (애드 슬롯, 상세 본문 스타일)

**Interfaces:**
- Consumes: `tips` (Task 2)
- Produces: `render.mjs`: `export function renderTipDetail(el, tip, allTips)` — 상세 마크업 + 애드 슬롯 3곳(`#ad-in-article`, `#ad-bottom`, `#ad-sidebar-sticky`) + 관련 팁 카드(같은 카테고리, 최대 3개) 렌더.

- [ ] **Step 1: `css/layout.css`에 상세 페이지 2단 레이아웃 추가**

파일 끝에 추가:

```css
.tip-detail {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}
.tip-detail-main {
  flex: 1;
  min-width: 0;
}
.tip-detail-aside {
  width: 240px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .tip-detail-aside {
    display: none;
  }
}
```

- [ ] **Step 2: `css/components.css`에 애드 슬롯 + 상세 본문 스타일 추가**

파일 끝에 추가:

```css
.ad-slot {
  background: var(--bg);
  border: 1px dashed var(--border);
  border-radius: 10px;
  color: var(--sub);
  font-size: 13px;
  text-align: center;
  padding: 24px;
  margin: 20px 0;
}
.ad-slot-sticky {
  position: sticky;
  top: 20px;
  margin: 0;
}

.tip-detail-hero {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 20px;
  display: block;
}
.tip-detail h2 {
  font-size: 24px;
  margin-bottom: 16px;
}
.tip-detail-main p {
  line-height: 1.7;
  margin-bottom: 16px;
}
.related-tips h3 {
  font-size: 18px;
  margin: 32px 0 16px;
}
```

- [ ] **Step 3: `js/render.mjs` 전체를 아래 내용으로 교체 (`tipCardHtml` export 승격 + `renderTipDetail` 추가)**

```js
const ICONS = {
  bolt: '<svg class="icon" viewBox="0 0 24 24"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
};

export function renderSidebar(el, categories, activeCategoryId) {
  el.innerHTML = `
    <div class="sidebar-logo"><strong>for 컴알못</strong></div>
    <nav class="sidebar-nav">
      <a href="#/" class="sidebar-link ${!activeCategoryId ? 'active' : ''}">전체</a>
      ${categories.map((c) => `
        <a href="#/category/${c.id}" class="sidebar-link ${c.id === activeCategoryId ? 'active' : ''}">
          ${ICONS[c.icon] || ''}<span>${c.name}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

export function tipCardHtml(tip) {
  return `
    <a class="tip-card" href="#/tip/${tip.id}">
      <img class="tip-card-thumb" src="${tip.thumbnail}" alt="${tip.title}">
      <div class="tip-card-body">
        <h3>${tip.title}</h3>
        <p>${tip.summary}</p>
      </div>
    </a>
  `;
}

export function renderTipGrid(el, tips) {
  el.innerHTML = `<div class="tip-grid">${tips.map(tipCardHtml).join('')}</div>`;
}

export function renderTipDetail(el, tip, allTips) {
  const related = allTips.filter((t) => t.category === tip.category && t.id !== tip.id).slice(0, 3);
  // 스펙 7절: ad-in-article은 2~3번째 문단 "직후"에 오고, 그 뒤에 나머지 본문이 이어진 다음 ad-bottom이 온다.
  // 더미 데이터는 문단이 3개뿐이므로 2문단 후에 자르고, 남은 1문단을 "나머지 본문"으로 둔다.
  const beforeAd = tip.body.slice(0, 2).map((block) => `<p>${block.text}</p>`).join('');
  const afterAd = tip.body.slice(2).map((block) => `<p>${block.text}</p>`).join('');

  el.innerHTML = `
    <article class="tip-detail">
      <div class="tip-detail-main">
        <h2>${tip.title}</h2>
        <img class="tip-detail-hero" src="${tip.thumbnail}" alt="${tip.title}">
        ${beforeAd}
        <div class="ad-slot" id="ad-in-article">광고 영역 (in-article)</div>
        ${afterAd}
        <div class="ad-slot" id="ad-bottom">광고 영역 (bottom)</div>
        <section class="related-tips">
          <h3>관련 팁</h3>
          <div class="tip-grid">${related.map(tipCardHtml).join('')}</div>
        </section>
      </div>
      <aside class="tip-detail-aside">
        <div class="ad-slot ad-slot-sticky" id="ad-sidebar-sticky">광고 영역 (sidebar sticky)</div>
      </aside>
    </article>
  `;
}
```

- [ ] **Step 4: `js/main.mjs` 전체를 아래 내용으로 교체 (팁 라우트가 `renderTipDetail`을 호출하도록)**

```js
import { categories, tips } from './data.mjs';
import { renderSidebar, renderTipGrid, renderTipDetail } from './render.mjs';
import { onRouteChange, startRouter } from './router.mjs';

const sidebarEl = document.getElementById('sidebar');
const contentEl = document.getElementById('content-area');

function findCategory(id) {
  return categories.find((c) => c.id === id);
}
function findTip(id) {
  return tips.find((t) => t.id === id);
}

onRouteChange(/^\/$/, () => {
  renderSidebar(sidebarEl, categories, null);
  renderTipGrid(contentEl, tips);
});

onRouteChange(/^\/category\/(?<id>[^/]+)$/, ({ id }) => {
  const category = findCategory(id);
  if (!category) {
    location.hash = '#/';
    return;
  }
  renderSidebar(sidebarEl, categories, id);
  renderTipGrid(contentEl, tips.filter((t) => t.category === id));
});

onRouteChange(/^\/tip\/(?<id>[^/]+)$/, ({ id }) => {
  const tip = findTip(id);
  if (!tip) {
    location.hash = '#/';
    return;
  }
  renderSidebar(sidebarEl, categories, tip.category);
  renderTipDetail(contentEl, tip, tips);
});

startRouter();
```

- [ ] **Step 5: 브라우저 확인**

서버가 떠 있지 않다면 `npx http-server . -p 8080`, 브라우저로 팁 카드 클릭.

Expected:
- 제목 → 대표 이미지 → 본문 앞 2문단 → "광고 영역 (in-article)" 박스 → 본문 나머지 1문단 → "광고 영역 (bottom)" 박스 → "관련 팁" 섹션(같은 카테고리 팁 카드 최대 3개, 지금은 나머지 5개 중 3개) 순서로 보임
- 데스크탑 폭(1024px 초과)에서는 오른쪽에 "광고 영역 (sidebar sticky)" 박스가 보이고, 페이지를 스크롤해도 화면에 고정되어 따라옴
- 브라우저 폭을 1024px 이하로 줄이면 오른쪽 사이드 애드 박스가 사라짐
- DevTools 콘솔에 에러 없음

- [ ] **Step 6: Commit**

```bash
git add js/render.mjs js/main.mjs css/layout.css css/components.css
git commit -m "feat: add tip detail page with three ad banner placeholder slots"
```

---

### Task 7: 검색 + 정렬 + 빈 상태

**Files:**
- Create: `js/search.mjs`
- Modify: `js/render.mjs` (`renderEmptyState` 추가)
- Modify: `js/main.mjs` (검색바 배선, 그리드 라우트에서 검색/정렬 적용)
- Modify: `index.html` (검색바 마크업 추가)
- Modify: `css/components.css` (검색바, 빈 상태 스타일)

**Interfaces:**
- Consumes: `tips` (Task 2), `renderTipGrid` (Task 4)
- Produces: `search.mjs`: `export function filterAndSortTips(tips, keyword, sort)` — `sort`는 `'newest' | 'title'`. `render.mjs`: `export function renderEmptyState(el, keyword, onReset)`.

- [ ] **Step 1: `js/search.mjs` 작성**

```js
export function filterAndSortTips(tips, keyword, sort) {
  const trimmed = keyword.trim().toLowerCase();
  const filtered = trimmed
    ? tips.filter((t) =>
        t.title.toLowerCase().includes(trimmed) ||
        t.summary.toLowerCase().includes(trimmed) ||
        t.tags.some((tag) => tag.toLowerCase().includes(trimmed))
      )
    : tips.slice();

  return filtered.sort((a, b) => {
    if (sort === 'title') {
      return a.title.localeCompare(b.title, 'ko');
    }
    return new Date(b.date) - new Date(a.date);
  });
}
```

- [ ] **Step 2: 문법 검증**

Run: `node --check js/search.mjs`
Expected: 출력 없음

- [ ] **Step 3: 동작 검증**

Run:
```bash
node -e "
import('./js/search.mjs').then(async ({ filterAndSortTips }) => {
  const { tips } = await import('./js/data.mjs');
  const byKeyword = filterAndSortTips(tips, 'SSD', 'newest');
  console.assert(byKeyword.length === 1 && byKeyword[0].id === 'pc-optimization-3', 'keyword filter failed');
  const byTitle = filterAndSortTips(tips, '', 'title');
  console.assert(byTitle[0].title.localeCompare(byTitle[1].title, 'ko') <= 0, 'title sort failed');
  const empty = filterAndSortTips(tips, '존재하지않는검색어', 'newest');
  console.assert(empty.length === 0, 'empty filter failed');
  console.log('OK');
});
"
```
Expected: `OK` 출력, assert 실패 메시지 없음

- [ ] **Step 4: `js/render.mjs`에 `renderEmptyState` 추가**

파일 끝에 추가:

```js
export function renderEmptyState(el, keyword, onReset) {
  el.innerHTML = `
    <div class="empty-state">
      <p>"${keyword}"에 대한 조건에 맞는 팁이 없어요</p>
      <button class="btn" id="reset-search-btn" type="button">검색어 초기화</button>
    </div>
  `;
  document.getElementById('reset-search-btn').addEventListener('click', onReset);
}
```

- [ ] **Step 5: `css/components.css`에 검색바 + 빈 상태 스타일 추가**

파일 끝에 추가:

```css
.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}
.search-bar input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  color: var(--text);
}
.search-bar select {
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: inherit;
  font-size: 14px;
  background: var(--surface);
  color: var(--text);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--sub);
}
.empty-state p {
  margin-bottom: 16px;
}
```

- [ ] **Step 6: `index.html`의 `#content-area` 위에 검색바 마크업 추가**

`<main class="main-content" id="main-content">` 안쪽을 아래로 교체:

```html
    <main class="main-content" id="main-content">
      <div class="search-bar" id="search-bar">
        <input type="text" id="search-input" placeholder="팁 검색...">
        <select id="sort-select">
          <option value="newest">최신순</option>
          <option value="title">제목순</option>
        </select>
      </div>
      <div id="content-area"></div>
    </main>
```

- [ ] **Step 7: `js/main.mjs` 전체를 아래 내용으로 교체**

```js
import { categories, tips } from './data.mjs';
import { renderSidebar, renderTipGrid, renderTipDetail, renderEmptyState } from './render.mjs';
import { onRouteChange, startRouter } from './router.mjs';
import { filterAndSortTips } from './search.mjs';

const sidebarEl = document.getElementById('sidebar');
const contentEl = document.getElementById('content-area');
const searchBarEl = document.getElementById('search-bar');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');

const searchState = { keyword: '', sort: 'newest' };
let currentCategoryId = null;

function findCategory(id) {
  return categories.find((c) => c.id === id);
}
function findTip(id) {
  return tips.find((t) => t.id === id);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function showGrid(categoryId) {
  currentCategoryId = categoryId;
  searchBarEl.style.display = 'flex';
  const scoped = categoryId ? tips.filter((t) => t.category === categoryId) : tips;
  const result = filterAndSortTips(scoped, searchState.keyword, searchState.sort);
  if (result.length === 0) {
    renderEmptyState(contentEl, searchState.keyword, () => {
      searchInput.value = '';
      searchState.keyword = '';
      showGrid(currentCategoryId);
    });
  } else {
    renderTipGrid(contentEl, result);
  }
}

onRouteChange(/^\/$/, () => {
  renderSidebar(sidebarEl, categories, null);
  showGrid(null);
});

onRouteChange(/^\/category\/(?<id>[^/]+)$/, ({ id }) => {
  const category = findCategory(id);
  if (!category) {
    location.hash = '#/';
    return;
  }
  renderSidebar(sidebarEl, categories, id);
  showGrid(id);
});

onRouteChange(/^\/tip\/(?<id>[^/]+)$/, ({ id }) => {
  const tip = findTip(id);
  if (!tip) {
    location.hash = '#/';
    return;
  }
  searchBarEl.style.display = 'none';
  renderSidebar(sidebarEl, categories, tip.category);
  renderTipDetail(contentEl, tip, tips);
});

searchInput.addEventListener('input', debounce(() => {
  searchState.keyword = searchInput.value;
  showGrid(currentCategoryId);
}, 250));

sortSelect.addEventListener('change', () => {
  searchState.sort = sortSelect.value;
  showGrid(currentCategoryId);
});

startRouter();
```

- [ ] **Step 8: 브라우저 확인**

서버가 떠 있지 않다면 `npx http-server . -p 8080`, 브라우저로 `http://localhost:8080` 접속.

Expected:
- 홈/카테고리 화면 상단에 검색창 + 정렬 드롭다운이 보이고, 팁 상세 페이지에서는 검색바가 사라짐
- 검색창에 "SSD" 입력(입력 멈추고 약 0.25초 후) → 카드 1개("SSD 교체...")만 남음, 입력 중 커서가 빠지지 않음
- 검색창에 "존재하지않는검색어" 입력 → "조건에 맞는 팁이 없어요" 문구 + "검색어 초기화" 버튼이 보임, 버튼 클릭 시 검색어가 지워지고 6개 카드가 다시 보임
- 정렬을 "제목순"으로 바꾸면 카드 순서가 제목 가나다순으로 바뀜
- DevTools 콘솔에 에러 없음

- [ ] **Step 9: Commit**

```bash
git add js/search.mjs js/render.mjs js/main.mjs index.html css/components.css
git commit -m "feat: add keyword search, sort, and empty state"
```

---

## 완료 후 최종 점검 (수동)

전체 태스크가 끝나면 서버를 띄운 채로 아래를 한 번에 훑어본다 (별도 커밋 없음, 발견된 문제는 개별적으로 수정 후 커밋):

- [ ] 데스크탑(1280px) / 태블릿(768~1024px) / 모바일(768px 미만) 3개 폭에서 사이드바·그리드·상세 페이지가 모두 자연스럽게 보이는지
- [ ] `#/`, `#/category/pc-optimization`, `#/tip/pc-optimization-1` ~ `6`, 존재하지 않는 라우트(`#/tip/xxx`, `#/category/xxx`) 전체를 주소창에 직접 쳐서 확인
- [ ] 애드 슬롯 3곳(`ad-in-article`, `ad-bottom`, `ad-sidebar-sticky`)이 스펙(문서 8절)에서 정한 위치에 정확히 있는지
- [ ] `node --check`를 모든 `.mjs` 파일에 대해 한 번씩 재실행 (`js/data.mjs js/router.mjs js/render.mjs js/search.mjs js/main.mjs`)
