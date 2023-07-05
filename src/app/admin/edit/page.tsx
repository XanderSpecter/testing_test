import Editor from '@/components/system/Editor';
import { BaseObject, Collection, CollectionElement } from '@/types/apiModels';

interface CollectionPageProps {
    params: Collection;
    searchParams: BaseObject;
}

export default async function EditorPage({ params, searchParams }: CollectionPageProps) {
    return <Editor element={{} as CollectionElement} />;
}
