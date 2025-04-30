import { ChatRoom } from '@/components/page/chats/ChatRoom';

export default function ChatRoomPage({ params }: { params: { id: string } }) {
  return (
    <main className="container mx-auto">
      <h1 className="text-2xl font-bold my-4">채팅방</h1>
      <ChatRoom chatRoomId={params.id} />
    </main>
  );
}
