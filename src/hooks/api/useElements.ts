import { ObjectId } from 'mongodb';
import { MutationFunction, useMutation, useQuery } from '@tanstack/react-query';

import {
    getElements,
    createElement,
    EditElementParams,
    updateElement,
    CreateElementParams,
    DeleteElementParams,
    deleteElement,
} from '../../api/collection';
import { BaseObject, CollectionElement, WithcollectionElementName } from '../../types/apiModels';

interface UseElementsParams extends WithcollectionElementName {
    query?: BaseObject;
}

export const useElements = <T extends BaseObject = BaseObject>({ collectionElementName, query }: UseElementsParams) => {
    const {
        data: elementsList,
        isLoading: isListLoading,
        refetch: refetchElementsList,
    } = useQuery([collectionElementName], () => getElements<T>({ collectionElementName, query }));

    const { mutate: createElementMutation, isLoading: isCreateElementLoading } = useMutation(
        createElement as MutationFunction<void, CreateElementParams<T>>,
        {
            onSuccess: () => {
                refetchElementsList();
            },
        }
    );

    const { mutate: updateElementMutation, isLoading: isUpdateElementLoading } = useMutation(
        updateElement as MutationFunction<void, EditElementParams<T>>,
        {
            onSuccess: () => {
                refetchElementsList();
            },
        }
    );

    const { mutate: deleteElementMutation, isLoading: isDeleteElementLoading } = useMutation(
        deleteElement as MutationFunction<void, DeleteElementParams>,
        {
            onSuccess: () => {
                refetchElementsList();
            },
        }
    );

    const addElement = (element?: Partial<CollectionElement<T>>) => {
        createElementMutation({ element, collectionElementName });
    };

    const editElement = (element: CollectionElement<T>) => {
        updateElementMutation({ element, collectionElementName });
    };

    const removeElement = (_id: ObjectId) => {
        deleteElementMutation({ _id, collectionElementName });
    };

    return {
        isLoading: isListLoading || isCreateElementLoading || isUpdateElementLoading || isDeleteElementLoading,
        elementsList,
        refetchElementsList,
        addElement,
        editElement,
        removeElement,
    };
};
