import { useQuery } from '@tanstack/react-query';

import * as api from '../../api/collection';
import { BaseObject } from '../../types/apiModels';

interface UseElementsParams {
    collectionName: string;
    collectionElementName: string;
}

export const useElements = <T extends BaseObject = BaseObject>({
    collectionName,
    collectionElementName,
}: UseElementsParams) => {
    const {
        data: elementsList,
        isLoading: isListLoading,
        refetch: refetchElementsList,
    } = useQuery([collectionName], () => api.getElements<T>(collectionName));

    return {
        isLoading: isListLoading,
        elementsList,
        refetchElementsList,
    };
};
