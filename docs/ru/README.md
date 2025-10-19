## Документация платформы NewsGuard (RU)

Эта документация описывает публичные и административные API бекенда (FastAPI), клиентскую библиотеку фронтенда, ключевые React‑компоненты, а также интеграцию с Telegram‑ботом. В конце приведены инструкции по установке и запуску.

### Бекенд API (FastAPI)
Базовый префикс API: `/api`

- Корневые служебные эндпоинты:
  - `GET /` — информация об API (версия, ссылки на Swagger/Redoc)
  - `GET /health` — проверка работоспособности сервиса

#### Аутентификация (`/api/auth`)
- `POST /api/auth/signup` — регистрация пользователя
  - Тело: `{ username, email, password, first_name?, last_name? }`
  - Ответ: `{ access_token, token_type, user, is_admin }`
- `POST /api/auth/signin` — вход
  - Тело: `{ username, password }` (username может быть email)
  - Ответ: `{ access_token, token_type, user, is_admin }`
- `GET /api/auth/me` — текущий пользователь
  - Заголовок: `Authorization: Bearer <token>`
  - Ответ: `user`
- `POST /api/auth/logout` — выход (статический, токен не инвалидацииуется на сервере)
- `PUT /api/auth/profile` — обновление профиля
  - Тело (любые поля опциональны): `{ first_name?, last_name?, profile_photo? }`
  - Требуется Bearer‑токен

Пример запроса (обновление профиля):
```bash
curl -X PUT "$API_BASE/api/auth/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Ivan","last_name":"Ivanov"}'
```

#### Публичные данные
- `GET /api/articles` — список опубликованных статей с пагинацией и фильтрами
  - Параметры: `page=1`, `limit=10`, `category=slug` (много раз), `search`, `sort=created_at|views_count|title|featured`
  - Ответ: `{ items, total, page, limit, pages }`
- `GET /api/articles/{id}` — статья по ID + учёт просмотра
- `POST /api/articles/{id}/like` — лайк
- `POST /api/articles/{id}/dislike` — дизлайк
- `POST /api/articles/{id}/share` — «поделиться» (счётчик)
- `GET /api/categories` — список категорий с количеством статей
- `GET /api/categories/{slug}` — категория по слагу (с метаданными)
- `GET /api/category/{slug}/articles` — статьи выбранной категории с пагинацией/сортировкой
- `GET /api/stats` — статистика платформы
- `GET /api/trending?limit=10` — трендовые статьи
- `GET /api/search?q=...&page=1&limit=10&category=slug` — поиск по статьям
- `POST /api/newsletter` — подписка на рассылку, тело `{ email }`

Пример запроса (список статей по категориям):
```bash
curl "$API_BASE/api/articles?category=technology&category=business&sort=featured&limit=12"
```

#### Админ‑эндпоинты (`/api/admin`)
- `GET /api/admin/stats` — метрики админ‑дашборда
- `GET /api/admin/articles?page=1&limit=10&status=draft|published|archived|flagged` — управление списком статей
- `POST /api/admin/articles` — создать статью
  - Тело: `{ title, content, summary?, author, meta_description?, featured_image?, is_featured, is_breaking_news, category_id, slug?, status }`
- `PUT /api/admin/articles/{id}` — обновить статью (любые поля опциональны)
- `DELETE /api/admin/articles/{id}` — удалить статью
- `GET /api/admin/categories` — категории для выпадающих списков
- Модерация:
  - `GET /api/admin/moderation/flagged` — список помеченного контента
  - `POST /api/admin/moderation/{id}/approve` — одобрить
  - `POST /api/admin/moderation/{id}/reject` — отклонить/архивировать

Пример запроса (создание статьи):
```bash
curl -X POST "$API_BASE/api/admin/articles" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Новый релиз",
    "content": "<p>Содержимое...</p>",
    "summary": "Кратко",
    "author": "Редакция",
    "is_featured": true,
    "is_breaking_news": false,
    "category_id": 1,
    "status": "published"
  }'
```

### Клиентский API (frontend `frontend/my-app/lib/api.ts`)
Базовый URL берётся из `NEXT_PUBLIC_API_URL` или по умолчанию `http://192.168.0.245:7070/api`.

Доступные методы:
- `getArticles({ page?, limit?, category?, categories?, search?, sort? })`
- `getArticle(id)`
- `likeArticle(id)` / `dislikeArticle(id)` / `shareArticle(id)`
- `getCategories()` / `getCategory(slug)`
- `getCategoryArticles(slug, { page?, limit?, sort? })`
- `getStats()` / `getTrending(limit?)`
- `search(query, { page?, limit?, category?, categories? })`
- Рассылка: `subscribeNewsletter(email)`
- Админ: `getAdminStats()`, `getAdminArticles({ page?, limit?, status? })`, `createArticle(article)`, `updateArticle(id, article)`, `deleteArticle(id)`, `getAdminCategories()`

