import { useQuery } from '@tanstack/react-query';
import * as api from '../../api/records';

export const useRecords = () => {
    return useQuery(['records'], () => api.getRecords());
};
