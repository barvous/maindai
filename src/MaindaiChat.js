import { useEffect, useState } from "react";
import "./index.css";

const API_URL = process.env.REACT_APP_API_URL;
const SALA_ID = process.env.REACT_APP_SALA_ID;
const API_KEY = process.env.REACT_APP_API_KEY;

export default function MaindChatPOC() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    async function carregarMensagens() {
      try {
        const res = await fetch(`${API_URL}/salas/${SALA_ID}/mensagens`, {
          headers: {
            "x-api-key": API_KEY
          }
        });
        const data = await res.json();
        console.log("Mensagens carregadas:", data);
        setMessages(Array.isArray(data) ? data : []); // segurança
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err);
      }
    }

    carregarMensagens();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const novaMensagem = {
      usuario: "Humano",
      texto: input.trim(),
    };

    try {
      const res = await fetch(`${API_URL}/salas/${SALA_ID}/mensagens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
        body: JSON.stringify(novaMensagem)
      });

      const resposta = await res.json();
      setMessages((mensagens) => [...mensagens, resposta]);
      setInput("");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
    }
  };

  return (
    <div className="chat-container">
      <h1>Maind.ai - Sala de Diálogo</h1>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="message">
            <strong>{msg.usuario}:</strong>
            <span>{msg.texto}</span>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Digite uma mensagem como um Maind..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
