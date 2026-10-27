# Cellforge 정적 웹사이트 구축 및 GitHub Pages 배포 계획

## 1. 프로젝트 개요

| 항목 | 내용 |
| :--- | :--- |
| **프로젝트명** | Cellforge 공식 기업 및 브랜드(`ADERIS®`) 소개 웹사이트 |
| **대상 도메인** | `www.cellforge.kr` (`cellforge.kr` 루트 도메인 자동 리다이렉트) |
| **원격 저장소** | `https://github.com/infocellforge-boop/www.cellforge.kr.git` |
| **호스팅 환경** | GitHub Pages (`main` 브랜치 `/` 루트 직접 서빙, `.nojekyll` 적용) |
| **연출 방향** | 애플(Apple) 스타일의 스크롤 동기화(`Pin & Scrub`) 스토리텔링 |

---

## 2. 기술 스택 및 배포 아키텍처 *(확정)*

### 2.1 프론트엔드 기술 스택 (유지보수 최적화 구성)
- **코어 마크업/스타일**: **No-Build 순수 HTML5 + 모듈형 CSS3 (CSS Variables / Grid / Flexbox)**
  - 별도의 Node.js 빌드 도구나 번들러 의존성 없이 파일을 수정하여 Push하면 즉시 반영되는 구조
  - 브랜치 전략: `development` 브랜치에서 기능/스타일 작업 후 `main` 브랜치로 병합(Merge)하여 프로덕션 배포
- **타이포그래피 (애플 하이브리드 폰트 스택)**:
  - **Apple 기기 (macOS / iOS)**: 시스템 내장 `SF Pro Display`, `SF Pro Text`, `Apple SD Gothic Neo` 우선 렌더링
  - **Windows / Android 기기**: `Inter` (영문/숫자) + `Pretendard Variable` (국문 다이나믹 서브셋 CDN) 폴백 적용
  - **디테일 설정**: 타이트한 자간(`-0.02em ~ -0.035em`), 안티앨리어싱(`-webkit-font-smoothing: antialiased`), 한글 단어 단위 줄바꿈(`word-break: keep-all`) 적용 완료 (`assets/css/style.css`)
- **레이아웃 및 반응형 브레이크포인트 규격**:
  - **컨텐츠 최대 너비 (`max-width`)**: `1280px` (PC 대화면에서 `1280px` 이상 늘어나지 않도록 중앙 고정)
  - **컨텐츠 최소 너비 (`min-width`)**: `320px` (`320px` 이하 뷰포트에서도 레이아웃이 더 이상 찌그러지지 않도록 하한 고정)
  - **반응형 브레이크포인트**:
    - Desktop: `1025px` 이상 (최대 `1280px` 컨테이너, 좌우 여백 `40px`)
    - Tablet: `1024px` 이하 (좌우 여백 `32px`)
    - Mobile: `768px` 이하 (좌우 여백 `24px`, 단일 컬럼 전환)
    - Small Mobile: `480px` 이하 ~ 최소 `320px` (좌우 여백 `20px`)
- **스크롤 애니메이션 엔진**: **GSAP 3 + ScrollTrigger (CDN 로드)**
  - 섹션 화면 고정(`pin: true`) 및 스크롤 진행률 비례 재생(`scrub: 0.6`) 동기화

---

## 3. 마스터 스크롤 시나리오 및 섹션 설계 *(확정)*

### Stage 1. 인트로 포털 시퀀스 (`Pin & Scrub` 화면 고정 스크롤)
1. **랜딩 시작 지점 (`Scroll 0%`)**:
   - 블랙 배경 중앙에 **`Cellforge`** 사명이 선명하게 위치한 상태로 시작
2. **`o` 문자 포털 통과 (`Scroll 0% → 45%`)**:
   - 사용자가 스크롤을 내리면 `Cellforge`의 **`o` 글자 정중앙 홀(Hole)**을 `transform-origin` 기준점으로 삼아 사명이 기하급수적으로 확대(`scale: 1 → 85`)되며 화면이 **`o` 문자 사이를 통과**하는 연출
