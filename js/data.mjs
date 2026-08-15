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
