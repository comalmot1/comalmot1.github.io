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
  { id: 'gamer-tips', name: '팁 for 게이머', icon: 'bolt' },
];

export const tips = [
  {
    id: 'gamer-tips-1',
    category: 'gamer-tips',
    title: '게임 시작 전 PC 설정 총집합',
    summary: '게임을 켜기 전에 한 번씩 점검하면 좋은 드라이버·윈도우 설정 체크리스트.',
    thumbnail: placeholderThumb(0),
    body: [
      { type: 'paragraph', text: '게임을 시작하기 전에 윈도우, 그래픽카드 드라이버, 메인보드 바이오스가 최신 버전인지부터 확인하세요. 특히 오디오·랜(LAN) 드라이버는 윈도우 자동 업데이트가 아니라 반드시 메인보드 제조사 홈페이지에서 받은 드라이버로 설치하는 게 안정적입니다.' },
      { type: 'paragraph', text: '설정 > 게임에서 윈도우 11의 게임 관련 설정을 한 번 쭉 훑어보고, 하드웨어 가속 GPU 일정 예약(HAGS)을 켰을 때와 껐을 때 프레임이 어떻게 달라지는지 직접 비교해보세요. 게임에 따라 유리한 쪽이 다릅니다.' },
      { type: 'paragraph', text: '게임 모드를 켜두고, 전원 관리 모드를 본인 PC에 맞는 고성능 쪽으로 설정하세요. 마지막으로 디스플레이 설정에서 실제 주사율이 모니터 스펙대로(144Hz 등) 잡혀있는지도 꼭 확인하세요 — 기본값이 60Hz로 되어 있는 경우가 은근히 많습니다.' },
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
      { type: 'paragraph', text: '게임 중 프레임이 뚝뚝 떨어진다면 무작정 설정을 낮추기 전에 원인부터 찾는 게 순서입니다. CPU-Z로 CPU 부하를, HWMONITOR로 온도를 함께 확인하면서 게임을 돌려보세요.' },
      { type: 'paragraph', text: '작업 관리자나 스팀 벤치마크 도구로 CPU와 GPU 중 어느 쪽 사용률이 100%에 가깝게 튀는지 보면, 병목이 어느 부품인지 대략 감이 옵니다.' },
      { type: 'paragraph', text: '온도가 유난히 높게 나온다면 내부 먼지 청소나 CPU 써멀구리스 재도포만으로도 눈에 띄게 좋아지는 경우가 많습니다. 그래도 안 잡히면 CPU 쿨러·시스템 팬의 RPM이 제대로 올라가는지 확인하고, 필요하면 팬 교체를 고려하세요.' },
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
      { type: 'paragraph', text: '램 가격이 너무 올라서 당장 추가 구매가 부담스럽다면, 먼저 소프트웨어적으로 짜낼 수 있는 만큼 짜내보세요. 크롬 등 브라우저의 "메모리 절약 모드"를 켜두면 안 보는 탭의 메모리를 자동으로 비워줍니다.' },
      { type: 'paragraph', text: '시작프로그램에 불필요하게 많이 등록된 프로그램을 정리하면 게임 실행 전부터 차지하고 있던 메모리를 돌려받을 수 있습니다.' },
      { type: 'paragraph', text: '그래도 부족하면 가상 메모리(페이지 파일)를 SSD에 넉넉히 잡아두는 것도 임시방편이 됩니다. 다만 이건 어디까지나 응급처치이고, 근본적으로는… 마음의 준비를 하고 램을 사는 게 가장 확실합니다.' },
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
      { type: 'paragraph', text: '크롬이 유난히 느리거나 사이트 로딩이 오래 걸린다면 DNS 서버 문제일 수 있습니다. 크롬 설정 > 개인정보 및 보안 > 보안 항목으로 들어가서 "보안 DNS 사용"을 켜고, 제공업체 목록에서 Cloudflare(1.1.1.1)나 Google(8.8.8.8, 8.8.4.4) 중 하나를 선택해보세요.' },
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
      { type: 'paragraph', text: '오디오 설정에서 "향상 기능(Enhancements)" 또는 "음향 효과" 탭이 아예 안 보이는 경우가 있습니다. 이럴 땐 오픈소스 스크립트로 라우드니스 이퀄라이제이션 기능을 직접 활성화할 수 있습니다.' },
      { type: 'paragraph', text: '먼저 윈도우 하단 검색(돋보기) 버튼을 누르고 "Windows PowerShell"을 관리자 권한으로 실행하세요.' },
      { type: 'paragraph', text: '아래 명령어를 그대로 복사해서 PowerShell 창에 붙여넣고 엔터를 누르세요: Invoke-WebRequest https://raw.githubusercontent.com/Falcosc/enable-loudness-equalisation/main/EnableLoudness.ps1 -OutFile $env:HOMEPATH\\EnableLoudness.ps1 / Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser / . $env:HOMEPATH\\EnableLoudness.ps1' },
      { type: 'paragraph', text: '실행 권한을 부여할지 물어보면 y를 입력하고 엔터를 누르세요. 이어서 라우드니스를 활성화할 사운드 장치 이름을 입력하라고 나오는데, 본인이 쓰는 출력 장치 이름을 그대로 입력하고 엔터를 누르면 됩니다. (예: "Realtek USB2.0 Audio")' },
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
      { type: 'paragraph', text: '디스코드 인게임 오버레이나 Xbox Game Bar 같은 백그라운드 오버레이가 켜져 있으면, 특히 사양이 낮은 PC에서는 프레임드랍의 원인이 될 수 있습니다.' },
      { type: 'paragraph', text: '디스코드는 설정 > 게임 오버레이에서 "활성화" 스위치를 끄면 되고, Xbox Game Bar는 윈도우 설정 > 게임에서 "Xbox Game Bar를 사용하여 게임 클립, 스크린샷 녹화" 옵션을 꺼두면 됩니다.' },
      { type: 'paragraph', text: '평소에 오버레이 기능을 잘 안 쓴다면 아예 꺼두는 걸 추천합니다. 필요할 때만 그때그때 켜서 쓰는 것도 방법입니다.' },
    ],
    tags: ['오버레이', '디스코드', 'Xbox Game Bar'],
    date: '2026-08-11',
  },
];
