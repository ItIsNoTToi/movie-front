import axios from '../axiosConfig';

export const Register = async (username: string, email: string, password: string): Promise<any> => {
    try {
        const response = await axios.post('/register', {
            username: username, 
            email: email, 
            password: password,
        })  
        return response.data;
    } catch (error) {
        console.error("Error during registration:", error);
        throw error;
        
    }
}

export const Ban_User = async (userId: any): Promise<any> => {
    try {
        const response = await axios.post('/ban-user', {
            userId: userId,
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
    }
}