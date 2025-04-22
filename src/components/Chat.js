import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your server URL if deployed

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('receive_message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('receive_message'); // Clean up listener on unmount
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Emit the message to the server
      socket.emit('send_message', message);
      setMessages((prevMessages) => [...prevMessages, message]); // Add message to chat locally
      setMessage('');
    }
  };

  return (
    <div style={chatBoxStyle}>
      <div style={messageListStyle}>
        {messages.map((msg, index) => (
          <div key={index} style={messageStyle}>
            {msg}
          </div>
        ))}
      </div>
      <div style={inputContainerStyle}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={inputStyle}
        />
        <button onClick={handleSendMessage} style={sendButtonStyle}>
          Send
        </button>
      </div>
    </div>
  );
}

const chatBoxStyle = {
  height: '200px',
  width: '100%',
  background: '#f1f1f1',
  padding: '10px',
  borderRadius: '5px',
  overflowY: 'scroll',
  display: 'flex',
  flexDirection: 'column-reverse',
};

const messageListStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const messageStyle = {
  backgroundColor: '#fff',
  padding: '8px 15px',
  borderRadius: '20px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
};

const inputContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '10px',
};

const inputStyle = {
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  width: '80%',
};

const sendButtonStyle = {
  padding: '10px 20px',
  marginLeft: '10px',
  backgroundColor: '#007acc',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default Chat;
