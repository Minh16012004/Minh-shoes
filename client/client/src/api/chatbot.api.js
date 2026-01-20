import axiosInstance from './axios';

export const sendMessage = async (message, conversationHistory) => {
  try {
    const response = await axiosInstance.post('/chatbot/chat', {
      message,
      conversationHistory
    });
    return response.data;
  } catch (error) {
    console.error('Chatbot API error:', error);
    throw error;
  }
};