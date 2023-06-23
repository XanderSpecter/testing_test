import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Укажи блять ёбаный путь до сервера БД в файле .env.local');
}

const client = new MongoClient(MONGODB_URI);
const dbName = 'test';

export async function connect() {
    await client.connect();
    console.log('Ебаная база данных теперь доступна');
    const db = client.db(dbName);
    const collection = db.collection('page');

    return collection;
}
