## **API Endpoints Documentation**

### **Main Backend API URL:**

```plaintext
http://localhost:7070/api
```

*Set via environment variable: `NEXT_PUBLIC_API_URL`*

### **All API Endpoints Used:**

#### **📰 Articles Endpoints:**

- `GET /api/articles` - Get all articles with pagination and filtering

- Query params: `page`, `limit`, `category`, `search`, `sort`



- `GET /api/articles/{id}` - Get single article by ID
- `GET /api/categories/{slug}/articles` - Get articles for specific category


#### **📂 Categories Endpoints:**

- `GET /api/categories` - Get all categories with article counts
- `GET /api/categories/{slug}` - Get category details by slug


#### **📊 Statistics Endpoints:**

- `GET /api/stats` - Get platform statistics (total articles, users, accuracy rate)
- `GET /api/trending` - Get trending articles

- Query params: `limit`





#### **🔍 Search Endpoints:**

- `GET /api/search` - Search articles

- Query params: `q`, `page`, `limit`, `category`





#### **📧 Newsletter Endpoints:**

- `POST /api/newsletter` - Subscribe to newsletter

- Body: `{ "email": "user@example.com" }`





#### **👨‍💼 Admin Endpoints:**

- `GET /api/admin/stats` - Get admin dashboard statistics
- `GET /api/admin/articles` - Get articles for admin management

- Query params: `page`, `limit`, `status`



- `POST /api/admin/articles` - Create new article
- `PUT /api/admin/articles/{id}` - Update existing article
- `DELETE /api/admin/articles/{id}` - Delete article


#### **🛡️ Moderation Endpoints:**

- `GET /api/admin/moderation/flagged` - Get flagged content
- `POST /api/admin/moderation/{id}/approve` - Approve flagged content
- `POST /api/admin/moderation/{id}/reject` - Reject flagged content


### **📁 Category Pages Created:**

All category pages are now available at:

- `/category/politics`
- `/category/technology`
- `/category/business`
- `/category/health`
- `/category/science`
- `/category/environment`
- `/category/sports`
- `/category/entertainment`


### ** Data Flow:**

1. **All hardcoded data removed** - replaced with API calls
2. **Numbers set to 0** - will be populated from backend responses
3. **Loading states** - Added for better UX while fetching data
4. **Error handling** - Graceful fallbacks when API calls fail
5. **Real-time updates** - Data refreshes from backend on each page load


The website is now **fully backend-supported** and ready to receive data from your Python backend API. All endpoints are implemented and the frontend will automatically display the data once your backend is running on `http://localhost:7070/api`.