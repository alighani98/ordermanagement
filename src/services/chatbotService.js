import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/chatbot';

const chatbotService = {
  sendMessage: (message) => axios.post(`${API_BASE_URL}/message`, {
    message,
    timestamp: new Date().toISOString(),
    sender: 'user'
  })
};

export default chatbotService;
