'use client';

import { ObjectId } from 'mongodb';
import { MutationFunction, useMutation, useQuery } from '@tanstack/react-query';

import {
    getElements,
    putElement,
    EditElementParams,
    postElement,
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
        putElement as MutationFunction<void, CreateElementParams<T>>,
        {
            onSuccess: () => {
                refetchElementsList();
            },
        }
    );

    const { mutate: updateElementMutation, isLoading: isUpdateElementLoading } = useMutation(
        postElement as MutationFunction<void, EditElementParams<T>>,
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

    const createElement = (element?: Partial<CollectionElement<T>>) => {
        createElementMutation({ element, collectionElementName });
    };

    const updateElement = (element: CollectionElement<T>) => {
        updateElementMutation({ element, collectionElementName });
    };

    const removeElement = (_id: ObjectId) => {
        deleteElementMutation({ _id, collectionElementName });
    };

    return {
        isLoading: isListLoading || isCreateElementLoading || isUpdateElementLoading || isDeleteElementLoading,
        elementsList,
        refetchElementsList,
        createElement,
        updateElement,
        removeElement,
    };
};
