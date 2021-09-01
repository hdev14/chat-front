import React, {useState} from 'react'
import { useHistory } from 'react-router'
import { v4 as uuidv4, validate } from 'uuid'
import * as RS from 'reactstrap'
import { ReactComponent as Whatsapp } from '../../assets/whatsapp.svg';
import WebSocketAdapter from '../../WebSocketAdapter'
import './styles.css'

const Form: React.FC = () => {
  const history = useHistory()
  const [name, setName] = useState('')
  const [chatId, setChatId] = useState('')
  const [error, setError] = useState('')

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  function createChat (name: string, chatId: string): void {
    const url = `${process.env.REACT_APP_WS_URL}/?name=${name}&id=${chatId}`
    WebSocketAdapter.connect(url)
  }

  function onSubmit (e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    if (name) {
      const id = uuidv4()
      createChat(name, id)
      history.push('/chat', { chatId: id })
    }
  }

  function getIn (_: any): void {
    setModal(!modal)
    if (!validate(chatId)) {
      setError('ID Inválido.')
      return;
    }
    createChat(name, chatId)
    setError('')
    history.push('/chat', { chatId })
  }

  function toggleModalWithName (_: any): void {
    if (!name) {
      setError('Por favor, digite o seu nome.')
      return;
    }

    setModal(!modal)
    setError('')
  }

  return (
    <main>
      <section id="header">
        <Whatsapp />
        <h1>WHATSAPP "CLONE"</h1>
      </section>
      <section id="form">
        {error && (
          <RS.Alert color="danger">
            {error}
          </RS.Alert>
        )}
        <RS.Form onSubmit={onSubmit}>
          <RS.FormGroup>
            <RS.Label for="name">Nome</RS.Label>
            <RS.Input
              required
              bsSize="lg"
              type="text"
              name="name"
              placeholder="Digite seu nome"
              onChange={(e) => setName(e.target.value)}
            />
          </RS.FormGroup>
          <RS.Button block type="submit" color="success" size="lg">Novo Chat</RS.Button>
          <RS.Button
            block
            outline
            size="lg"
            type="button"
            color="secondary"
            onClick={toggleModalWithName}>
            Já possuo código!
          </RS.Button>
        </RS.Form>
      </section>
      <RS.Modal isOpen={modal} toggle={toggle}>
        <RS.ModalHeader toggle={toggle}>Código do Chat</RS.ModalHeader>
        <RS.ModalBody>
          <RS.FormGroup>
            <RS.Input
              type="text"
              name="chatid"
              placeholder="Digite o código do chat"
              onChange={(e) => setChatId(e.target.value)}
            />
          </RS.FormGroup>
        </RS.ModalBody>
        <RS.ModalFooter>
          <RS.Button
            color={chatId ? 'success' : 'secondary'}
            onClick={getIn}>
            Confirmar
          </RS.Button>
        </RS.ModalFooter>
      </RS.Modal>
    </main>
  )
}

export default Form
