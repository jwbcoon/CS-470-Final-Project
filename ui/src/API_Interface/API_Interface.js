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


const koaAgent = AxiosConfigured(`http://localhost:8443/api/v1`);
const flaskAgent = AxiosConfigured(`http://localhost:5000`);

export default class APIInterface {

    async getUserInfo(user_id) {
        return koaAgent.get(`login/${user_id}`)
            .then(userInfo => userInfo.data)
            .catch(error => (
                {
                    error,
                    user: undefined
                 }));
    }

    // Users routes
    async getLoginFromUsername(username) {
        return koaAgent.get(`login/${username}`);
    }

    async putLogin(username, password) {
        return koaAgent.put('users/create',
        {
            username: username,
            password: password
        });
    }

    async deleteUserFromUserName(username) {
        return koaAgent.put(`delete/${username}`);
    }

    async getUserFromID(userID) {
        return koaAgent.get(`users/${userID}`);
    }
    async getUserFromUsername(username) {
        return koaAgent.get(`users/${username}`);
    }

    async putUserOriginalImage(userID, fileName, file) {
        return koaAgent.put('images/addImage',
        {
            userID: userID,
            fileName: fileName,
            file: file
        });
    }

    async removeImageByFilename(filename) {
        return koaAgent.delete(`removeImage/${filename}`);
    }

    // Flask server routes
    async putImageToEditEngine(editQuery, formData) {
        return flaskAgent.put('uploads', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            params: editQuery
        });
    }

    async getImageFromEditEngine(filename) {
        return flaskAgent.get(`downloads/${filename}`, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }

}

