import axios from 'axios';

const AxiosConfigured = () => {
    // Indicate to the API that all requests for this app are AJAX
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    // Set the baseURL for all requests to the API domain instead of the current domain
    // axios.defaults.baseURL = `http://localhost:8443/api/v1`;
    axios.defaults.baseURL = `http://localhost:8443/api/v1`;


    // Allow the browser to send cookies to the API domain (which include auth_token)
    axios.defaults.withCredentials = true;


//    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;

    return axios;
};


const axiosAgent = AxiosConfigured();

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

    async createLoginFromUserName(username) {
        return axiosAgent.put(`create/${username}`);
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

    // Images Routes
    async addImageByFilename(filename) {
        return axiosAgent.post(`addImage/${filename}`);
    }
    async removeImageByFilename(filename) {
        return axiosAgent.delete(`removeImage/${filename}`);
    }

}
