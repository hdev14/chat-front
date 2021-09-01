import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useLocation } from 'react-router'
import { formatRelative } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { InputGroup, Input } from 'reactstrap'

import WebSocketAdapter from '../../WebSocketAdapter'
import { MessageType, Message, Direction } from '../../message-types'
import './styles.css'


const Chat: React.FC = () => {
  const { state } = useLocation<{ chatId: number }>()
  const ulRef = useRef<HTMLUListElement>(null)
  const liRef = useRef<HTMLLIElement>(null)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  const formatDate = useCallback((date: Date): string => {
    return formatRelative(new Date(), new Date(date), { locale: ptBR })
  }, [])

  const autoScroll = useCallback((): void => {
    if (ulRef.current && liRef.current) {
      ulRef.current.scrollTop = ulRef.current.offsetHeight - liRef.current.offsetHeight
    }
  }, [])

  useEffect(() => {

    WebSocketAdapter.addOnMessage((e: MessageEvent) => {
      const msg = JSON.parse(e.data) as Message
      if (msg.type === MessageType.MESSAGE) {
        msg.direction = Direction.LEFT
      }
      setMessages([...messages, {
        ...msg,
        sended_at: formatDate(msg.timestamp)
      }])
    })

    autoScroll()
  }, [messages, formatDate, autoScroll])



  function makeAndSendMessage(author: string, direction: Direction): void {
    const msg = {
      type: MessageType.MESSAGE,
      author,
      content: message,
      timestamp: new Date(),
      direction
    }
    setMessages([...messages, {
        ...msg,
        sended_at: formatDate(msg.timestamp)
      }])
    WebSocketAdapter.sendMessage(msg)
    setMessage('')
    autoScroll()
  }

  function onKeyPressHandler(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      makeAndSendMessage('Você', Direction.RIGHT)
    }
  }

  function onClickHandler(e: React.MouseEvent<any, MouseEvent>): void {
    makeAndSendMessage('Você', Direction.RIGHT)
  }

  return (
    <main>
      <section id="chat">
        <div id="chat-header">
          <h3>Chat</h3>
          <strong title="Compartilhe o ID com outras pessoas.">CÓDIGO: {state.chatId}</strong>
        </div>
        <ul ref={ulRef}>
          {messages.map((msg, index) => (
            <li
              key={index}
              ref={liRef}
              className={`${(msg.direction) || ''} ${msg.type}`}>
              <div>
                <strong>{msg.author}</strong>
                <p>{msg.content}</p>
                <small>{msg.sended_at}</small>
              </div>
            </li>
          ))}
        </ul>
        <InputGroup size="md">
          <Input
            type="text"
            autoFocus
            bsSize="lg"
            placeholder="escrever mensagem..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyPress={onKeyPressHandler} />
        </InputGroup>
      </section>
    </main>
  )
}

export default Chat
