import apiClient from "@/configs/client";

export const AuthService = {
    async register(data: any) {
           
            const response = await apiClient.post("/api/v1/users/register", data);
            console.log(" response from backend is ", response.data)
            return response.data;
    },

    async login(data: any) {
        try {
            const response = await apiClient.post("/api/v1/users/login", data);
            return response.data;
        } catch (error: any) {
            const statusCode = error?.response?.status;
            const backendMessage = error?.response?.data?.message;

            if (statusCode === 404) {
                throw new Error(
                    "Backend login route is missing. Add POST /api/v1/users/login in backend routes/userRoutes.js",
                );
            }

            throw new Error(backendMessage || error?.message || "Login failed");
        }
    },

    async googleLogin(idToken: string, user: any) {
            const response = await apiClient.post("/api/v1/users/auth/google", { idToken ,user});
            return response.data;
    },


    forgotPassword: async (email: string) => {
        try {
            const response = await apiClient.post("/api/v1/users/forgot-password", { email });
            return response;
        } catch (error: any) {
            console.error("Forgot Password Error:", error);
            throw error.response?.data || error;
        }
    },
    checkAuthentication: async () => {
            const response = await apiClient.get("/api/v1/check");
            return response.data;
    },
    getUserStatistics:async()=>{
        const response = await apiClient.get('/api/v1/users/getUserStatistics')
        return response.data
    }
}