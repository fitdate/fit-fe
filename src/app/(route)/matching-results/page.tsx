'use client';

import { useEffect, useState } from 'react';
import { fetchMatchResults, MatchResult } from '@/services/matchResult';
import Button from '@/components/common/Button';
import ProfileCard from '@/components/common/Profilecard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logofit from '@/assets/1.png';
import { useUserStatusStore } from '@/store/userStatusStore';

export default function MatchingResultsPage() {
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const router = useRouter();
  const { userStatuses, fetchUserStatuses } = useUserStatusStore();

  useEffect(() => {
    const loadMatchResults = async () => {
      const data = await fetchMatchResults();
      setMatchResults(data);

      const userIds = data.flatMap((result) => [
        result.currentUser.id,
        result.selectedUser.id,
      ]);

      if (userIds.length > 0) {
        fetchUserStatuses([...new Set(userIds)]);
      }
    };
    loadMatchResults();
  }, [fetchUserStatuses]);

  const handleClickChattingMove = () => {
    if (selectedMatch) {
      router.push(`/chats/${selectedMatch.currentUser.id}`);
    }
  };

  const handleClickMembersMove = () => {
    router.push('/members');
  };

  const handleShowResult = (match: MatchResult) => {
    setSelectedMatch(match);
  };

  const isPopupOpen = selectedMatch !== null;

  return (
    <div className="relative w-full min-h-full flex flex-col">
      {/* 결과 팝업 */}
      {isPopupOpen && (
        <div className="absolute z-10 w-full h-full bg-[rgba(0,0,0,0.7)] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl flex flex-col items-center py-10 px-5 space-y-6">
            <h1 className="text-xl font-bold text-center">
              {selectedMatch.isSuccess
                ? '🎊 매칭 성공! 새로운 인연이 시작됐어요.'
                : '🙊 매칭 실패! 인연이 아니었습니다.'}
            </h1>

            <div className="text-rose-300 text-sm text-center space-y-2">
              {selectedMatch.isSuccess ? (
                <>
                  <p>두 분 모두 서로를 선택했어요.</p>
                  <p>
                    지금 바로 <span className="text-violet-500">커피챗</span>을 신청해보세요!
                  </p>
                </>
              ) : (
                <>
                  <p>아쉽게도 매칭에 실패했어요.</p>
                  <p>다른 멋진 인연을 찾아봐요!</p>
                </>
              )}
            </div>

            <Button
              size="md"
              rounded="md"
              color="violet"
              onClick={selectedMatch.isSuccess ? handleClickChattingMove : handleClickMembersMove}
            >
              {selectedMatch.isSuccess ? '☕️ 대화하러 가기' : '👀 회원 둘러보기'}
            </Button>
          </div>
        </div>
      )}

      {/* 매칭 결과 목록 */}
      <div className="flex flex-col gap-5 justify-center items-center px-5 py-10">
        {matchResults.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="flex gap-3 justify-center items-center py-10"
          >
            <Link href={`/members/${group.currentUser.id}`}>
              <ProfileCard
                userId={group.currentUser.id}
                name={group.currentUser.nickname}
                age={group.currentUser.age}
                likes={group.currentUser.likeCount}
                region={group.currentUser.region}
                isOnline={userStatuses[group.currentUser.id] || false}
                profileImageUrl={group.currentUser.profileImage}
              />
            </Link>

            <div className="flex flex-col gap-3 justify-center items-center">
              <Image src={logofit} alt="로고" width={70} height={100} />
              <Button
                rounded="md"
                size="sm"
                onClick={() => handleShowResult(group)}
              >
                결과 보기
              </Button>
            </div>

            <Link href={`/members/${group.selectedUser.id}`}>
              <ProfileCard
                userId={group.selectedUser.id}
                name={group.selectedUser.nickname}
                age={group.selectedUser.age}
                likes={group.selectedUser.likeCount}
                region={group.selectedUser.region}
                isOnline={userStatuses[group.selectedUser.id] || false}
                profileImageUrl={group.selectedUser.profileImage}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
