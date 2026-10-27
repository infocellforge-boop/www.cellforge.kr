# Cellforge (`www.cellforge.kr`)

Cellforge 공식 기업 소개 웹사이트 저장소입니다. GitHub Pages를 통해 정적 웹사이트로 호스팅됩니다.

## 도메인 및 배포 정보

- **프로덕션 URL**: [https://www.cellforge.kr](https://www.cellforge.kr)
- **호스팅**: GitHub Pages (`main` 브랜치)
- **프로젝트 계획서**: [docs/PLAN.md](./docs/PLAN.md)

## 디렉토리 구조

```text
.
├── CNAME              # GitHub Pages 커스텀 도메인 설정 (www.cellforge.kr)
├── .nojekyll          # Jekyll 빌드 비활성화 (정적 파일 직접 서빙)
├── index.html         # 메인 엔트리 페이지
├── docs/
│   └── PLAN.md        # 웹사이트 구축 및 배포 계획 문서
└── README.md          # 프로젝트 안내 문서
```

## 로컬 실행 방법

별도의 빌드 과정 없이 정적 서버로 바로 확인할 수 있습니다.

```bash
# Python 내장 웹 서버 실행 예시 (http://localhost:8000)
python3 -m http.server 8000
```
