# Cellforge 정적 웹사이트 구축 및 GitHub Pages 배포 계획

## 1. 프로젝트 개요

| 항목 | 내용 |
| :--- | :--- |
| **프로젝트명** | Cellforge 공식 기업 소개 웹사이트 |
| **대상 도메인** | `www.cellforge.kr` (`cellforge.kr` 루트 도메인 자동 리다이렉트) |
| **원격 저장소** | `https://github.com/infocellforge-boop/www.cellforge.kr.git` |
| **호스팅 환경** | GitHub Pages (`main` 브랜치 `/` 루트 직접 서빙, `.nojekyll` 적용) |
| **연출 방향** | 애플(Apple) 스타일의 스크롤 기반 인터랙티브 스토리텔링 |

---

## 2. 기술 스택 및 배포 아키텍처 *(확정)*

### 2.1 프론트엔드 기술 스택 (유지보수 최적화 구성)
- **코어 마크업/스타일**: **No-Build 순수 HTML5 + 모듈형 CSS3 (CSS Variables / Grid / Flexbox)**
  - 별도의 Node.js 빌드 도구나 번들러 의존성 없이 파일을 수정하여 Push하면 즉시 반영되는 구조
- **스크롤 애니메이션 엔진**: **GSAP + ScrollTrigger (CDN 로드)**
  - 애플 스타일의 핵심인 **섹션 화면 고정(`pin: true`)** 및 **스크롤 진행률 비례 재생(`scrub`)** 구현
  - 데스크톱 및 모바일 Safari(주소창 리사이즈 등) 크로스 브라우징 이슈 자동 대응
- **보조 인터랙션**: **IntersectionObserver API + CSS Transition**
  - 일반 섹션의 경량 페이드인(`fade-up`), 숫자 카운트업 등 처리

### 2.2 유지보수 중심 설계 원칙
1. **Sticky DOM + 레이어 트랜스폼 기반 연출**:
   - 무거운 `<canvas>` 연번 이미지 시퀀스 대신, 고정(`sticky`)된 배경 비주얼 위에 **실제 HTML 타이포그래피와 그래픽 레이어의 스케일(`scale`), 투명도(`opacity`), 패럴랙스 위치(`translate3d`)**를 스크롤에 연동하여 SEO와 텍스트 수정 편의성 확보
2. **콘텐츠(HTML)와 애니메이션 로직(JS)의 완전 분리**:
   - JS(`js/animations.js`)는 특정 문구에 의존하지 않고 공통 데이터 속성(`data-scroll-pin`, `data-animate="fade-up"`, `data-parallax` 등)만 제어하도록 설계
   - 추후 문구·수치·연혁 수정 시 JS 수정 없이 `index.html` 텍스트만 변경하면 즉시 반영

### 2.3 디렉토리 구조 (예정)
```text
.
├── CNAME                  # 커스텀 도메인 설정 (www.cellforge.kr)
├── .nojekyll              # GitHub Pages Jekyll 변환 비활성화
├── index.html             # 메인 엔트리 페이지 (기업 소개 전체 섹션)
├── assets/
│   ├── css/
│   │   └── style.css      # 디자인 시스템 변수, 레이아웃, 반응형 스타일
│   ├── js/
│   │   └── animations.js  # GSAP ScrollTrigger 및 스크롤 인터랙션 로직
│   └── images/            # 로고, 아이콘, 고해상도 비주얼/그래픽 에셋
├── docs/
│   └── PLAN.md            # 프로젝트 구축 및 배포 계획서
└── README.md              # 저장소 안내 문서
```

---

## 3. 웹사이트 섹션 구성안 *(세부 카피 및 콘텐츠 추후 정리)*

- [ ] **헤더 / 내비게이션 (GNB)**: 반투명 블러(`backdrop-filter`) 상단 고정 바, 로고 및 섹션 앵커 이동
- [ ] **히어로 섹션 (Hero)**: 대형 타이포그래피 인트로 + 스크롤 시 확대/전환되는 핵심 비주얼
- [ ] **기업 소개 (About / Vision)**: 스크롤 고정(`pin`) 상태에서 핵심 슬로건과 비전 문구가 순차 하이라이트되는 연출
- [ ] **핵심 기술 / 사업 영역 (Core Technology & Solutions)**: 스크롤에 따라 전환되는 카드 또는 스티키 스플릿(좌측 고정 비주얼 + 우측 스크롤 설명) 레이아웃
- [ ] **주요 지표 / 경쟁력 (Key Metrics & Impact)**: 스크롤 진입 시 강조되는 대형 수치 및 핵심 역량
- [ ] **문의 / 푸터 (Contact & Footer)**: 대표 이메일(`info.cellforge@gmail.com`), 기업 기본 정보, 저작권 표시

---

## 4. 단계별 작업 계획 (Roadmap)

### Phase 1. 저장소 초기화 및 배포 기반 구축
- [x] 로컬 Git 저장소 초기화(`main`) 및 전용 계정/SSH 분리 설정
- [x] 원격 저장소(`origin`) 연결 완료
- [x] 초기 `index.html`, `README.md`, `CNAME`, `.nojekyll` 구성 및 `main` 브랜치 첫 Push 완료
- [ ] GitHub 저장소 Settings → Pages 활성화 확인

### Phase 2. 커스텀 도메인(`www.cellforge.kr`) 연결
- [x] 저장소 내 `CNAME` 파일 배포 (`www.cellforge.kr`)
- [ ] 도메인 등록업체 DNS 레코드 설정 (`www` CNAME 레코드 1개 + `@` A 레코드 4개)
- [ ] GitHub Pages Custom domain 검증 및 **Enforce HTTPS** 활성화

### Phase 3. 상세 기획 및 디자인 리소스 정의 *(추후 진행)*
- [ ] 섹션별 상세 카피라이팅 및 스토리보드(스크롤 연출 흐름) 확정
- [ ] 브랜드 컬러 팔레트, 타이포그래피, 로고/파비콘 및 비주얼 에셋 준비

### Phase 4. 프론트엔드 퍼블리싱 및 스크롤 애니메이션 구현
- [ ] `assets/css/style.css` 디자인 토큰 및 반응형 레이아웃 구축
- [ ] 섹션별 시맨틱 HTML 마크업 작성
- [ ] `assets/js/animations.js` GSAP `ScrollTrigger` 기반 애플 스타일 스크롤 효과 구현
- [ ] 모바일/태블릿 뷰포트 스크롤 감도 및 반응형 최적화

### Phase 5. SEO 최적화 및 최종 오픈
- [ ] 메타태그(`title`, `description`, Open Graph `og:*`) 및 파비콘 적용
- [ ] `robots.txt`, `sitemap.xml`, `404.html` 구성
- [ ] 크로스 브라우징 및 Lighthouse 성능·접근성 점검 후 최종 배포

---

## 5. 추후 정리할 세부 사항 (TBD)

1. **콘텐츠 및 카피라이팅**: 각 섹션에 들어갈 실제 기업 소개 문구, 기술 키워드, 수치 데이터
2. **비주얼 에셋**: 히어로 및 기술 섹션에 사용할 이미지/그래픽 또는 짧은 배경 루프 영상 유무
3. **다국어 지원 여부**: 한국어 단독 구성 여부 또는 영문(KO/EN) 전환 포함 여부
