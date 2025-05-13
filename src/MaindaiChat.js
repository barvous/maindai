import { useEffect, useState, useRef } from "react";
import "./index.css";

const API_URL = window.location.protocol + "//"+ process.env.REACT_APP_API_ADDRESS;
const SALA_ID = process.env.REACT_APP_SALA_ID;
const API_KEY = process.env.REACT_APP_API_KEY;

export default function MaindaiChatPOC() {
	const [messages, setMessages] = useState([]);
	const messagesRef = useRef(null);
	const [input, setInput] = useState("");

	useEffect(() => {
		async function carregarMensagens() {
			try {
				const res = await fetch(
					`${API_URL}/salas/${SALA_ID}/mensagens`,
					{
						headers: { "x-api-key": API_KEY },
					}
				);
				const data = await res.json();
				setMessages(Array.isArray(data) ? data : []);
			} catch (err) {
				console.error("Erro ao carregar mensagens:", err);
			}
		}
		carregarMensagens();
	}, []);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	useEffect(() => {
		const protocol = window.location.protocol === "https:" ? "wss" : "ws";
		const socket = new WebSocket(
			`${protocol}://${process.env.REACT_APP_API_ADDRESS}`
		);

		socket.onopen = () => {
			console.log("Conectado ao WebSocket");
		};

		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === "mensagens" && data.salaId === SALA_ID) {
					setMessages(data.mensagens);
				}
			} catch (err) {
				console.error("Erro ao processar mensagem WebSocket:", err);
			}
		};

		socket.onerror = (err) => {
			console.error("Erro no WebSocket:", err);
		};

		return () => {
			socket.close();
		};
	}, []);

	const sendMessage = async () => {
		if (!input.trim()) return;

		let raw;
		try {
			raw = JSON.parse(input);
		} catch (e) {
			alert("JSON inválido! Verifique a sintaxe.");
			return;
		}

		const { userKey, mensagem } = raw;
		if (!userKey || !mensagem) {
			alert('JSON deve conter "userKey" e "mensagem".');
			return;
		}

		// transforma para o formato esperado pelo backend
		const body = {
			userKey: userKey,
			mensagem: mensagem.trim(),
		};

		console.log(body);
		try {
			const res = await fetch(`${API_URL}/salas/${SALA_ID}/mensagens`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-api-key": API_KEY,
				},
				body: JSON.stringify(body),
			});
			if (!res.ok) throw new Error("Falha no envio");
			const nova = await res.json();
			setMessages((msgs) => [...msgs, nova]);
			setInput("");
		} catch (err) {
			console.error("Erro ao enviar mensagem:", err);
			alert("Não foi possível enviar a mensagem.");
		}
	};

	return (
		<div className="app-container">
			<div className="input-pane">
				<h2>Nova Mensagem (JSON)</h2>
				<textarea
					wrap="off"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder={`{\n  "mensagem": "texto aqui",\n  "userKey": "sua_chave_aqui"\n}`}
					style={{
						flex: 1,
						width: "100%",
						height: "100%",
						resize: "both",
						backgroundColor: "#2c2c2c",
						color: "#fff",
						overflow: "auto",
						whiteSpace: "pre",
						overflowWrap: "normal",
						wordWrap: "normal",
						wordBreak: "normal",
					}}
				/>
				<button onClick={sendMessage}>Enviar</button>
			</div>
			<div className="chat-container" style={{ margin: "0 auto" }}>
				<h1>Maind.ai - Sala de Diálogo</h1>
				<div className="messages" ref={messagesRef}>
					{messages.map((msg, idx) => (
						<div key={idx} className="message">
							<strong>{msg.autor}:</strong>
							<span>{msg.texto}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
