import { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BsChatDots, BsX } from 'react-icons/bs';
import chatbotService from '../services/chatbotService';
import './ChatWidget.css';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message
      setMessages([{
        sender: 'bot',
        message: "Hi! I can help you with orders, customers, and analytics. Try asking 'Show all orders' or 'What's the total revenue?'",
        timestamp: new Date()
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = {
      sender: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatbotService.sendMessage(inputMessage);
      const botMessage = {
        sender: 'bot',
        message: response.data.response,
        suggestions: response.data.suggestions,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = {
        sender: 'bot',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  return (
    <>
      <div className={`chat-widget ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="d-flex align-items-center">
            <BsChatDots className="me-2" />
            <strong>AI Assistant</strong>
          </div>
          <Button variant="link" className="text-white p-0" onClick={() => setIsOpen(false)}>
            <BsX size={24} />
          </Button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index}>
              <div className={`message ${msg.sender}`}>
                <div className="message-content">{msg.message}</div>
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="suggestions">
                  {msg.suggestions.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      variant="outline-primary"
                      size="sm"
                      className="suggestion-btn"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="message bot">
              <div className="message-content">
                <span className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <Form onSubmit={handleSendMessage}>
            <div className="d-flex">
              <Form.Control
                type="text"
                placeholder="Ask me anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isTyping}
              />
              <Button type="submit" variant="primary" disabled={isTyping || !inputMessage.trim()}>
                Send
              </Button>
            </div>
          </Form>
        </div>
      </div>

      {!isOpen && (
        <Button
          className="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          variant="primary"
        >
          <BsChatDots size={24} />
        </Button>
      )}
    </>
  );
}

export default ChatWidget;