Пример (получить тренды на главной):
```ts
import { apiClient } from "@/lib/api"
const items = await apiClient.getTrending(10)
```

### Основные React‑компоненты
- `NewsCard` — карточка статьи
  - Пропсы: `{ article, featured? }`
- `ArticleInteractions` — кнопки лайк/дизлайк/поделиться/сохранить
  - Пропсы: `{ articleId, initialLikes, initialDislikes?, title, variant? }`
- `ViewTracker` — отметка просмотра статьи в сессии
  - Пропсы: `{ articleId }`
- Навигация по категориям: `CategoryNav`, `CategorySidebar`, `CategoryDrawer`
- Макеты/элементы UI: `Header`, `Footer`, `components/ui/*` (Button, Badge, Card, ...)
- Контекст: `AuthProvider` (`contexts/auth-context.tsx`) — хранит `user`, `isAdmin`, `login/logout`

Пример использования `ArticleInteractions`:
```tsx
<ArticleInteractions 
  articleId={article.id}
  initialLikes={article.likes_count}
  initialDislikes={article.dislikes_count}
  title={article.title}
/>
```

### Интеграция с Telegram‑ботом
Папка: `aiogram_bot/app.py` (черновик). Бот реализован на aiogram, при старт‑команде принимает аргумент c ID статьи и отправляет её содержимое.

- Сценарий: пользователь нажимает «Save» на сайте → открывается `https://t.me/NewsGuard_bot?start=<articleId>` → бот показывает новость внутри Telegram. Даже если бот «не готов», уже сейчас можно описывать в интерфейсе, что «новости можно смотреть и в Telegram‑боте».
- Настройка (черновик):
  - Заполнить `TOKEN` переменной окружения и не хранить в коде
  - Инициализировать TortoiseORM (URL БД — такой же, как у бекенда)
  - Запустить поллинг

Пример обработки `/start`:
```python
@dp.message(CommandStart())
async def start_handler(message: Message, command: CommandStart):
    if command.args:
        article = await Article.get_or_none(id=command.args)
        await message.answer(article.content if article else "Article not found")
```

Рекомендации по безопасности бота:
- Храните токен в переменных окружения (`TELEGRAM_BOT_TOKEN`)
- Ограничьте размер отдаваемого контента, применяйте HTML‑санитайзинг
- Логируйте ошибки, используйте вебхуки в продакшене

### Установка и запуск

#### Зависимости
- Python 3.11+, FastAPI, Tortoise‑ORM
- Node.js 20+, Next.js 15
- PostgreSQL (есть `docker-compose.yml`)

#### База данных
```bash
docker compose up -d postgres
```

#### Бекенд (из корня проекта)
```bash
uv run uvicorn src.main:app --host 0.0.0.0 --port 7070 --reload
```
Конфигурация: `src/config/config.py` (можно переопределить через `.env`). На старте создаются дефолтные категории.

#### Фронтенд
```bash
cd frontend/my-app
npm install
npm run dev
```
Откройте `http://localhost:3000`. Бекенд URL настраивается переменной `NEXT_PUBLIC_API_URL`.

#### Примеры окружения (.env)
```env
DATABASE_URL=postgres://postgres:password@localhost:5432/postgres
SECRET_KEY=change-me
NEXT_PUBLIC_API_URL=http://localhost:7070/api
FRONTEND_URL=http://localhost:3000
TELEGRAM_BOT_TOKEN=xxxxx:yyyyy
```

### Примечания по схемам (Pydantic)
- Статьи: `ArticleCreate`, `ArticleUpdate`, `ArticleResponse`, список `ArticleListResponse`
- Категории: `CategoryResponse`, `CategoryListResponse`, `CategoryWithArticlesResponse`
- Общее: `MessageResponse`, `StatsResponse`, `SearchResponse`
- Аутентификация: `UserSignup`, `UserSignin`, `TokenResponse`, `UserResponse`
- Рассылка: `NewsletterSubscribe`, `NewsletterResponse`

### Лимиты и параметры поиска
- Пагинация: `DEFAULT_PAGE_SIZE`, `MAX_PAGE_SIZE`
- Поиск: `SEARCH_MIN_QUERY_LENGTH`, `MAX_SEARCH_RESULTS`
- Тренды: `TRENDING_ARTICLES_LIMIT`

### Лицензии и безопасность
- Не храните секреты в репозитории
- Включите CORS для вашего фронтенда (`ALLOWED_ORIGINS`)
- JWT‑секрет (`SECRET_KEY`) замените в продакшене
