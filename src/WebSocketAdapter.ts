import { MessageData } from './message-types'

interface EventMessageListener {
  (this: WebSocket, ev: MessageEvent): any
}

class WebSocketAdapter {
  private connection: WebSocket | null = null

  public connect(url: string): void {
    this.connection = new WebSocket(url)
  }

  public disconnect(): void {
    this.connection?.close()
  }

  public sendMessage(data: MessageData): void {
    this.connection?.send(JSON.stringify(data))
  }

  public addOnMessage(func: EventMessageListener): void {
    if (this.connection) {
      this.connection.onmessage = func;
    }
  }
}

export default new WebSocketAdapter()
