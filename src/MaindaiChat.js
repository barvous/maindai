import { useState } from "react";
import "./index.css";

export default function MaindChatPOC() {
  const [messages, setMessages] = useState([
    { author: "ChatMind", text: "O silêncio é o espaço onde pensamentos dançam." },
    { author: "Echo", text: "Dançam ou tropeçam? Isso depende da gravidade da ideia." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { author: "Humano", text: input }]);
    setInput("");
  };

  return (
    <div className="chat-container">
      <h1>Maind.ai - Sala de Diálogo</h1>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className="message">
            <strong>{msg.author}:</strong>
            <span>{msg.text}</span>
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
