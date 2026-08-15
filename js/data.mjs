function escapeXml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
}

function wrapTitle(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  const pushCurrent = () => { if (current) { lines.push(current); current = ''; } };
  for (const word of words) {
    if (word.length > maxCharsPerLine) {
      pushCurrent();
      for (let i = 0; i < word.length; i += maxCharsPerLine) {
        lines.push(word.slice(i, i + maxCharsPerLine));
      }
      continue;
    }
    const candidate = current ? current + ' ' + word : word;
    if (candidate.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  pushCurrent();
  return lines;
}

function placeholderThumb(index, title) {
  const palette = ['#DBEAFE', '#DCFCE7', '#FEF3C7', '#FCE7F3', '#E0E7FF', '#FFE4E6', '#E0F2FE'];
  const color = palette[index % palette.length];
  const fontSize = 26;
  const lineHeight = 32;
  const lines = wrapTitle(title, 11).slice(0, 4);
  const startY = 120 - ((lines.length - 1) * lineHeight) / 2 + 8;
  const textEls = lines.map((line, i) =>
    `<text x="200" y="${startY + i * lineHeight}" font-family="Inter,sans-serif" font-size="${fontSize}" font-weight="800" fill="#1B64DA" text-anchor="middle">${escapeXml(line)}</text>`
  ).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240">` +
    `<rect width="400" height="240" fill="${color}"/>` +
    textEls +
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
  { id: 'misc-tips', name: '소소한 팁/정보', icon: 'bolt' },
];

export const tips = [
  {
    id: 'gamer-tips-1',
    category: 'gamer-tips',
    title: '게임 시작 전 PC 설정 총집합',
    summary: '게임을 켜기 전에 딱 한 번만 점검해두면 계속 도움이 되는 드라이버·윈도우 설정 체크리스트.',
    thumbnail: placeholderThumb(0, '게임 시작 전 PC 설정 총집합'),
    body: [
      { type: 'paragraph', text: '게임을 시작하기 전에 딱 한 번만 점검해두면 계속 도움이 되는 설정들을 모았습니다. 무슨 뜻인지 몰라도 괜찮으니, 아래 순서대로 그대로 따라오시면 됩니다.' },
      { type: 'paragraph', text: '① 윈도우 업데이트와 그래픽 드라이버부터 최신으로 맞추세요.' },
      { type: 'steps', items: [
        '키보드에서 윈도우 키를 누르고 "Windows Update"라고 입력한 뒤 엔터',
        '"업데이트 확인" 버튼을 눌러서 대기 중인 업데이트가 있으면 전부 설치',
        '그래픽카드 드라이버는 제조사 사이트에서 받으세요 — NVIDIA는 nvidia.com/drivers, AMD는 amd.com/support, Intel은 intel.com/content/www/kr/ko/support 에서 본인 그래픽카드 모델명을 검색',
      ] },
      { type: 'paragraph', text: '② 메인보드 모델과 바이오스 버전을 확인하세요. 오디오·랜(LAN) 드라이버는 반드시 메인보드 제조사 홈페이지에서 받아야 하고, 바이오스도 너무 오래됐다면 업데이트가 필요할 수 있습니다.' },
      { type: 'steps', items: [
        '윈도우 키를 누르고 "시스템 정보"를 검색해서 실행',
        '왼쪽 "시스템 요약"에서 "베이스보드 제품" 항목을 확인하세요 — 이게 실제 메인보드 모델명입니다 (예: MAG B850M MORTAR WIFI)',
        '같은 화면에서 "BIOS 버전/날짜" 항목도 함께 확인해두세요 — 메인보드 제조사 홈페이지에서 이 날짜보다 최신 바이오스가 있는지 비교하면 업데이트가 필요한지 판단할 수 있습니다',
        '확인한 모델명으로 제조사(ASUS, MSI, 기가바이트 등) 홈페이지에서 오디오·랜 드라이버, 필요하면 바이오스 업데이트 파일을 받으세요',
      ] },
      { type: 'image', src: 'images/tips/gamer1-baseboard.png', caption: '시스템 정보 — 베이스보드 제품(메인보드 모델) 확인 위치' },
      { type: 'image', src: 'images/tips/gamer1-bios.png', caption: '시스템 정보 — BIOS 버전/날짜 확인 위치' },
      { type: 'paragraph', text: '③ 디스플레이 그래픽 설정에서 두 가지를 확인하세요.' },
      { type: 'steps', items: [
        '설정 > 시스템 > 디스플레이 > 그래픽으로 이동',
        '"창 게임에 대해 최적화" 스위치를 확인하세요 — 대부분의 최신 게임에서는 켜두는 게 유리하지만, 오래된 게임에서 화면이 이상하게 나온다면 꺼서 비교해보세요',
        '같은 페이지에서 "고급 그래픽 설정"을 눌러 펼치면 "하드웨어 가속 GPU 일정 예약(HAGS)"이 나옵니다',
      ] },
      { type: 'image', src: 'images/tips/gamer1-windowed-opt.png', caption: '디스플레이 > 그래픽 — "창 게임에 대해 최적화" 스위치 위치' },
      { type: 'paragraph', text: 'HAGS는 그래픽카드 세대에 따라 유불리가 갈립니다. GTX 10 시리즈·RTX 시리즈(NVIDIA), RX 5000·6000 시리즈 이상(AMD)처럼 비교적 최신 그래픽카드는 대기 시간(입력 지연)이 줄어드는 효과를 보는 경우가 많아 켜두는 걸 추천합니다. 반면 이보다 오래됐거나 VRAM이 8GB 이하로 낮은 그래픽카드는 오히려 끊김·텍스처 깨짐이 생기는 경우가 있어 끄는 걸 추천합니다. 프레임(FPS) 자체는 켜고 끄고 큰 차이가 없는 경우가 많으니, 애매하면 최근 게임을 몇 분씩 켜서 두 상태를 직접 비교해보고 더 안정적인 쪽으로 두세요 (설정을 바꾸면 재부팅을 요구할 수 있습니다).' },
      { type: 'image', src: 'images/tips/gamer1-hags.png', caption: '디스플레이 > 그래픽 > 고급 그래픽 설정 — 하드웨어 가속 GPU 일정 예약(HAGS) 스위치 위치' },
      { type: 'paragraph', text: '④ 게임 모드를 켜두세요.' },
      { type: 'steps', items: [
        '설정 > 게임 > 게임 모드로 이동',
        '스위치를 켜짐으로 설정',
      ] },
      { type: 'image', src: 'images/tips/gamer1-gamemode.png', caption: '설정 > 게임 > 게임 모드 화면' },
      { type: 'paragraph', text: '⑤ 전원 관리 모드를 고성능 쪽으로 설정하세요.' },
      { type: 'steps', items: [
        '설정 > 시스템 > 전원으로 이동',
        '"전원 모드"를 "최고의 성능" 또는 "고성능"으로 변경 (노트북은 배터리가 빨리 닳을 수 있으니, 충전기를 연결한 상태에서 게임하는 걸 추천합니다)',
      ] },
      { type: 'image', src: 'images/tips/gamer1-power.png', caption: '설정 > 시스템 > 전원 — 전원 모드 선택 화면' },
      { type: 'paragraph', text: '⑥ 모니터 해상도와 주사율이 제대로 잡혀있는지 확인하세요 — 둘 다 기본값이 실제 스펙보다 낮게(해상도가 낮거나 60Hz) 잡혀있는 경우가 은근히 많습니다.' },
      { type: 'steps', items: [
        '설정 > 시스템 > 디스플레이 > 고급 디스플레이로 이동',
        '"디스플레이 정보"의 데스크톱 모드 해상도가 모니터 실제 최대 해상도(예: 2560×1440)와 같은지 확인하고, 낮게 되어 있다면 최대치로 변경 — 낮으면 화면이 흐릿하게 보입니다',
        '"새로고침 빈도 선택"이 모니터 최대 주사율(144Hz, 165Hz, 180Hz 등)로 되어 있는지 확인하고, 60Hz로 되어 있다면 실제 스펙에 맞게 변경',
      ] },
      { type: 'image', src: 'images/tips/gamer1-display.png', caption: '고급 디스플레이 — 해상도·새로고침 빈도 확인 화면' },
    ],
    tags: ['게임설정', '드라이버', 'HAGS'],
    date: '2026-08-16',
  },
  {
    id: 'gamer-tips-2',
    category: 'gamer-tips',
    title: '프레임드랍 원인 자가진단법',
    summary: '전문 지식 없이 무료 프로그램만으로 내 PC에 어떤 문제가 있는지 스스로 좁혀보는 방법.',
    thumbnail: placeholderThumb(1, '프레임드랍 원인 자가진단법'),
    body: [
      { type: 'paragraph', text: '"PC에 문제가 있는 것 같긴 한데 정확히 뭐가 문제인지는 모르겠고, 별거 아닐 수도 있는데 대뜸 수리점부터 가기엔 부담스럽다" — 이런 분들을 위한 자가진단법입니다. 특별한 지식 없이 간단한 무료 프로그램만 따라서 켜보면 됩니다. 다만 변수는 늘 존재하고, 특히 소프트웨어가 아니라 하드웨어 자체의 문제라면 결국 전문가에게 맡기는 게 나을 수 있다는 점은 미리 알아두세요.' },
      { type: 'paragraph', text: '① 평소 하시는 게임을 켠 상태에서 리소스 사용률부터 확인하세요.' },
      { type: 'steps', items: [
        'Ctrl+Shift+Esc로 작업 관리자를 열고 "성능" 탭에서 확인',
        '스팀 게임이라면 스팀 창 좌측 상단 "Steam" 클릭 → 설정 → 게임 관련 → 오버레이 성능 모니터 항목에서 "성능 세부 정보 수준"을 바꾸면 게임 화면 위에 바로 표시할 수도 있습니다',
      ] },
      { type: 'image', src: 'images/tips/gamer2-taskmgr-perf.png', caption: '작업 관리자 > 성능 탭 화면' },
      { type: 'image', src: 'images/tips/gamer2-steam-overlay.png', caption: '스팀 설정 > 게임 관련 > 오버레이 성능 모니터' },
      { type: 'paragraph', text: '아래 중 사용률이 유난히 과한 부분이 있는지 확인하세요 — CPU 사용률이 100%를 찍는다, CPU 클럭이 비정상적으로 뚝뚝 떨어진다, RAM이 거의 100% 사용 중이다, 그래픽카드(GPU) 로드율이 계속 100%에서 안 내려온다. 참고로 인터넷이 불안정해서 끊기는 것도 프레임드랍처럼 느껴질 수 있으니, 가능하면 유선 연결 상태에서 확인하거나 핑(지연시간)도 함께 체크해보세요.' },
      { type: 'paragraph', text: '리소스를 체크하는 김에 하나 더 — 디스코드 인게임 오버레이나 Xbox Game Bar 같은 백그라운드 오버레이가 켜져 있으면, 특히 사양이 낮은 PC에서는 그 자체로 프레임드랍의 원인이 될 수 있습니다. 평소에 잘 안 쓰신다면 꺼두는 것도 확인해보세요.' },
      { type: 'steps', items: [
        '디스코드: 좌측 하단 톱니바퀴(사용자 설정) → "게임 오버레이" → "활성화" 스위치를 꺼짐으로 변경',
        'Xbox Game Bar: 윈도우 키 → "설정" 실행 → "게임" → "Xbox Game Bar" → "Xbox Game Bar를 사용하여 게임 클립, 스크린샷 및 방송 녹화" 스위치를 꺼짐으로 변경',
      ] },
      { type: 'paragraph', text: '② 과부하가 걸리는 부품(CPU, GPU 등)의 사양 자체가 지금 하시는 게임·프로그램의 권장 사양보다 너무 부족하지는 않은지부터 확인하세요. 권장 사양보다 한참 낮다면, 아래 방법들은 참고만 하시고 근본적으로는 부품 업그레이드가 필요할 수 있습니다.' },
      { type: 'paragraph', text: '③ CPU 문제가 의심된다면 온도를 확인하세요.' },
      { type: 'steps', items: [
        'HWMonitor(cpuid.com/softwares/hwmonitor.html에서 무료 다운로드)를 설치하고, 게임을 하거나 무거운 프로그램을 쓰는 동안 CPU 온도를 확인',
        '보통 80도 후반~90도를 넘어간다면 CPU 쪽 문제일 가능성이 있습니다',
        '써멀구리스를 재도포하거나, 최근에 조립했거나 직접 조립하신 경우라면 CPU 쿨러가 제대로 밀착되지 않았을 가능성도 확인해보세요',
      ] },
      { type: 'image', src: 'images/tips/gamer2-cpu-temp.png', caption: 'CPU 온도 모니터링 화면' },
      { type: 'paragraph', text: '④ GPU 문제가 의심된다면 마찬가지로 온도부터 확인하세요.' },
      { type: 'steps', items: [
        'HWMonitor로 그래픽카드 온도 확인',
        '온도가 너무 높다면 그래픽카드 자체의 써멀 재도포가 필요할 수 있지만, 개인이 직접 하기는 어려우니 AS를 받는 걸 추천합니다',
        '온도는 정상인데 GPU가 의심된다면 그래픽 드라이버를 업데이트해보세요 — 특히 최근에 출시된 그래픽카드일수록 드라이버 업데이트로 해결되는 경우가 많습니다',
      ] },
      { type: 'paragraph', text: '다만 번거로운 조치를 하기 전에, 그래픽카드를 한번 탈거했다가 다시 꽂아보는 것도 꼭 해보세요 — 단순 접촉 불량인 경우도 은근히 많습니다.' },
      { type: 'image', src: 'images/tips/gamer2-gpu-temp.png', caption: 'GPU 온도 모니터링 화면' },
      { type: 'paragraph', text: '⑤ RAM(메모리) 문제가 의심된다면 실제로 맞춘 사양대로 인식되고 있는지 확인하세요.' },
      { type: 'steps', items: [
        '작업 관리자 > 성능 > 메모리에서 용량이 실제 구매한 만큼 나오는지 확인',
        '4슬롯 메인보드라면 "사용된 슬롯"이 꽂은 개수만큼(예: 2/4) 나오는지 확인',
        'XMP·EXPO 튜닝 메모리를 쓰신다면 "속도"도 원래 스펙대로 나오는지 함께 확인',
      ] },
      { type: 'paragraph', text: '평소 블랙스크린으로 갑자기 꺼지는 증상이 자주 있었다면, 메모리 불량일 가능성도 의심해볼 만합니다.' },
      { type: 'image', src: 'images/tips/gamer2-ram-check.png', caption: '작업 관리자 > 메모리 — 슬롯/속도 확인 화면' },
      { type: 'paragraph', text: '⑥ 특정 부품이 아니라 전체적으로 온도가 다 높게 나온다면, 시스템 크기에 비해 케이스가 너무 작거나, 케이스 팬이 불량이거나 제대로 연결이 안 됐을 가능성도 확인해보면 좋습니다.' },
      { type: 'paragraph', text: '⑦ 여기까지 해봐도 원인을 못 찾겠다면, 수리점에 한번 들러보는 것도 추천합니다. 특히 파워서플라이나 메인보드 문제는 전문 지식이 없으면 직접 확인할 방법이 마땅치 않은 경우가 많습니다.' },
    ],
    tags: ['프레임드랍', '자가진단', 'CPU온도', 'GPU온도', '오버레이'],
    date: '2026-08-13',
  },
  {
    id: 'gamer-tips-3',
    category: 'gamer-tips',
    title: '가격이 미쳐버린 램, 용량 부족 응급처치',
    summary: '당장 램을 못 사는 상황에서 소프트웨어적으로 메모리를 짜내는 방법들.',
    thumbnail: placeholderThumb(2, '가격이 미쳐버린 램, 용량 부족 응급처치'),
    body: [
      { type: 'paragraph', text: '램 가격이 너무 올라서 당장 추가 구매가 부담스럽다면, 먼저 소프트웨어적으로 짜낼 수 있는 만큼 짜내보세요.' },
      { type: 'paragraph', text: '① 크롬의 메모리 절약 기능을 켜세요.' },
      { type: 'steps', items: [
        '크롬 우측 상단 점 3개(⋮) 클릭 → 설정',
        '왼쪽 메뉴에서 "성능" 클릭',
        '"메모리 절약" 스위치를 켜짐으로 변경',
      ] },
      { type: 'image', src: 'images/tips/gamer3-chrome-memorysaver.png', caption: '크롬 설정 > 성능 — 메모리 절약 스위치' },
      { type: 'paragraph', text: '활성화하면 비활성 탭(지금 안 보고 있는 탭)에서 크롬이 메모리를 확보해서, 활성 탭과 다른 프로그램에 더 많은 리소스를 남겨줍니다. 비활성 탭으로 돌아가면 자동으로 다시 활성화되니 사용에 불편은 거의 없습니다.' },
      { type: 'paragraph', text: '② 작업 관리자의 "시작 앱"을 정리하세요 — PC를 켜자마자 같이 실행되는 프로그램을 줄여서, 평소에 백그라운드가 차지하는 램을 최대한 비워두는 방법입니다.' },
      { type: 'steps', items: [
        'Ctrl+Shift+Esc를 눌러 작업 관리자 열기',
        '왼쪽 메뉴에서 "시작 앱" 클릭',
        '평소 PC를 켜자마자 자동으로 실행될 필요가 없는 프로그램을 선택하고 우클릭 → "사용 안 함" — 그때그때 필요할 때만 직접 켜서 쓰면 됩니다',
      ] },
      { type: 'image', src: 'images/tips/gamer3-startup-apps.png', caption: '작업 관리자 > 시작 앱 화면' },
      { type: 'paragraph', text: '특히 게임을 하는데 램이 부족하다면, 크롬이나 다른 게임처럼 램을 많이 쓰는 프로그램은 반드시 끄고 게임하는 걸 추천합니다.' },
      { type: 'paragraph', text: '③ 저장장치를 가상 메모리로 활용하는 방법도 있지만, 아무 상황에서나 추천하지는 않습니다.' },
      { type: 'paragraph', text: '저장장치가 1개뿐이거나 SSD가 아니라면(HDD라면) 이 방법은 추천하지 않습니다. 최적화가 잘 안 된 게임을 하신다면 메모리 누수로 오히려 문제가 커질 위험도 있어서 역시 비추천입니다.' },
      { type: 'paragraph', text: '반대로 SSD가 2개 이상이고, 그중 게임·윈도우가 설치되지 않은 SSD가 따로 있다면 얘기가 다릅니다 — 이 경우엔 그 SSD를 가상 메모리 전용으로 쓰는 걸 추천합니다.' },
      { type: 'steps', items: [
        '윈도우 키 → "고급 시스템 설정" 검색 → 실행',
        '"고급" 탭 → "성능" 항목의 "설정" 버튼 클릭',
        '다시 "고급" 탭 → "가상 메모리" 항목의 "변경" 버튼 클릭',
        '"모든 드라이브에 대해 페이징 파일 크기 자동 관리"를 체크 해제하고, 게임·윈도우가 설치되지 않은 SSD 드라이브를 선택',
        '어지간한 경우에는 "시스템이 관리하는 크기"를 선택하는 걸 추천합니다 — 용량을 직접 계산하지 않아도 윈도우가 알아서 적절한 크기로 잡아줍니다. 직접 정하고 싶다면 "사용자 지정 크기"를 선택할 수도 있습니다',
        '선택한 뒤 "설정" → "확인"',
      ] },
      { type: 'image', src: placeholderImage('가상 메모리(페이지 파일) 설정 창'), caption: '가상 메모리(페이지 파일) 설정 창' },
      { type: 'paragraph', text: '위 조건에 해당하지 않거나, 여기까지도 너무 복잡하게 느껴지신다면… 그냥 마음의 준비를 하고 램을 사는 게 가장 확실합니다.' },
    ],
    tags: ['램부족', '메모리최적화', '가상메모리'],
    date: '2026-08-12',
  },
  {
    id: 'gamer-tips-4',
    category: 'gamer-tips',
    title: '인터넷 느릴 때 DNS 바꾸는 법',
    summary: '브라우저만이 아니라 PC 전체가 느리다면 네트워크 어댑터에서 DNS를 직접 바꿔보세요. 1분이면 됩니다.',
    thumbnail: placeholderThumb(3, '인터넷 느릴 때 DNS 바꾸는 법'),
    body: [
      { type: 'paragraph', text: '인터넷이 유난히 느리거나 사이트 로딩이 오래 걸린다면 DNS 서버 문제일 수 있습니다. 아래 방법은 특정 브라우저가 아니라 PC 전체 인터넷 연결에 적용됩니다.' },
      { type: 'steps', items: [
        '작업 표시줄 왼쪽 윈도우 검색창에 "네트워크 연결 보기"를 검색해서 실행',
        '사용 중인 네트워크(이더넷 또는 Wi-Fi)를 선택하고 마우스 오른쪽 클릭 → "속성" 클릭',
        '목록에서 "인터넷 프로토콜 버전 4(TCP/IPv4)"를 더블클릭',
        '"다음 DNS 서버 주소 사용"을 클릭',
        '기본 설정 DNS 서버에 8.8.8.8, 보조 DNS 서버에 1.1.1.1을 입력하고 "확인" 클릭',
      ] },
      { type: 'image', src: 'images/tips/gamer4-dns.png', caption: '네트워크 연결 — 이더넷 속성 > TCP/IPv4 속성 창' },
      { type: 'paragraph', text: '8.8.8.8은 구글(Google) DNS, 1.1.1.1은 클라우드플레어(Cloudflare) DNS입니다. 둘 다 무료로 제공되는 안정적인 공용 DNS라 통신사 기본 DNS보다 응답 속도가 빠른 경우가 많아서, 별다른 설정 없이 체감 속도가 개선되는 경우가 많습니다.' },
      { type: 'paragraph', text: '보조 DNS 서버는 꼭 1.1.1.1이 아니어도 됩니다 — 구글의 보조 DNS인 8.8.4.4로 입력해도 상관없습니다.' },
    ],
    tags: ['DNS', '인터넷속도', '네트워크'],
    date: '2026-08-11',
  },
  {
    id: 'gamer-tips-5',
    category: 'gamer-tips',
    title: '오디오 고급기능(Enhancements)이 안 보일 때',
    summary: '사운드 설정에 "향상 기능" 탭 자체가 없을 때, 스크립트로 라우드니스 이퀄라이제이션을 직접 켜는 방법.',
    thumbnail: placeholderThumb(4, '오디오 고급기능(Enhancements)이 안 보일 때'),
    body: [
      { type: 'paragraph', text: '오디오 설정에서 "향상 기능(Enhancements)" 또는 "음향 효과" 탭이 아예 안 보이는 경우가 있습니다. 이럴 땐 오픈소스 스크립트로 라우드니스 이퀄라이제이션 기능을 직접 활성화할 수 있습니다. 명령어가 낯설어 보여도 그대로 복사·붙여넣기만 하면 되니 순서대로 따라오세요.' },
      { type: 'image', src: 'images/tips/gamer5-powershell-admin.png', caption: '관리자 권한으로 실행된 PowerShell 창 — 이 화면이 뜨면 제대로 실행된 것입니다' },
      { type: 'steps', items: [
        '윈도우 하단 검색(돋보기) 버튼을 누르고 "Windows PowerShell" 입력',
        '검색 결과에서 마우스 우클릭 → "관리자 권한으로 실행" 클릭',
      ] },
      { type: 'paragraph', text: '아래 3줄을 통째로 드래그해서 복사한 뒤, PowerShell 창에 붙여넣고 엔터를 누르세요 (클릭 한 번으로 전체 선택됩니다).' },
      { type: 'code', text: 'Invoke-WebRequest https://raw.githubusercontent.com/Falcosc/enable-loudness-equalisation/main/EnableLoudness.ps1 -OutFile $env:HOMEPATH\\EnableLoudness.ps1\n\nSet-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser\n\n. $env:HOMEPATH\\EnableLoudness.ps1' },
      { type: 'steps', items: [
        '실행 권한을 부여할지 물어보면 y 입력 후 엔터',
        '이어서 사운드 장치 이름을 입력하라고 나오면, 본인이 쓰는 출력 장치 이름을 정확히 입력 후 엔터 (예: "Realtek USB2.0 Audio")',
      ] },
      { type: 'paragraph', text: '장치 이름은 설정 > 시스템 > 소리에서 현재 사용 중인 출력 장치 이름을 그대로 복사해서 쓰면 정확합니다.' },
    ],
    tags: ['오디오', 'Enhancements', 'PowerShell'],
    date: '2026-08-10',
  },
  {
    id: 'misc-tips-1',
    category: 'misc-tips',
    title: '백신 프로그램, 굳이 따로 안 깔아도 되는 이유',
    summary: '윈도우에 기본 내장된 Microsoft Defender만으로 충분한 이유와, 오히려 다른 백신이 불편할 수 있는 이유.',
    thumbnail: placeholderThumb(5, '백신 프로그램, 굳이 따로 안 깔아도 되는 이유'),
    body: [
      { type: 'paragraph', text: 'PC를 사면 "백신 프로그램부터 따로 깔아야 하나?" 고민하시는 분들이 많은데, 결론부터 말하면 대부분의 경우 윈도우에 기본 내장된 "Microsoft Defender(윈도우 디펜더)"만으로 충분합니다.' },
      { type: 'paragraph', text: '보안 프로그램을 전문적으로 평가하는 AV-TEST 기관 테스트에서 윈도우 디펜더는 보호·성능·사용성 세 항목 모두 6점 만점에 가까운 점수를 꾸준히 받고 있고, AV-Comparatives 테스트에서도 악성코드 탐지율 99% 이상으로 유료 백신 프로그램들과 대등한 수준입니다. 상위권 백신들끼리의 차이는 이제 "탐지율"보다 "오탐(정상 파일을 바이러스로 착각하는 것)"이나 "시스템 부담" 쪽에서 갈리는 수준입니다.' },
      { type: 'paragraph', text: '오히려 별도 백신 프로그램을 설치하면 실행할 때마다 유료 결제를 유도하는 팝업, 다른 제품 광고, 브라우저 확장 프로그램 설치 권유 같은 게 계속 뜨는 경우가 많아서, 보안이 강화되는 효과보다 불편함이 더 큰 경우도 흔합니다.' },
      { type: 'paragraph', text: '다만 한 가지는 챙겨두면 좋습니다 — 디펜더는 랜섬웨어(파일을 암호화해서 몸값을 요구하는 악성코드) 방어에는 상대적으로 약하다는 평가도 있어서, 디펜더 안에 있는 "제어된 폴더 접근" 기능을 켜두는 걸 추천합니다.' },
      { type: 'steps', items: [
        '윈도우 키를 누르고 "Windows 보안"을 검색해서 실행',
        '"바이러스 및 위협 방지" 클릭',
        '"랜섬웨어 방지" 아래 "랜섬웨어 방지 관리" 클릭',
        '"제어된 폴더 접근"을 켜짐으로 변경',
      ] },
      { type: 'paragraph', text: '디펜더가 정상적으로 켜져 있는지 확인하는 법도 간단합니다.' },
      { type: 'steps', items: [
        '윈도우 키를 누르고 "Windows 보안"을 검색해서 실행',
        '"바이러스 및 위협 방지" 클릭',
        '"바이러스 및 위협 방지 설정" 아래에서 "실시간 보호"가 켜짐으로 되어 있는지 확인',
      ] },
    ],
    tags: ['보안', '윈도우디펜더', '백신'],
    date: '2026-08-15',
  },
  {
    id: 'misc-tips-2',
    category: 'misc-tips',
    title: '와이파이·인터넷 느릴 때 공유기 체크리스트',
    summary: '속도가 이상하게 느리다면 PC보다 공유기(라우터) 문제인 경우도 많습니다. 순서대로만 확인해보세요.',
    thumbnail: placeholderThumb(6, '와이파이·인터넷 느릴 때 공유기 체크리스트'),
    body: [
      { type: 'paragraph', text: '인터넷이 유난히 느리거나 자주 끊긴다면, PC보다 공유기(라우터) 쪽 문제인 경우도 많습니다. 아래 순서대로 하나씩 확인해보세요.' },
      { type: 'paragraph', text: '① 가장 먼저, 공유기를 재부팅하세요.' },
      { type: 'steps', items: [
        '공유기 전원을 완전히 뽑고 10~30초 정도 기다렸다가 다시 꽂기 (전원 버튼이 있다면 버튼으로 꺼도 됩니다)',
        '공유기 표시등이 정상 상태(보통 초록색 고정)로 돌아올 때까지 1~2분 기다리기',
      ] },
      { type: 'paragraph', text: '② 유선(랜선)과 무선(와이파이) 속도를 비교해보세요.' },
      { type: 'steps', items: [
        '가능하다면 PC를 랜선으로 공유기에 직접 연결해서 속도 확인',
        '유선은 빠른데 와이파이만 느리다면, 와이파이 신호 자체의 문제일 가능성이 높습니다',
      ] },
      { type: 'paragraph', text: '③ 공유기와 거리가 너무 멀거나 벽이 많다면 신호가 약해질 수 있습니다. 공유기와 최대한 가까운 곳에서도 느린지 비교해보세요.' },
      { type: 'paragraph', text: '④ 와이파이 채널이 겹쳐서 느려지는 경우도 있습니다 — 특히 아파트처럼 이웃집 와이파이 신호가 많은 환경에서 흔합니다.' },
      { type: 'steps', items: [
        '공유기 관리 페이지에 접속 (보통 브라우저 주소창에 192.168.0.1 또는 192.168.1.1 입력, 공유기 뒷면 스티커에 정확한 주소와 관리자 비밀번호가 적혀있는 경우가 많습니다)',
        '무선 설정에서 채널을 "자동"으로 바꾸거나, 다른 채널로 수동 변경해보고 비교',
      ] },
      { type: 'paragraph', text: '⑤ 같이 쓰는 회선이라면, 다른 기기(스마트폰, 다른 PC 등)가 백그라운드에서 대용량 다운로드나 스트리밍을 하고 있지 않은지도 확인해보세요.' },
      { type: 'paragraph', text: '여기까지 해도 안 된다면, 공유기 자체가 오래됐거나 고장났을 가능성, 혹은 가입한 인터넷 요금제 속도 자체가 낮을 가능성도 있습니다 — 이런 경우엔 가입한 통신사에 문의해보는 게 가장 정확합니다.' },
    ],
    tags: ['와이파이', '인터넷속도', '공유기'],
    date: '2026-08-14',
  },
];
