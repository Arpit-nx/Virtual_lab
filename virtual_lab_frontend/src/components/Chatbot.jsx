import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello! How can I assist you?" }]);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef(null); // Reference for the chat window

  const toggleChat = () => setIsOpen((prev) => !prev);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]); // Runs when messages change

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply || "Sorry, I couldn't understand that." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error connecting to the server." }]);
    }
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-button" onClick={toggleChat}>💬</button>

      <div className={`chat-window ${isOpen ? "open" : "closed"}`}>
        <div className="chat-header">
          <h4>AI Chatbot</h4>
          <button onClick={toggleChat}>✖</button>
        </div>

        {/* Chat Body with auto-scroll */}
        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className="chat-footer">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
