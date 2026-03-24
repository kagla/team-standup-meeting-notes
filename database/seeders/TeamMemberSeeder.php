<?php

namespace Database\Seeders;

use App\Models\TeamMember;
use App\Models\StandupNote;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TeamMemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            ['name' => '김민수', 'role' => 'Developer', 'avatar_color' => '#3B82F6'],
            ['name' => '이서연', 'role' => 'Designer', 'avatar_color' => '#EC4899'],
            ['name' => '박지호', 'role' => 'PM', 'avatar_color' => '#10B981'],
        ];

        // 오늘 기준으로 날짜 계산 (최근 2주간 평일 데이터)
        $today = Carbon::today();
        $weekdays = [];
        $cursor = $today->copy()->subDays(13);
        while ($cursor->lte($today)) {
            if ($cursor->isWeekday()) {
                $weekdays[] = $cursor->copy();
            }
            $cursor->addDay();
        }

        $notesData = [
            '김민수' => [
                ['yesterday' => '사용자 인증 API 엔드포인트 구현', 'today' => '프로필 페이지 CRUD 기능 개발', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '프로필 페이지 CRUD 기능 개발 완료', 'today' => '스탠드업 노트 목록 API 작성', 'blockers' => 'DB 스키마 변경 대기 중', 'blocker_status' => 'open'],
                ['yesterday' => '스탠드업 노트 목록 API 작성', 'today' => '노트 작성/수정 기능 구현', 'blockers' => 'DB 스키마 변경 완료됨', 'blocker_status' => 'resolved'],
                ['yesterday' => '노트 작성/수정 기능 구현', 'today' => '단위 테스트 작성', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '단위 테스트 작성 및 버그 수정', 'today' => '코드 리뷰 및 PR 정리', 'blockers' => 'CI 파이프라인 타임아웃 이슈', 'blocker_status' => 'in_progress'],
                ['yesterday' => '코드 리뷰 반영 완료', 'today' => 'E2E 테스트 시나리오 작성', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => 'E2E 테스트 시나리오 작성', 'today' => '성능 최적화 조사', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '성능 최적화 조사 완료', 'today' => 'N+1 쿼리 해결', 'blockers' => '스테이징 서버 접근 권한 필요', 'blocker_status' => 'open'],
                ['yesterday' => 'N+1 쿼리 해결', 'today' => '캐싱 레이어 구현', 'blockers' => '스테이징 서버 접근 권한 획득', 'blocker_status' => 'resolved'],
                ['yesterday' => '캐싱 레이어 구현', 'today' => '배포 파이프라인 정리', 'blockers' => null, 'blocker_status' => 'none'],
            ],
            '이서연' => [
                ['yesterday' => '메인 대시보드 와이어프레임 작성', 'today' => '컴포넌트 디자인 시스템 구축', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '컴포넌트 디자인 시스템 구축', 'today' => '스탠드업 카드 UI 디자인', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '스탠드업 카드 UI 디자인', 'today' => '반응형 레이아웃 적용', 'blockers' => 'Figma 플러그인 호환성 문제', 'blocker_status' => 'open'],
                ['yesterday' => '반응형 레이아웃 적용', 'today' => '다크 모드 색상 팔레트 정의', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '다크 모드 색상 팔레트 정의', 'today' => '프로토타입 리뷰 미팅 준비', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '프로토타입 리뷰 반영', 'today' => '캘린더 뷰 디자인', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '캘린더 뷰 디자인', 'today' => '히스토리 페이지 목업', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '히스토리 페이지 목업 완료', 'today' => '아이콘 세트 정리', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '아이콘 세트 정리', 'today' => 'QA팀 UI 피드백 반영', 'blockers' => 'QA 피드백 문서 미수신', 'blocker_status' => 'in_progress'],
                ['yesterday' => 'QA팀 UI 피드백 반영', 'today' => '최종 디자인 핸드오프', 'blockers' => null, 'blocker_status' => 'none'],
            ],
            '박지호' => [
                ['yesterday' => '스프린트 백로그 정리 및 우선순위 설정', 'today' => '팀 스탠드업 미팅 진행', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '팀 스탠드업 미팅 진행', 'today' => '이해관계자 요구사항 정리', 'blockers' => '클라이언트 피드백 대기 중', 'blocker_status' => 'open'],
                ['yesterday' => '이해관계자 요구사항 정리 완료', 'today' => '다음 스프린트 계획 수립', 'blockers' => '클라이언트 피드백 수신 완료', 'blocker_status' => 'resolved'],
                ['yesterday' => '다음 스프린트 계획 수립', 'today' => '릴리스 일정 조율', 'blockers' => 'QA팀 리소스 부족', 'blocker_status' => 'in_progress'],
                ['yesterday' => '릴리스 일정 조율', 'today' => '주간 회고 미팅 준비', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '주간 회고 진행', 'today' => '번다운 차트 분석', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '번다운 차트 분석', 'today' => '리스크 리포트 작성', 'blockers' => null, 'blocker_status' => 'none'],
                null, // 결석 시뮬레이션
                ['yesterday' => '리스크 리포트 공유', 'today' => '스프린트 데모 준비', 'blockers' => '데모 환경 세팅 지연', 'blocker_status' => 'open'],
                ['yesterday' => '스프린트 데모 준비', 'today' => '회고 및 다음 스프린트 킥오프', 'blockers' => null, 'blocker_status' => 'none'],
            ],
        ];

        foreach ($members as $memberData) {
            $member = TeamMember::create($memberData);

            foreach ($notesData[$memberData['name']] as $i => $note) {
                if ($note === null || !isset($weekdays[$i])) {
                    continue;
                }

                StandupNote::create([
                    'team_member_id' => $member->id,
                    'date' => $weekdays[$i]->toDateString(),
                    ...$note,
                ]);
            }
        }
    }
}
