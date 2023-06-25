import { useQuery } from '@tanstack/react-query';
import * as api from '../../api/collection';

export const useElements = () => {
    return useQuery(['records'], () => api.getElements('records'));
};
