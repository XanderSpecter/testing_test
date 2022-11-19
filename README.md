# testing_test

### The place to test some tests

## Перед запуском

Установить [MongoDB и MongoDB Shell (mongosh)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)

При установке MongoDB из .msi файла, ОБЯЗАТЕЛЬНО убрать галочку с пункта `install MongoDB Compass`, а то оно чото вешает установку и хз чо с ним. Все остальные настройки оставить стандартными. После установки, нужно будет перезагрузить комп.

Compass - это графический клиент для работы с MongoDB, на данный момент он не обязателен, но, если надо, можно скачать и установить [отдельно](https://www.mongodb.com/try/download/compass)

Добвить файл `.env.local` с переменными окружения, в который сразу же указать адрес сервера базы данных:

```bash
MONGODB_URI="mongodb://127.0.0.1:27017"
```

Примечание: дефолтный адрес будет работать только если запускать базу с дефолтными настройками, в случае кастома, конфигурирование доступа к БД становится вашей проблемой

## Запуск

-   Установить все зависимости:

```bash
npm ci
```

-   Запустить dev сервер:

```bash
npm run dev
```

-   Если всё прошло хорошо, сервер запустится по адресу [http://localhost:3000](http://localhost:3000)

## Работа в VSCode

Рекомендуемые расширения:

-   [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
-   [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

