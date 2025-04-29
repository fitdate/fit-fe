import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';

export interface SocketMessage {
  content: string;
  userId: string;
  chatRoomId: string;
}

interface SocketHandler {
  (): void;
}

class SocketService {
  public socket: typeof Socket | null = null;
  private messageHandlers: Set<SocketHandler> = new Set();

  connect() {
    if (!this.socket) {
      try {
        this.socket = io('http://localhost:3000', {
          transports: ['websocket'],
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          console.log('채팅 서버 연결됨');
        });

        this.socket.on('connect_error', (error: Error) => {
          console.error('연결 에러:', error);
        });

        this.socket.on('error', (error: Error) => {
          console.error('소켓 에러:', error);
        });

        this.socket.on('message', (message: SocketMessage) => {
          console.log('메시지 수신:', message);
          this.messageHandlers.forEach((handler) => handler(message));
        });
      } catch (error) {
        console.error('소켓 초기화 실패:', error);
      }
    }
  }

  joinRoom(chatRoomId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('join', { chatRoomId, userId });
    }
  }

  sendMessage(content: string, userId: string, chatRoomId: string) {
    if (this.socket) {
      this.socket.emit('message', { content, userId, chatRoomId });
    }
  }

  onMessage(handler: SocketHandler) {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.messageHandlers.clear();
    }
  }
}

export const socketService = new SocketService();
