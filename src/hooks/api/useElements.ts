import { useQuery } from '@tanstack/react-query';

import * as api from '../../api/collection';
import { BaseObject } from '../../types/apiModels';

interface UseElementsParams {
    collectionElementName: string;
}

export const useElements = <T extends BaseObject = BaseObject>({ collectionElementName }: UseElementsParams) => {
    const {
        data: elementsList,
        isLoading: isListLoading,
        refetch: refetchElementsList,
    } = useQuery([collectionElementName], () => api.getElements<T>(collectionElementName));

    return {
        isLoading: isListLoading,
        elementsList,
        refetchElementsList,
    };
};
