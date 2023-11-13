import axios from 'axios';

const AxiosConfigured = baseURL => {
    const agent = axios.create({...axios});

    // Indicate to the API that all requests for this app are AJAX
    agent.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    // Set the baseURL for all requests to the API domain instead of the current domain
    // axios.defaults.baseURL = `http://localhost:8443/api/v1`;
    agent.defaults.baseURL = baseURL;


    // Allow the browser to send cookies to the API domain (which include auth_token)
    agent.defaults.withCredentials = true;


    // axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;

    return agent;
};


const axiosAgent = AxiosConfigured(`http://localhost:8443/api/v1`);
const flaskAgent = AxiosConfigured(`http://localhost:5000`);

export default class APIInterface {

    async getUserInfo(user_id) {
        return axiosAgent.get(`login/${user_id}`)
            .then(userInfo => userInfo.data)
            .catch(error => (
                {
                    error,
                    user: undefined
                 }));
    }

    // Users routes
    async getLoginFromUsername(username) {
        return axiosAgent.get(`login/${username}`);
    }

    async putLogin(username, password) {
        return axiosAgent.put('users/create',
        {
            username: username,
            password: password
        });
    }

    async deleteUserFromUserName(username) {
        return axiosAgent.put(`delete/${username}`);
    }

    async getUserFromID(userID) {
        return axiosAgent.get(`users/${userID}`);
    }
    async getUserFromUsername(username) {
        return axiosAgent.get(`users/${username}`);
    }

    async putUserOriginalImage(userID, fileName, file) {
        return axiosAgent.put('images/addImage',
        {
            userID: userID,
            fileName: fileName,
            file: file
        });
    }

    async removeImageByFilename(filename) {
        return axiosAgent.delete(`removeImage/${filename}`);
    }

    // Flask server routes
    async putImageToEditEngine(formData) {
        return flaskAgent.put('uploads', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
        });
    }

}

