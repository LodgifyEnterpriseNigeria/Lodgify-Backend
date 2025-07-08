import type { z } from "zod";
import type { taskSchema } from "@/schemas/task.schema";
import api from "@/utils/configs/axios.config";


class Endpoint {
    // Users Endpoints
    public static async getUsers() {
        const response = await api.get('/users/admin/getUsers');
        console.log(response.data)
        return response.data;
    }

    // Referral Endpoints
    public static async getReferrals() {
        const response = await api.get('/referral/admin/getReferrals')
        console.log(response.data)
        return response.data;
    }

    // Task Endpoints
    public static async createTask(payload: z.infer<typeof taskSchema>) {
        console.log(payload)
        const response = await api.post('/task/newTask', payload);
        console.log(response.data)
        return response.data;
    }
    public static async getTasks() {
        const response = await api.get('/task/admin/getTask');
        console.log(response.data)
        return response.data;
    }
}

export default Endpoint