# Bboggl 레시피 — "for 컴알못" 프론트엔드 설계

- 날짜: 2026-08-15
- 범위: PART 1 (프론트엔드)만. 백엔드는 `docs/backend-setup-guide.md` 참고, 이 문서 범위 밖.

## 1. 개요

PC를 잘 모르는 사람("컴알못")을 위한 팁·정보 사이트. 첫 카테고리는 "PC 최적화"로 시작하고,
사이드바에 카테고리를 계속 추가해가며 팁을 늘려나가는 구조를 목표로 한다.

- 사이트명: for 컴알못
- 기술 스택: 순수 HTML/CSS/JS (빌드 도구·프레임워크 없음, `package.json` 없음)
- 프로젝트 위치: `for-comalmot/` (신규 폴더, `sourcing-extension-phase1_93`와 무관한 독립 프로젝트)

## 2. 디자인 시스템 (그대로 준수)

```css
:root{
  --primary:#3182F6;
  --primary-dark:#1B64DA;
  --text:#4E5968;
  --sub:#8B95A1;
  --bg:#F2F4F6;
  --surface:#FFFFFF;
  --border:#E5E8EB;
}

.btn{border-radius:10px;padding:12px 20px;font-weight:700;background:var(--primary);color:#fff;border:none;cursor:pointer;transition:.15s}
.btn:hover{filter:brightness(.95)}

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap');
body{font-family:'Inter',sans-serif;letter-spacing:-0.01em}
h1,h2,h3{font-weight:800}

.icon{width:24px;height:24px;fill:currentColor;stroke:none}
```

- CTA·링크: Primary(#3182F6). 본문: Text(#4E5968).
- 아이콘: solid(채움) 스타일, Material Symbols(filled) / Heroicons solid 기준.

## 3. 기능 범위 (PART 1)

- 팁 목록/카테고리 탐색, 팁 상세 보기
- 키워드 검색 + 정렬(최신순/제목순) — 클라이언트 사이드 필터 (초기 데이터가 소규모이므로 검색 API 불필요)
- 팁 콘텐츠 추가는 **코드(데이터 파일) 수정으로만** — 사이트 내 "추가" UI 없음. 브라우저에 값 입력받는 폼이 없으므로 백엔드/저장소 불필요.
- 애드배너 자리(플레이스홀더)만 확보. 실제 광고 네트워크 연동은 PART 2 이후.

### 범위 밖 (Out of scope, PART 1)
- 실제 광고 스크립트/네트워크 연동
- 사용자 로그인, 사이트 내 콘텐츠 작성 UI
- 서버 검색 API (데이터 규모가 커지기 전까지는 불필요)

## 4. 폴더/파일 구조

```
for-comalmot/
├── index.html            # 유일한 HTML 셸 (헤더+사이드바+콘텐츠 영역)
├── css/
│   ├── tokens.css         # 디자인 시스템 변수 (2절 값 그대로)
│   ├── layout.css         # 사이드바/그리드/반응형 레이아웃
│   └── components.css     # 카드, 검색바, 배지 등 컴포넌트 스타일
├── js/
│   ├── data.js             # 더미 팁 데이터 (카테고리 1개 · 팁 6개)
│   ├── router.js            # 해시 라우팅
│   ├── render.js             # 사이드바/카드그리드/상세 렌더링 함수
│   ├── search.js              # 키워드 검색 + 정렬
│   └── main.js                 # 앱 초기화, 이벤트 바인딩
├── images/tips/                  # 더미 팁 썸네일
└── icons/                          # solid 아이콘 svg
```

JS는 `<script type="module">`로 분리 로드. 파일 하나가 하나의 책임만 갖도록 나눈다(예: `render.js`는 렌더링만, `search.js`는 필터/정렬 로직만).

## 5. 데이터 모델

```js
// tip
{
  id: 'pc-optimization-1',
  category: 'pc-optimization',
  title: '...',
  summary: '...',
  thumbnail: 'images/tips/1.jpg',
  body: [
    { type: 'paragraph', text: '...' },
    { type: 'image', src: '...', caption: '...' }
  ],
  tags: ['SSD'],
  date: '2026-08-01'
}

// category
{ id: 'pc-optimization', name: 'PC 최적화', icon: 'bolt' }
```

초기 데이터: 카테고리 1개("PC 최적화") · 더미 팁 6개.

## 6. 라우팅

해시 기반 라우팅 (빌드 도구 없이 새로고침/링크 공유 지원).

- `#/` → 홈 (카드 그리드, 카테고리가 늘어나도 구조 유지)
- `#/category/:id` → 해당 카테고리 그리드
- `#/tip/:id` → 팁 상세 (애드 슬롯 3곳 포함, 5절 참고)
- 존재하지 않는 id로 접근 시 → 홈(`#/`)으로 리다이렉트

`router.js`가 `hashchange` 이벤트를 듣고 `render.js`의 해당 렌더 함수를 호출한다.

## 7. 컴포넌트 & 반응형

- **사이드바**: 데스크탑 240px 고정폭. 모바일은 상단 가로 스크롤 카테고리 칩으로 전환(숨기지 않음 — 카테고리 탐색이 핵심 기능).
- **홈/카테고리 화면 — 균일 카드 그리드** (히어로 배너 없음, 브레인스토밍 시 브라우저 목업 B안으로 확정): 데스크탑 3열 → 태블릿 2열 → 모바일 1열. 카드 = 썸네일 + 제목 + 요약.
- **검색바**: 키워드 입력(디바운스) + 정렬 드롭다운(최신순/제목순).
- **상세페이지**: 제목 → 대표이미지 → 본문(2~3문단 후 `ad-in-article` 슬롯) → 나머지 본문 → `ad-bottom` 슬롯 → 관련 팁 카드. 데스크탑은 우측에 `ad-sidebar-sticky` 슬롯 추가.

## 8. 애드배너 슬롯 (플레이스홀더만)

리서치 결과, 상단 고정 배너보다 본문 삽입형이 조회율·RPM이 높고, 사이드바는 스크롤 고정(sticky)형이 유리하다는 근거로 아래 3개 슬롯을 확보한다. 실제 광고 스크립트는 넣지 않는다(PART 2 이후).

| 슬롯 id | 위치 | 노출 |
|---|---|---|
| `ad-in-article` | 본문 2~3번째 문단 직후 | 모바일/데스크탑 공통 |
| `ad-bottom` | 본문 끝, 관련 팁 추천 영역 위 | 모바일/데스크탑 공통 |
| `ad-sidebar-sticky` | 상세페이지 우측 사이드바 하단, 스크롤 고정 | 데스크탑 전용 (모바일 `display:none`) |

상단(헤더 바로 아래) 배너는 이탈률 우려로 제외.

## 9. 빈 상태 · 에러 처리

- 검색 결과 0개 → "조건에 맞는 팁이 없어요" 안내 + 검색어 초기화 버튼
- 잘못된 해시 라우트 → 홈(`#/`)으로 자동 이동
- 이미지 로드 실패 → 회색 placeholder 배경으로 대체

## 10. 테스트

자동화 테스트 스위트는 두지 않는다(순수 정적 사이트, 빌드 도구 없음).

- 문법 검증: `node --check js/*.js` 각 파일에 대해 실행
- 수동 확인: 데스크탑/태블릿/모바일 3개 구간 반응형, 검색/정렬, 라우팅(`#/`, `#/category/:id`, `#/tip/:id`, 잘못된 id), 광고 슬롯 3곳 렌더 위치
