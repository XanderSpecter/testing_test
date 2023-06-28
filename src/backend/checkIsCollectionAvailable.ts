import { AVAILABLE_COLLECTIONS } from '@/constants/collections';

const checkIsCollectionAvailable = (collectionElementName?: unknown) => {
    if (!collectionElementName) {
        return false;
    }

    return AVAILABLE_COLLECTIONS.some((c) => c.name === collectionElementName);
};

export default checkIsCollectionAvailable;
