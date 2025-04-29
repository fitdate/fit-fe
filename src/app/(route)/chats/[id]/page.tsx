'use client';

import { useChat } from '@/hooks/customs/useChat';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useGetChatRoomDataMutation } from '@/hooks/mutation/useChatRoomDataMutation';
import { useGetChatRoomQuery } from '@/hooks/query/useGetChatRoomQuery';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import Image from 'next/image';
import TagBadge from '@/components/common/TagBadge';
import Button from '@/components/common/Button';

interface ChatRoomType {
  id: string;
  name: string;
  partner: {
    id: string;
    name: string;
    age: number;
    height: number;
    profileImage: string;
  };
  userId: string;
}

export default function ChatRoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { messages, sendMessage, isConnected } = useChat(
    params.id as string,
    userId || ''
  );

  const { data: chatRoomData, isError: isChatRoomError } =
    useGetChatRoomQuery();
  const { mutate: getChatRoomData } = useGetChatRoomDataMutation();

  useEffect(() => {
    console.log('useEffect 실행:', {
      chatRoomId: params.id,
      chatRoomData,
      userId,
      isChatRoomError,
    });

    if (isChatRoomError) {
      setError('채팅방 정보를 불러오는데 실패했습니다.');
      setIsLoading(false);
      return;
    }

    if (!userId) {
      setError('사용자 정보를 찾을 수 없습니다.');
      setIsLoading(false);
      return;
    }

    const partnerId = chatRoomData?.find(
      (room: ChatRoomType) => room.id === params.id
    )?.partner?.id;

    if (!partnerId) {
      setError('채팅방 정보를 찾을 수 없습니다.');
      setIsLoading(false);
      return;
    }

    getChatRoomData(partnerId, {
      onSuccess: () => {
        setIsLoading(false);
      },
      onError: (error) => {
        console.error('❌ 채팅방 입장 실패:', error);
        setError('채팅방 입장에 실패했습니다. 다시 시도해주세요.');
        setIsLoading(false);
      },
    });
  }, [params.id, chatRoomData, getChatRoomData, userId, isChatRoomError]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-xl">{error}</div>
        <Button
          size="lg"
          rounded="full"
          variant="outline"
          onClick={() => router.push('/chats')}
        >
          채팅 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  const partner = chatRoomData?.find(
    (room: ChatRoomType) => room.id === params.id
  )?.partner;

  if (!partner) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 text-xl">
          상대방 정보를 찾을 수 없습니다
        </div>
        <Button
          size="lg"
          rounded="full"
          variant="outline"
          onClick={() => router.push('/chats')}
        >
          채팅 목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full flex flex-col gap-10 items-center py-6 px-5">
      {/* 상대방 정보 */}
      <div className="px-5 py-5 w-full h-auto border border-rose-500 rounded-lg flex gap-9 justify-center items-center">
        <div className="relative w-[120px] h-[120px]">
          <Image
            src={partner.profileImage || '/default-profile.png'}
            alt="프로필이미지"
            fill
            className="object-cover rounded-md"
            sizes="120px"
          />
        </div>

        <div className="flex">
          <div className="flex flex-col gap-2">
            <TagBadge>이름: {partner.name}</TagBadge>
            <TagBadge>나이: {partner.age}</TagBadge>
            <TagBadge>키: {partner.height}</TagBadge>
          </div>
        </div>
      </div>

      {/* 채팅 메시지 */}
      <div className="flex-1 w-full overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.userId === userId ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.userId === userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* 메시지 입력 */}
      <div className="w-full flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg"
          placeholder="메시지를 입력하세요..."
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              const input = e.target as HTMLInputElement;
              if (input.value.trim()) {
                sendMessage(input.value);
                input.value = '';
              }
            }
          }}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => {
            const input = document.querySelector('input');
            if (input && input.value.trim()) {
              sendMessage(input.value);
              input.value = '';
            }
          }}
        >
          전송
        </button>
      </div>

      {/* 연결 상태 표시 */}
      <div
        className={`fixed bottom-4 right-4 p-2 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
    </div>
  );
}
