'use client';

import { ObjectId } from 'mongodb';
import { MutationFunction, useMutation, useQuery } from '@tanstack/react-query';

import {
    getElements,
    putElement,
    CreateElementParams,
    UpdateElementParams,
    postElement,
    DeleteElementParams,
    deleteElement,
} from '../../api/collection';
import { BaseObject, CollectionElement, CollectionParams } from '../../types/apiModels';
import { useState } from 'react';

interface UseElementsParams extends CollectionParams {
    query?: BaseObject;
}

export const useElements = <T extends BaseObject = BaseObject>({ collectionElementName, query }: UseElementsParams) => {
    const {
        data: elementsList,
        isLoading: isListLoading,
        refetch: refetchElementsList,
    } = useQuery([collectionElementName], () => getElements<T>({ collectionElementName, query }));

    const [isOperationRunning, setIsOperationRunning] = useState<boolean | null>(null);

    const { mutate: createElementMutation, isLoading: isCreateElementLoading } = useMutation(
        putElement as MutationFunction<void, CreateElementParams<T>>,
        {
            onSuccess: () => {
                setIsOperationRunning(false);
                refetchElementsList();
            },
        }
    );

    const { mutate: updateElementMutation, isLoading: isUpdateElementLoading } = useMutation(
        postElement as MutationFunction<void, UpdateElementParams<T>>,
        {
            onSuccess: () => {
                setIsOperationRunning(false);
                refetchElementsList();
            },
        }
    );

    const { mutate: deleteElementMutation, isLoading: isDeleteElementLoading } = useMutation(
        deleteElement as MutationFunction<void, DeleteElementParams>,
        {
            onSuccess: () => {
                setIsOperationRunning(false);
                refetchElementsList();
            },
        }
    );

    const createElement = (element: Partial<CollectionElement<T>>) => {
        setIsOperationRunning(true);
        createElementMutation({ element, collectionElementName });
    };

    const updateElement = (element: CollectionElement<T>) => {
        setIsOperationRunning(true);
        updateElementMutation({ element, collectionElementName });
    };

    const removeElement = (_id: ObjectId) => {
        setIsOperationRunning(true);
        deleteElementMutation({ _id, collectionElementName });
    };

    return {
        isLoading: isListLoading || isCreateElementLoading || isUpdateElementLoading || isDeleteElementLoading,
        elementsList: elementsList || [],
        isOperationRunning,
        refetchElementsList,
        createElement,
        updateElement,
        removeElement,
    };
};
