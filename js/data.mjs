function placeholderThumb(index) {
  const palette = ['#DBEAFE', '#DCFCE7', '#FEF3C7', '#FCE7F3', '#E0E7FF', '#FFE4E6'];
  const color = palette[index % palette.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240">` +
    `<rect width="400" height="240" fill="${color}"/>` +
    `<text x="200" y="130" font-family="Inter,sans-serif" font-size="32" font-weight="800" fill="#1B64DA" text-anchor="middle">TIP ${index + 1}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function placeholderImage(caption) {
  const escaped = caption.length > 40 ? caption.slice(0, 40) + '…' : caption;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="420">` +
    `<rect width="800" height="420" fill="#F2F4F6"/>` +
    `<rect x="1" y="1" width="798" height="418" fill="none" stroke="#E5E8EB" stroke-width="2" stroke-dasharray="8 6"/>` +
    `<text x="400" y="195" font-family="Inter,sans-serif" font-size="24" font-weight="800" fill="#8B95A1" text-anchor="middle">스크린샷 준비중</text>` +
    `<text x="400" y="230" font-family="Inter,sans-serif" font-size="15" fill="#8B95A1" text-anchor="middle">${escaped}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const categories = [
  { id: 'gamer-tips', name: '팁 for 게이머', icon: 'bolt' },
];

export const tips = [
  {
    id: 'gamer-tips-1',
    category: 'gamer-tips',
    title: '게임 시작 전 PC 설정 총집합',
    summary: '게임을 켜기 전에 딱 한 번만 점검해두면 계속 도움이 되는 드라이버·윈도우 설정 체크리스트.',
    thumbnail: placeholderThumb(0),
    body: [
      { type: 'paragraph', text: '게임을 시작하기 전에 딱 한 번만 점검해두면 계속 도움이 되는 설정들을 모았습니다. 무슨 뜻인지 몰라도 괜찮으니, 아래 순서대로 그대로 따라오시면 됩니다.' },
      { type: 'paragraph', text: '① 윈도우·드라이버·바이오스 업데이트 확인부터 시작하세요.' },
      { type: 'steps', items: [
        '키보드에서 윈도우 키를 누르고 "Windows Update"라고 입력한 뒤 엔터',
        '"업데이트 확인" 버튼을 눌러서 대기 중인 업데이트가 있으면 전부 설치',
        '그래픽카드 드라이버는 제조사 사이트에서 받으세요 — NVIDIA는 nvidia.com/drivers, AMD는 amd.com/support, Intel은 intel.com/content/www/kr/ko/support 에서 본인 그래픽카드 모델명을 검색',
        '메인보드 모델명은 윈도우 키를 누르고 "시스템 정보"를 검색해서 실행한 뒤 "시스템 모델" 항목에서 확인 가능하며, 오디오·랜(LAN) 드라이버는 반드시 이 메인보드 제조사(ASUS, MSI, 기가바이트 등) 홈페이지에서 받아 설치하세요',
      ] },
      { type: 'image', src: placeholderImage('시스템 정보 — 시스템 모델(메인보드) 확인 위치'), caption: '시스템 정보 — 시스템 모델(메인보드) 확인 위치' },
      { type: 'paragraph', text: '② 윈도우 11 게임 설정을 한 번 훑어보세요.' },
      { type: 'steps', items: [
        '윈도우 키를 누르고 "게임 설정"이라고 입력 후 엔터 (또는 설정 앱 > 게임)',
        '왼쪽 메뉴의 게임 모드, Xbox Game Bar, 캡처 항목을 하나씩 눌러서 어떤 옵션이 있는지 확인만 해두세요',
      ] },
      { type: 'paragraph', text: '③ 하드웨어 가속 GPU 일정 예약(HAGS)을 켰을 때와 껐을 때 프레임이 어떻게 달라지는지 직접 비교해보세요.' },
      { type: 'steps', items: [
        '설정 > 시스템 > 디스플레이 > 그래픽으로 이동',
        '"기본 그래픽 설정" 아래의 "하드웨어 가속 GPU 일정 예약" 스위치를 확인',
        '켜진 상태와 꺼진 상태 각각으로 평소 하는 게임을 몇 분씩 켜보고, 프레임이 더 안정적인 쪽으로 두세요 (설정을 바꾸면 재부팅을 요구할 수 있습니다)',
      ] },
      { type: 'image', src: placeholderImage('디스플레이 > 그래픽 — HAGS 스위치 위치'), caption: '디스플레이 > 그래픽 — HAGS 스위치 위치' },
      { type: 'paragraph', text: '④ 게임 모드를 켜두세요.' },
      { type: 'steps', items: [
        '설정 > 게임 > 게임 모드로 이동',
        '스위치를 켜짐으로 설정',
      ] },
      { type: 'paragraph', text: '⑤ 전원 관리 모드를 고성능 쪽으로 설정하세요.' },
      { type: 'steps', items: [
        '설정 > 시스템 > 전원으로 이동',
        '"전원 모드"를 "최고의 성능" 또는 "고성능"으로 변경 (노트북은 배터리가 빨리 닳을 수 있으니, 충전기를 연결한 상태에서 게임하는 걸 추천합니다)',
      ] },
      { type: 'paragraph', text: '⑥ 모니터 주사율이 제대로 잡혀있는지 확인하세요 — 기본값이 60Hz로 되어 있는 경우가 은근히 많습니다.' },
      { type: 'steps', items: [
        '설정 > 시스템 > 디스플레이 > 고급 디스플레이로 이동',
        '"화면 재생 빈도"가 모니터 실제 스펙(144Hz, 165Hz 등)으로 되어 있는지 확인하고, 60Hz로 되어 있다면 실제 스펙에 맞게 변경',
      ] },
      { type: 'image', src: placeholderImage('고급 디스플레이 — 화면 재생 빈도 위치'), caption: '고급 디스플레이 — 화면 재생 빈도 위치' },
    ],
    tags: ['게임설정', '드라이버', 'HAGS'],
    date: '2026-08-16',
  },
  {
    id: 'gamer-tips-2',
    category: 'gamer-tips',
    title: '프레임드랍 원인 찾기',
    summary: '무작정 그래픽 설정을 낮추기 전에, CPU/온도/사용률부터 확인해서 진짜 원인을 찾는 법.',
    thumbnail: placeholderThumb(1),
    body: [
      { type: 'paragraph', text: '게임 중 프레임이 자꾸 떨어진다면, 무작정 그래픽 설정을 낮추기 전에 원인부터 찾아보는 게 순서입니다. 아래 순서대로 확인해보세요.' },
      { type: 'paragraph', text: '① 먼저 확인용 프로그램 두 개를 설치하세요 (둘 다 무료입니다).' },
      { type: 'steps', items: [
        'cpuid.com/softwares/cpu-z 접속 → Setup 버전 다운로드 → 설치 (CPU 부하 확인용)',
        'cpuid.com/softwares/hwmonitor 접속 → Setup 버전 다운로드 → 설치 (온도 확인용)',
      ] },
      { type: 'paragraph', text: '② 게임을 켜둔 상태에서 아래 항목들을 확인하세요.' },
      { type: 'steps', items: [
        '게임 중 Alt+Tab으로 화면을 전환해 HWMonitor를 열고, CPU 온도(Temperature) 항목이 몇 도까지 올라가는지 확인 — 80도 이상이면 위험 신호',
        'CPU-Z 메인 화면에서 CPU 클럭 속도가 게임 중 크게 떨어지지 않는지 확인',
        'Ctrl+Shift+Esc로 작업 관리자를 열고 "성능" 탭에서 CPU와 GPU 사용률을 게임하는 동안 지켜보고, 어느 한쪽이 계속 90~100%에 붙어있는지 확인',
      ] },
      { type: 'image', src: placeholderImage('작업 관리자 > 성능 탭 — CPU/GPU 사용률 그래프'), caption: '작업 관리자 > 성능 탭 — CPU/GPU 사용률 그래프' },
      { type: 'paragraph', text: '③ 증상에 따라 대처하세요. 온도가 유난히 높게 나온다면 내부 먼지 청소나 CPU 써멀구리스 재도포만으로도 눈에 띄게 좋아지는 경우가 많습니다. 그래도 온도가 안 잡히면 CPU 쿨러·시스템 팬의 RPM이 실제로 올라가는지 확인하고, 필요하면 팬 교체를 고려하세요.' },
    ],
    tags: ['프레임드랍', '온도체크', 'CPU-Z'],
    date: '2026-08-15',
  },
  {
    id: 'gamer-tips-3',
    category: 'gamer-tips',
    title: '가격이 미쳐버린 램, 용량 부족 응급처치',
    summary: '당장 램을 못 사는 상황에서 소프트웨어적으로 메모리를 짜내는 방법들.',
    thumbnail: placeholderThumb(2),
    body: [
      { type: 'paragraph', text: '램 가격이 너무 올라서 당장 추가 구매가 부담스럽다면, 먼저 소프트웨어적으로 짜낼 수 있는 만큼 짜내보세요.' },
      { type: 'paragraph', text: '① 크롬의 메모리 절약 모드를 켜세요 — 안 보는 탭의 메모리를 자동으로 비워줍니다.' },
      { type: 'steps', items: [
        '크롬 우측 상단 점 3개(⋮) 클릭 → 설정',
        '왼쪽 메뉴에서 "성능" 클릭',
        '"메모리 절약 모드" 스위치를 켜짐으로 변경',
      ] },
      { type: 'image', src: placeholderImage('크롬 설정 > 성능 — 메모리 절약 모드 스위치'), caption: '크롬 설정 > 성능 — 메모리 절약 모드 스위치' },
      { type: 'paragraph', text: '② 시작프로그램을 정리하세요 — 게임 실행 전부터 차지하고 있던 메모리를 돌려받을 수 있습니다.' },
      { type: 'steps', items: [
        'Ctrl+Shift+Esc를 눌러 작업 관리자 열기',
        '상단 "시작프로그램" 탭 클릭',
        '"시작 시 영향"이 "높음"으로 표시된 것 중 평소 안 쓰는 프로그램을 선택하고 우클릭 → "사용 안 함"',
      ] },
      { type: 'image', src: placeholderImage('작업 관리자 > 시작프로그램 탭'), caption: '작업 관리자 > 시작프로그램 탭' },
      { type: 'paragraph', text: '③ 그래도 부족하면 SSD를 가상 메모리(페이지 파일)로 넉넉히 잡아두는 것도 임시방편이 됩니다.' },
      { type: 'steps', items: [
        '윈도우 키 → "고급 시스템 설정" 검색 → 실행',
        '"고급" 탭 → "성능" 항목의 "설정" 버튼 클릭',
        '다시 "고급" 탭 → "가상 메모리" 항목의 "변경" 버튼 클릭',
        '"모든 드라이브에 대해 페이징 파일 크기 자동 관리"를 체크 해제하고, SSD가 설치된 드라이브를 선택 → "사용자 지정 크기"에 넉넉한 값(예: 4096~8192MB) 입력 후 "설정" → "확인"',
      ] },
      { type: 'image', src: placeholderImage('가상 메모리(페이지 파일) 설정 창'), caption: '가상 메모리(페이지 파일) 설정 창' },
      { type: 'paragraph', text: '다만 이건 어디까지나 응급처치입니다. 근본적으로는… 마음의 준비를 하고 램을 사는 게 가장 확실합니다.' },
    ],
    tags: ['램부족', '메모리최적화', '가상메모리'],
    date: '2026-08-14',
  },
  {
    id: 'gamer-tips-4',
    category: 'gamer-tips',
    title: '크롬 속도 느릴 때 DNS 설정법',
    summary: '크롬 로딩이 유난히 느리다면 DNS 서버 문제일 수 있습니다. 1분이면 바꿀 수 있어요.',
    thumbnail: placeholderThumb(3),
    body: [
      { type: 'paragraph', text: '크롬이 유난히 느리거나 사이트 로딩이 오래 걸린다면 DNS 서버 문제일 수 있습니다. 아래 순서대로 DNS를 바꿔보세요.' },
      { type: 'steps', items: [
        '크롬 우측 상단 점 3개(⋮) 클릭 → 설정',
        '왼쪽 메뉴에서 "개인정보 보호 및 보안" 클릭',
        '"보안" 클릭',
        '아래로 스크롤해서 "고급" 항목의 "보안 DNS 사용" 스위치를 켜짐으로 변경',
        '"직접 입력" 대신 목록에서 제공업체를 선택 — Cloudflare(1.1.1.1) 또는 Google(8.8.8.8, 8.8.4.4) 중 하나',
        '크롬을 완전히 껐다가 다시 켜서 적용',
      ] },
      { type: 'image', src: placeholderImage('크롬 설정 > 보안 — 보안 DNS 사용 옵션'), caption: '크롬 설정 > 보안 — 보안 DNS 사용 옵션' },
      { type: 'paragraph', text: '통신사 기본 DNS보다 응답 속도가 빠른 경우가 많아서, 별다른 설정 없이 체감 속도가 개선되는 경우가 많습니다. 하나를 적용해보고 별 차이가 없으면 다른 쪽으로도 바꿔서 비교해보세요.' },
    ],
    tags: ['크롬', 'DNS', '인터넷속도'],
    date: '2026-08-13',
  },
  {
    id: 'gamer-tips-5',
    category: 'gamer-tips',
    title: '오디오 고급기능(Enhancements)이 안 보일 때',
    summary: '사운드 설정에 "향상 기능" 탭 자체가 없을 때, 스크립트로 라우드니스 이퀄라이제이션을 직접 켜는 방법.',
    thumbnail: placeholderThumb(4),
    body: [
      { type: 'paragraph', text: '오디오 설정에서 "향상 기능(Enhancements)" 또는 "음향 효과" 탭이 아예 안 보이는 경우가 있습니다. 이럴 땐 오픈소스 스크립트로 라우드니스 이퀄라이제이션 기능을 직접 활성화할 수 있습니다. 명령어가 낯설어 보여도 그대로 복사·붙여넣기만 하면 되니 순서대로 따라오세요.' },
      { type: 'steps', items: [
        '윈도우 하단 검색(돋보기) 버튼을 누르고 "Windows PowerShell" 입력',
        '검색 결과에서 마우스 우클릭 → "관리자 권한으로 실행" 클릭',
        '아래 3줄을 한 줄씩 순서대로 복사해서 붙여넣고, 매 줄마다 엔터: Invoke-WebRequest https://raw.githubusercontent.com/Falcosc/enable-loudness-equalisation/main/EnableLoudness.ps1 -OutFile $env:HOMEPATH\\EnableLoudness.ps1',
        'Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser',
        '. $env:HOMEPATH\\EnableLoudness.ps1',
        '실행 권한을 부여할지 물어보면 y 입력 후 엔터',
        '이어서 사운드 장치 이름을 입력하라고 나오면, 본인이 쓰는 출력 장치 이름을 정확히 입력 후 엔터 (예: "Realtek USB2.0 Audio")',
      ] },
      { type: 'paragraph', text: '장치 이름은 설정 > 시스템 > 소리에서 현재 사용 중인 출력 장치 이름을 그대로 복사해서 쓰면 정확합니다.' },
    ],
    tags: ['오디오', 'Enhancements', 'PowerShell'],
    date: '2026-08-12',
  },
  {
    id: 'gamer-tips-6',
    category: 'gamer-tips',
    title: '게임 중 오버레이 끄기',
    summary: '디스코드·Xbox Game Bar 같은 백그라운드 오버레이가 프레임드랍의 숨은 원인일 수 있습니다.',
    thumbnail: placeholderThumb(5),
    body: [
      { type: 'paragraph', text: '디스코드 인게임 오버레이나 Xbox Game Bar 같은 백그라운드 오버레이가 켜져 있으면, 특히 사양이 낮은 PC에서는 프레임드랍의 원인이 될 수 있습니다. 평소에 잘 안 쓴다면 아예 꺼두는 걸 추천합니다.' },
      { type: 'paragraph', text: '① 디스코드 오버레이 끄기' },
      { type: 'steps', items: [
        '디스코드 실행 → 좌측 하단 톱니바퀴(사용자 설정) 클릭',
        '왼쪽 메뉴에서 "게임 오버레이" 클릭',
        '상단 "활성화" 스위치를 꺼짐으로 변경',
      ] },
      { type: 'image', src: placeholderImage('디스코드 설정 > 게임 오버레이'), caption: '디스코드 설정 > 게임 오버레이' },
      { type: 'paragraph', text: '② Xbox Game Bar 끄기' },
      { type: 'steps', items: [
        '윈도우 키 → "설정" 실행 (또는 Win+I)',
        '"게임" 클릭 → "Xbox Game Bar" 클릭',
        '"Xbox Game Bar를 사용하여 게임 클립, 스크린샷 및 방송 녹화" 스위치를 꺼짐으로 변경',
      ] },
      { type: 'image', src: placeholderImage('설정 > 게임 > Xbox Game Bar'), caption: '설정 > 게임 > Xbox Game Bar' },
      { type: 'paragraph', text: '필요할 때만 그때그때 다시 켜서 쓰는 것도 방법입니다.' },
    ],
    tags: ['오버레이', '디스코드', 'Xbox Game Bar'],
    date: '2026-08-11',
  },
];