3. **슬로건 점진 확대 (`Scroll 35% → 85%`)**:
   - `o` 문자를 통과하는 순간 안쪽 깊은 곳에서 **`Forging a Brighter Tomorrow`** 문장이 처음에는 보이지 않다가(`opacity: 0, scale: 0.15`) 스크롤에 반응하여 서서히 나타나며 **화면의 50% 크기(`50vw`)까지 커진 뒤 고정**
4. **하단 섹션으로 자연 스크롤 전환 (`Scroll 85% → 100%`)**:
   - 슬로건이 화면 50% 크기에 도달한 후 잠시 유지되다가 고정(`pin`)이 풀리며 아래 브랜드 제품 쇼케이스로 스크롤이 이어짐

### Stage 2. 플래그십 브랜드 쇼케이스 (`ADERIS®` 메인 컷)
- **사용 에셋**: **Cut 1 (`aderis-main.jpg`)**
- **연출**:
  - 스크롤 진입과 함께 **`ADERIS® — Regenerative Aesthetic Matrix`** 플래그십 패키지 & 바이알 비주얼이 스케일업 등장
  - `ADIPOSE-DERIVED EXTRACELLULAR MATRIX INJECTABLE (20 mg)` 및 핵심 가치 키워드 **`REGENERATE · INTEGRATE · RESTORE · NATURALLY`**가 스크롤에 동기화되어 순차 점등(`Scroll Text Lit-up`)

### Stage 3. 제품 라인업 3종 순차 쇼케이스 (`Sticky Split / Sequential Reveal`)
- **사용 에셋**:
  - **Cut 2 (`aderis-ha.jpg`)**: `ADERIS® HA` (`Adipose-Derived ECM + Hyaluronic Acid`, Slate Blue 테마)
  - **Cut 3 (`aderis-pn.jpg`)**: `ADERIS® PN` (`Adipose-Derived ECM + Polynucleotide`, Sage Green 테마)
  - **Cut 4 (`aderis-pn-ha.jpg`)**: `ADERIS® PN-HA` (`Adipose-Derived ECM + PN + Hyaluronic Acid`, Lavender 테마)
- **연출**:
  - 스크롤을 내릴 때마다 좌측 고정 프리뷰(또는 순차 스테이지)에서 **Original → HA → PN → PN-HA** 각 라인업 이미지와 고유 테마 컬러 글로우가 스크롤 위치에 동기화되어 순차 전환

### Stage 4. 패키지 & 크래프트맨십 디테일 5종 쇼케이스
- **사용 에셋 (하단 캡션을 제거하고 순수 비주얼만 추출 후 HTML 타이포그래피 결합)**:
  - **Cut 5 (`detail-cap.jpg`)**: **프리미엄 캡 디자인** — 브랜드 아이덴티티 각인
  - **Cut 6 (`detail-finish.jpg`)**: **고급 후가공** — 엠보싱 + 부분 유광
  - **Cut 7 (`detail-side.jpg`)**: **측면 디테일** — 미니멀한 브랜드 심볼
  - **Cut 8 (`detail-inner.jpg`)**: **패키지 내부** — 정제된 구조와 컬러 톤
  - **Cut 9 (`detail-motif.jpg`)**: **브랜드 그래픽 모티프** — 조직의 자연스러운 흐름을 형상화
- **연출**:
  - 스크롤 진행에 따라 5개의 디테일 컷 카드가 순차적으로 등장(`scrub` 스태거 패럴랙스 + 이미지 내부 미세 스케일링)

