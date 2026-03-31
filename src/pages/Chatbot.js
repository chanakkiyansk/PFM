import React, { useState } from "react";

const Chatbot = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);

    const sendMessage = async () => {
        if (!message) return;

        // show user message
        setChat(prev => [...prev, { type: "user", text: message }]);

        try {
            const res = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            const data = await res.json();

            // show bot reply
            setChat(prev => [...prev, { type: "bot", text: data.reply }]);

        } catch (err) {
            setChat(prev => [...prev, { type: "bot", text: "Server error ❌" }]);
        }

        setMessage("");
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>🤖 Finance Chatbot</h2>

            {/* CHAT BOX */}
            <div style={{
                height: "300px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px"
            }}>
                {chat.map((c, i) => (
                    <div key={i} style={{
                        textAlign: c.type === "user" ? "right" : "left",
                        margin: "5px 0"
                    }}>
                        <span style={{
                            background: c.type === "user" ? "#00adb5" : "#eee",
                            color: c.type === "user" ? "white" : "black",
                            padding: "8px",
                            borderRadius: "8px",
                            display: "inline-block"
                        }}>
                            {c.text}
                        </span>
                    </div>
                ))}
            </div>

            {/* INPUT */}
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
                style={{ width: "70%", padding: "8px" }}
            />

            <button
                onClick={sendMessage}
                style={{ padding: "8px 12px", marginLeft: "10px" }}
            >
                Send
            </button>
        </div>
    );
};

export default Chatbot;