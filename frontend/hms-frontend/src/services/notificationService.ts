import api from "./api";

export const getNotifications = async (userId : number | string) => { 
    const res = await api.get('/notification-service/notification/${userId}');
    return res.data;
}