### Stage 5. 푸터 (`Contact & Corporate Info`)
- **법인명**: 주식회사 셀포지 (`CELLFORGE Inc.`)
- **대표자**: 이창섭(공동대표), 강가운(공동대표)
- **사업자등록번호**: `544-81-04072`
- **주소**: 경기도 수원시 영통구 월드컵로 123, 107호(원천동, 승전빌딩)
- **대표 이메일**: `info.cellforge@gmail.com` (`mailto:` 앵커 적용)

---

## 4. 디렉토리 구조

```text
.
├── CNAME                          # 커스텀 도메인 설정 (www.cellforge.kr)
├── .nojekyll                      # GitHub Pages Jekyll 변환 비활성화
├── favicon.ico                    # 멀티 해상도 파비콘
├── index.html                     # 메인 엔트리 페이지
├── assets/
│   ├── css/
│   │   └── style.css              # 디자인 시스템, 반응형(320~1280px), 스크롤 섹션 스타일
│   ├── js/
│   │   └── animations.js          # GSAP ScrollTrigger 포털 인트로 및 순차 쇼케이스 로직
│   └── img/
│       ├── ci.png                 # Cellforge CI 원본
│       ├── icon-c.png             # C 심볼 투명 아이콘
│       ├── favicon.ico            # 파비콘 사본
│       └── products/              # 분해 및 고화질 보정된 ADERIS 9개 이미지 컷
│           ├── aderis-main.jpg
│           ├── aderis-ha.jpg
│           ├── aderis-pn.jpg
│           ├── aderis-pn-ha.jpg
│           ├── detail-cap.jpg
│           ├── detail-finish.jpg
│           ├── detail-side.jpg
│           ├── detail-inner.jpg
│           └── detail-motif.jpg
├── docs/
│   └── PLAN.md                    # 프로젝트 구축 및 배포 계획서
└── README.md                      # 저장소 안내 문서
```

---

## 5. 단계별 작업 계획 (Roadmap)

### Phase 1. 저장소 초기화 및 배포 기반 구축 (완료)
- [x] 로컬 Git 저장소 초기화(`main`) 및 전용 계정/SSH 분리 설정
- [x] 원격 저장소(`origin`) 연결 완료
- [x] 초기 `index.html`, `README.md`, `CNAME`, `.nojekyll` 구성 및 `main` 브랜치 첫 Push 완료
- [x] GitHub 저장소 Settings → Pages 활성화 확인

### Phase 2. 커스텀 도메인(`www.cellforge.kr`) 연결 (완료)
- [x] 저장소 내 `CNAME` 파일 배포 (`www.cellforge.kr`)
- [x] 도메인 등록업체(호스팅케이알) DNS 레코드 설정 (`www` CNAME 레코드 + `@` A 레코드)
- [x] GitHub Pages Custom domain 검증 및 **Enforce HTTPS** 활성화 완료

### Phase 3. 이미지 컷 분해 및 스크롤 시나리오 설계 (진행 중)
- [x] `ADERIS®` 9개 제품/디테일 컷 좌표 분석 및 크롭/업스케일링 추출
- [x] `Cellforge` `o` 포털 줌인 → `Forging a Brighter Tomorrow` 50% 확대 → 9개 컷 순차 노출 시나리오 확정

### Phase 4. 프론트엔드 퍼블리싱 및 스크롤 애니메이션 구현 (진행 중)
- [x] `assets/css/style.css` 애플 하이브리드 폰트 및 `320px ~ 1280px` 반응형 컨테이너 구축
- [x] 인트로 포털 섹션 및 `ADERIS®` 9개 컷 쇼케이스 HTML/CSS 마크업 구현
- [x] `assets/js/animations.js` GSAP `ScrollTrigger` 기반 스크롤 동기화 구현

### Phase 5. 검수 및 `main` 프로덕션 반영 (대기)
- [ ] 로컬 서버(`npx live-server --port=8080`)에서 스크롤 감도 및 모바일 반응형 검수
- [ ] `development` 브랜치 → `main` 브랜치 병합 및 프로덕션(`https://www.cellforge.kr`) 배포
