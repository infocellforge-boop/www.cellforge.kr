# Cellforge 정적 웹사이트 구축 및 GitHub Pages 배포 계획

## 1. 프로젝트 개요

| 항목 | 내용 |
| :--- | :--- |
| **프로젝트명** | Cellforge 공식 웹사이트 |
| **대상 도메인** | `www.cellforge.kr` (`cellforge.kr`) |
| **원격 저장소** | `https://github.com/infocellforge-boop/www.cellforge.kr.git` |
| **호스팅 환경** | GitHub Pages |
| **문서 목적** | 정적 웹사이트 기획·구현·배포 전 과정의 로드맵 관리 (세부 기획은 추후 업데이트) |

---

## 2. 기술 스택 및 배포 아키텍처 *(추후 확정)*

### 2.1 프론트엔드 구성 후보
- **옵션 1 (경량 정적 구성)**: 순수 HTML5 + CSS3(또는 Tailwind CSS) + Vanilla JS
- **옵션 2 (SSG 프레임워크)**: Astro / Next.js (`output: 'export'`) / Vite 기반 정적 빌드

### 2.2 GitHub Pages 배포 전략
- **권장 방식 (GitHub Actions 배포)**:
  - `main` 브랜치에 Push 시 GitHub Actions를 통해 정적 파일(또는 빌드 산출물)을 배포
  - 저장소 내 `docs/` 디렉토리를 웹 루트가 아닌 **프로젝트 문서 보관용**으로 분리 유지 가능
- **대안 방식 (브랜치 직접 배포)**:
  - `main` 브랜치 루트(`/`) 또는 `gh-pages` 브랜치를 배포 소스로 지정

---

## 3. 웹사이트 구성안 *(세부 내용 추후 정리)*

- [ ] **헤더 / 내비게이션 (GNB)**: 로고, 주요 섹션 이동 메뉴
- [ ] **히어로 섹션 (Hero)**: 핵심 슬로건 및 브랜드 아이덴티티 비주얼
- [ ] **소개 섹션 (About)**: Cellforge 비전, 핵심 가치 및 개요
- [ ] **주요 사업 / 기술 / 제품 (Solutions & Tech)**: *(세부 항목 추후 작성)*
- [ ] **소식 / 공지 또는 파트너 (News & Partners)**: *(필요 여부 추후 결정)*
- [ ] **문의 / 푸터 (Contact & Footer)**: 대표 이메일(`info.cellforge@gmail.com`), 주소, 저작권 표시

---

## 4. 단계별 작업 계획 (Roadmap)

### Phase 1. 저장소 초기화 및 배포 파이프라인 구축
- [x] 로컬 Git 저장소 초기화(`main`) 및 전용 계정/SSH 분리 설정
- [x] 원격 저장소(`origin`) 연결 완료
- [ ] 테스트용 초기 페이지(`index.html`) 및 배포 설정 구성
- [ ] `main` 브랜치 첫 Push 및 GitHub Pages 기본 URL 배포 확인

### Phase 2. 커스텀 도메인(`www.cellforge.kr`) 연결
- [ ] 저장소 내 `CNAME` 설정 (`www.cellforge.kr`)
- [ ] 도메인 DNS 레코드 설정
  - Apex 도메인(`cellforge.kr`): GitHub Pages A 레코드 (`185.199.108.153` ~ `185.199.111.153`)
  - 서브도메인(`www.cellforge.kr`): `infocellforge-boop.github.io`로 CNAME 레코드 연결
- [ ] GitHub Pages Settings에서 Custom domain 검증 및 **Enforce HTTPS** 활성화

### Phase 3. 상세 기획 및 디자인 리소스 정의 *(추후 진행)*
- [ ] 사이트맵 및 섹션별 상세 카피라이팅 정리
- [ ] 컬러 팔레트, 타이포그래피, 로고/파비콘 및 이미지 에셋 준비
- [ ] 반응형(Desktop / Tablet / Mobile) 레이아웃 기준 수립

### Phase 4. 프론트엔드 퍼블리싱 및 구현
- [ ] 공통 레이아웃 및 섹션별 컴포넌트 마크업/스타일링
- [ ] 인터랙션 및 애니메이션 효과 적용
- [ ] 반응형 미디어쿼리 및 크로스 브라우징 대응

### Phase 5. SEO 최적화 및 최종 오픈
- [ ] 메타태그(`title`, `description`, Open Graph `og:*`) 적용
- [ ] `robots.txt`, `sitemap.xml`, `404.html` 구성
- [ ] Lighthouse 성능·접근성·SEO 점검 및 최종 배포

---

## 5. 추후 결정 사항 (TBD)

1. **기술 스택 선택**: 순수 HTML/CSS/JS로 빠르게 구성할지, 정적 사이트 생성기(Astro/Vite 등)를 사용할지 결정
2. **콘텐츠 범위**: 단일 랜딩 페이지(One-page) 형태인지, 다중 페이지(Multi-page) 구성인지 결정
3. **다국어 지원 여부**: 한국어 단독 운영 여부 또는 영문(KO/EN) 전환 기능 포함 여부
4. **도메인 DNS 관리 주체**: 현재 `cellforge.kr` 도메인 등록 대행사 확인 및 DNS 레코드 반영 일정
