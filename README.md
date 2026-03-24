# Team Standup Meeting Notes

팀 스탠드업 미팅 노트를 관리하는 웹 애플리케이션입니다.
Laravel 13 + Inertia.js + React 18 + Tailwind CSS 기반으로 구축되었습니다.

## 주요 기능

- **Dashboard** - 주간 참여율, 블로커 해결률, 일별 참여 차트(Recharts), 팀원별 참여 현황
- **Team Members** - 팀원 등록/삭제, 아바타 색상 지정, 역할 관리
- **Standup Notes** - 날짜별/팀원별 스탠드업 노트 작성 및 조회
- **Calendar** - 월별 캘린더 뷰로 스탠드업 참여 현황 확인, 날짜 클릭 시 상세 모달
- **History** - 팀원별 스탠드업 히스토리 조회 (날짜 범위, 블로커 상태 필터링, 페이지네이션)
- **Authentication** - Laravel Breeze 기반 로그인/회원가입

## 기술 스택

- PHP 8.4 / Laravel 13.x
- React 18 / Inertia.js 2.x
- Tailwind CSS 3.x
- Recharts (차트 라이브러리)
- SQLite (기본 DB)
- Vite 8.x

## 설치 방법

### 요구 사항

- PHP >= 8.2
- Composer
- Node.js >= 18
- npm

### 설치

```bash
# 저장소 클론
git clone https://github.com/kagla/team-standup-meeting-notes.git
cd team-standup-meeting-notes

# PHP 의존성 설치
composer install

# 환경 설정
cp .env.example .env
php artisan key:generate

# SQLite 데이터베이스 생성 및 마이그레이션
touch database/database.sqlite
php artisan migrate

# (선택) 테스트 데이터 시딩
php artisan db:seed

# Node.js 의존성 설치
npm install --legacy-peer-deps
```

### 실행

```bash
# 개발 서버 실행 (터미널 2개 필요)
php artisan serve --port=8000
npm run dev

# 또는 프로덕션 빌드
npm run build
php artisan serve --port=8000
```

http://localhost:8000 으로 접속합니다.

### 테스트 계정

시딩 실행 시 아래 계정이 생성됩니다:

- Email: `test@example.com`
- Password: `password`

## 프로젝트 구조

```
app/
├── Http/Controllers/
│   ├── DashboardController.php      # 주간 통계 대시보드
│   ├── TeamMemberController.php     # 팀원 CRUD
│   └── StandupNoteController.php    # 스탠드업 노트 CRUD, 캘린더, 히스토리
├── Models/
│   ├── TeamMember.php               # 팀원 모델 (hasMany StandupNote)
│   └── StandupNote.php              # 스탠드업 노트 모델 (belongsTo TeamMember)
resources/js/
├── Pages/
│   ├── Dashboard.jsx                # KPI 카드 + Recharts 막대 차트
│   ├── TeamMembers/Index.jsx        # 팀원 목록/등록/삭제
│   └── StandupNotes/
│       ├── Index.jsx                # 날짜별 노트 조회
│       ├── Create.jsx               # 노트 작성 폼
│       ├── Calendar.jsx             # 월별 캘린더 뷰
│       └── History.jsx              # 히스토리 조회 (필터/페이지네이션)
```

## 라우트

| Method | URI | Description |
|--------|-----|-------------|
| GET | `/dashboard` | 주간 통계 대시보드 |
| GET | `/team-members` | 팀원 목록 |
| POST | `/team-members` | 팀원 등록 |
| DELETE | `/team-members/{id}` | 팀원 삭제 |
| GET | `/standup-notes` | 스탠드업 노트 목록 |
| GET | `/standup-notes/create` | 노트 작성 폼 |
| POST | `/standup-notes` | 노트 저장 |
| PATCH | `/standup-notes/{id}/status` | 블로커 상태 업데이트 |
| GET | `/standup-notes/calendar` | 캘린더 뷰 |
| GET | `/standup-notes/history` | 히스토리 조회 |
