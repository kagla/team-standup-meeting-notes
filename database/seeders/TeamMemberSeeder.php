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

        $notesData = [
            '김민수' => [
                ['yesterday' => '사용자 인증 API 엔드포인트 구현', 'today' => '프로필 페이지 CRUD 기능 개발', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '프로필 페이지 CRUD 기능 개발 완료', 'today' => '스탠드업 노트 목록 API 작성', 'blockers' => 'DB 스키마 변경 대기 중', 'blocker_status' => 'open'],
                ['yesterday' => '스탠드업 노트 목록 API 작성', 'today' => '노트 작성/수정 기능 구현', 'blockers' => 'DB 스키마 변경 완료됨', 'blocker_status' => 'resolved'],
                ['yesterday' => '노트 작성/수정 기능 구현', 'today' => '단위 테스트 작성', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '단위 테스트 작성 및 버그 수정', 'today' => '코드 리뷰 및 PR 정리', 'blockers' => 'CI 파이프라인 타임아웃 이슈', 'blocker_status' => 'in_progress'],
            ],
            '이서연' => [
                ['yesterday' => '메인 대시보드 와이어프레임 작성', 'today' => '컴포넌트 디자인 시스템 구축', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '컴포넌트 디자인 시스템 구축', 'today' => '스탠드업 카드 UI 디자인', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '스탠드업 카드 UI 디자인', 'today' => '반응형 레이아웃 적용', 'blockers' => 'Figma 플러그인 호환성 문제', 'blocker_status' => 'open'],
                ['yesterday' => '반응형 레이아웃 적용', 'today' => '다크 모드 색상 팔레트 정의', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '다크 모드 색상 팔레트 정의', 'today' => '프로토타입 리뷰 미팅 준비', 'blockers' => null, 'blocker_status' => 'none'],
            ],
            '박지호' => [
                ['yesterday' => '스프린트 백로그 정리 및 우선순위 설정', 'today' => '팀 스탠드업 미팅 진행', 'blockers' => null, 'blocker_status' => 'none'],
                ['yesterday' => '팀 스탠드업 미팅 진행', 'today' => '이해관계자 요구사항 정리', 'blockers' => '클라이언트 피드백 대기 중', 'blocker_status' => 'open'],
                ['yesterday' => '이해관계자 요구사항 정리 완료', 'today' => '다음 스프린트 계획 수립', 'blockers' => '클라이언트 피드백 수신 완료', 'blocker_status' => 'resolved'],
                ['yesterday' => '다음 스프린트 계획 수립', 'today' => '릴리스 일정 조율', 'blockers' => 'QA팀 리소스 부족', 'blocker_status' => 'in_progress'],
                ['yesterday' => '릴리스 일정 조율', 'today' => '주간 회고 미팅 준비', 'blockers' => null, 'blocker_status' => 'none'],
            ],
        ];

        $baseDate = Carbon::parse('2026-03-17');

        foreach ($members as $memberData) {
            $member = TeamMember::create($memberData);

            foreach ($notesData[$memberData['name']] as $i => $note) {
                StandupNote::create([
                    'team_member_id' => $member->id,
                    'date' => $baseDate->copy()->addDays($i),
                    ...$note,
                ]);
            }
        }
    }
}
