export enum MessageType {
  CONNECTION = 'connection',
  MESSAGE = 'message'
}

export type MessageData = {
  type: MessageType,
  author?: string,
  content: string,
  timestamp: Date
}

export enum Direction {
  RIGHT = 'right',
  LEFT = 'left'
}

export type Message = MessageData & { sended_at?: string, direction: Direction }
