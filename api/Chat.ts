import apiClient from "@/configs/client";

export const ChatService = {
   async getChatHistory() {
      const response = await apiClient.get('/api/v1/chat/history');
      return response.data;
  },

  async sendMessage(request:any) {
      const response = await apiClient.post('/api/v1/chat/send',  request );
      return response.data;
  },

  async getPrompts() {
    try {
      const response = await apiClient.get('/prompts');
      return response.data;
    } catch (error) {
      console.error('Error fetching prompts:', error);
      throw error;
    }
  },
};

