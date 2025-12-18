import axios from 'axios';
export const apiCall = async (url: string, method: string, body: any): Promise<any> => {
    try {
        const response = await axios.request({
            url,
            method,
            data: body,
        });
        return response.data;
    } catch (error) {
        console.error('Error in apiCall:', error);
        throw error;
    }
};