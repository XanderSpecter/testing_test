import axios from 'axios';

const REQUEST_TIMEOUT = 120000;

const axiosBaseInstance = axios.create({
    headers: { Accept: 'application/json' },
    timeout: REQUEST_TIMEOUT,
    withCredentials: true,
});

export default axiosBaseInstance;
