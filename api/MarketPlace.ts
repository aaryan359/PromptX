import apiClient from "@/configs/client";

export const MarketPlaceService = {
    async AddPrompt(promptData: any) {
        const response = await apiClient.post('/api/v1/marketplace/add-prompt', promptData)
        return response.data
    },
    async getPrompts() {
        const response = await apiClient.get('/api/v1/marketplace/get-prompt');
        return response.data;
    },

    async getPromptById(id: string) {
        const response = await apiClient.get('/api/v1/marketplace/getpromptById', {
            params: { id }
        });
        return response.data;
    },

    async getPromptByQuery(query: string) {
        const response = await apiClient.get('/api/v1/marketplace/get-prompt', {
            params: { search: query }
        });
        return response.data;
    }

}