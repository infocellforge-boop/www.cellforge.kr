# Cellforge (`www.cellforge.kr`)

Cellforge 공식 기업 소개 웹사이트 저장소입니다. GitHub Pages를 통해 정적 웹사이트로 호스팅됩니다.

## 도메인 및 배포 정보

- **프로덕션 URL**: [https://www.cellforge.kr](https://www.cellforge.kr)
- **호스팅**: GitHub Pages (`main` 브랜치 배포 / `development` 브랜치 작업)
- **프로젝트 계획서**: [docs/PLAN.md](./docs/PLAN.md)

## 디렉토리 구조

```text
.
├── CNAME                  # GitHub Pages 커스텀 도메인 설정 (www.cellforge.kr)
├── .nojekyll              # Jekyll 빌드 비활성화 (정적 파일 직접 서빙)
├── favicon.ico            # 파비콘 (멀티 해상도 ICO)
├── index.html             # 메인 엔트리 페이지
├── assets/
│   ├── css/
│   │   └── style.css      # 디자인 시스템, 타이포그래피, 반응형 레이아웃
│   └── img/
│       ├── ci.png         # Cellforge CI 원본
│       ├── icon-c.png     # C 심볼 투명 아이콘
│       └── favicon.ico    # 파비콘 사본
├── docs/
│   └── PLAN.md            # 웹사이트 구축 및 배포 계획 문서
└── README.md              # 프로젝트 안내 문서
```

## 로컬 실행 방법 (실시간 미리보기)

별도의 빌드 과정 없이 `live-server`를 실행하면 브라우저가 자동으로 열리며, HTML/CSS/JS 파일을 저장할 때마다 **자동으로 새로고침(Live Reload)** 됩니다.

```bash
# 실시간 자동 새로고침 로컬 서버 실행 (http://localhost:8080)
npx live-server --port=8080
```

> 최초 1회 실행 시 `Need to install the following packages: live-server` 안내가 나오면 `y`를 입력해 진행하면 됩니다.
