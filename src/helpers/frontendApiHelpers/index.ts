import { AxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';

const headers = {
    'Content-Type': 'application/json',
};

export const handleRequest = async <T>(request: AxiosRequestConfig) => {
    try {
        const requestWithHeaders = {
            ...request,
            url: `/api/${request.url}`,
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
    }
};
