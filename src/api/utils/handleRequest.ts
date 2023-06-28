import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';

const headers = {
    'Content-Type': 'application/json',
};

const clientBaseUrl = '/api';
const serverBaseUrl = 'http://localhost:3000/api';

export const handleRequest = async <T>(request: AxiosRequestConfig) => {
    try {
        const isServerSide = typeof window === 'undefined';

        const requestWithHeaders = {
            ...request,
            url: `${isServerSide ? serverBaseUrl : clientBaseUrl}/${request.url}`,
            headers: request.headers
                ? {
                      ...request.headers,
                      ...headers,
                  }
                : {
                      ...headers,
                  },
        };

        const { data } = (await axiosInstance(requestWithHeaders)) as { data: T };

        return data;
    } catch (e) {
        console.log(e);

        return null;
    }
};
