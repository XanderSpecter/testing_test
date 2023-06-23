import clientPromise from './client';

const dbName = 'test';

export async function connect() {
    const client = await clientPromise;
    const db = client.db(dbName);

    return db;
}
