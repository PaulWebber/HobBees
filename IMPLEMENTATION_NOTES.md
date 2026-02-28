# HobBees Application - Implementation Notes

**Version:** 1.0.0  
**Date:** February 28, 2026  
**Status:** Initial Implementation Complete

This document provides comprehensive technical details about the HobBees application architecture, implementation decisions, and guidance for future development work.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Data Models](#data-models)
5. [API Endpoints](#api-endpoints)
6. [Frontend Architecture](#frontend-architecture)
7. [Development Workflow](#development-workflow)
8. [Deployment](#deployment)
9. [Testing](#testing)
10. [Future Enhancements](#future-enhancements)
11. [Troubleshooting](#troubleshooting)

---

## Project Overview

HobBees is a full-stack web application designed to track hobbies with custom categories and items. The application features:

- **Multi-user support** with authentication (JWT-based)
- **Dynamic custom fields** for each hobby category (user-defined schemas)
- **Three-tier data hierarchy**: Hobby → Category → Sub-Category Items
- **Responsive bee-themed UI** with a distinctive edit mode (yellow/black → red/black)
- **Real-time form generation** based on custom field schemas

### Key Features

- User registration and authentication
- Create, edit, and delete hobbies
- Add custom categories to hobbies
- Define custom fields for each category (text, number, date, boolean)
- Add/edit/delete items within categories
- Visual distinction between view and edit modes
- Floating save/cancel buttons in edit mode
- Burger menu with contextual options

---

## Architecture

### High-Level Overview

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │  HTTP   │   Backend   │  Async  │   MongoDB   │
│   (React)   │ ◄─────► │  (FastAPI)  │ ◄─────► │  (Database) │
└─────────────┘         └─────────────┘         └─────────────┘
```

### Backend Architecture (FastAPI)

```
app/
├── main.py                    # Application entry point
├── config.py                  # Configuration management
├── database.py                # MongoDB connection
├── models/                    # Pydantic data models
│   ├── user.py
│   └── hobby.py
├── schemas/                   # Request/Response schemas
│   ├── auth.py
│   └── hobby.py
├── repositories/              # Database access layer
│   ├── user_repository.py
│   └── hobby_repository.py
├── services/                  # Business logic layer
│   ├── auth_service.py
│   └── hobby_service.py
├── routers/                   # API route handlers
│   ├── auth.py
│   └── hobbies.py
├── middleware/                # Custom middleware
│   └── auth_middleware.py
└── utils/                     # Helper utilities
    └── security.py
```

**Layered Architecture:**
- **Routes** → Handle HTTP requests/responses
- **Services** → Business logic and validation
- **Repositories** → Database operations
- **Models** → Data structure definitions

### Frontend Architecture (React + TypeScript)

```
src/
├── App.tsx                    # Root component with routing
├── main.tsx                   # Application entry point
├── types/                     # TypeScript type definitions
│   ├── user.ts
│   ├── hobby.ts
│   └── editMode.ts
├── services/                  # API service layer
│   ├── api.ts
│   ├── authService.ts
│   └── hobbyService.ts
├── store/context/             # React Context for state
│   ├── AuthContext.tsx
│   └── EditModeContext.tsx
├── hooks/                     # Custom React hooks
│   └── useHobbies.ts
├── components/
│   ├── common/                # Reusable components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   └── ProtectedRoute.tsx
│   ├── layout/                # Layout components
│   │   ├── BurgerMenu.tsx
│   │   ├── Sidebar.tsx
│   │   └── FloatingActions.tsx
│   ├── forms/                 # Dynamic form system
│   │   ├── FieldRenderer.tsx
│   │   ├── DynamicForm.tsx
│   │   └── SchemaBuilder.tsx
│   ├── hobby/                 # Hobby components
│   │   └── HobbyView.tsx
│   └── category/              # Category components
│       └── CategoryBox.tsx
└── pages/                     # Page-level components
    ├── Login.tsx
    └── Dashboard.tsx
```

---

## Technology Stack

### Backend
- **Framework:** FastAPI 0.109.0
- **Language:** Python 3.11+
- **Database:** MongoDB 7.0 (with Motor async driver)
- **Authentication:** JWT (python-jose)
- **Password Hashing:** bcrypt (via passlib)
- **Validation:** Pydantic 2.5+
- **Testing:** pytest with pytest-asyncio

### Frontend
- **Framework:** React 18.2
- **Language:** TypeScript 5.3
- **Build Tool:** Vite 5.0
- **Routing:** React Router DOM 6.21
- **HTTP Client:** Axios 1.6
- **Forms:** React Hook Form 7.49
- **Styling:** Tailwind CSS 3.4
- **State Management:** React Context API
- **Testing:** Vitest + React Testing Library

### DevOps
- **Containerization:** Docker & Docker Compose
- **Web Server:** Uvicorn (ASGI server)

---

## Data Models

### User Model

```python
{
  "_id": ObjectId,
  "username": str,          # Unique
  "email": str,             # Unique
  "hashed_password": str,
  "is_active": bool,
  "created_at": datetime,
  "updated_at": datetime
}
```

### Hobby Model

```python
{
  "_id": ObjectId,
  "user_id": str,           # Reference to user
  "name": str,
  "description": str?,
  "categories": [           # Array of Category objects
    {
      "name": str,
      "schema": {
        "category_name": str,
        "fields": [         # Array of field definitions
          {
            "name": str,
            "field_type": "text" | "number" | "date" | "boolean",
            "required": bool
          }
        ]
      },
      "items": [            # Array of item objects
        {
          "id": str,
          "data": {         # Dynamic fields based on schema
            "Brand": "...",
            "Size": 10,
            ... (custom fields)
          },
          "created_at": datetime,
          "updated_at": datetime
        }
      ],
      "created_at": datetime,
      "updated_at": datetime
    }
  ],
  "created_at": datetime,
  "updated_at": datetime
}
```

### Key Design Decisions

1. **Embedded Documents:** Categories and items are embedded within the hobby document rather than separate collections for efficient querying of the entire hierarchy.

2. **Dynamic Schema Storage:** Each category stores its own schema definition, enabling runtime form generation without code changes.

3. **User Isolation:** All hobbies are scoped to a user via `user_id`, ensuring complete data isolation between users.

4. **Field Type Support:** Four field types provide flexibility while maintaining simplicity:
   - `text`: String values
   - `number`: Integer or decimal values
   - `date`: ISO date strings
   - `boolean`: True/false values

---

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response: 201 Created
{
  "id": "...",
  "username": "john_doe",
  "email": "john@example.com",
  "is_active": true
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePassword123!"
}

Response: 200 OK
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "...",
  "username": "john_doe",
  "email": "john@example.com",
  "is_active": true
}
```

### Hobby Endpoints

All hobby endpoints require authentication via Bearer token.

#### Create Hobby
```
POST /api/hobbies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Slingshot",
  "description": "Tracking slingshot equipment"
}

Response: 201 Created
{
  "id": "...",
  "user_id": "...",
  "name": "Slingshot",
  "description": "Tracking slingshot equipment",
  "categories": [],
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

#### Get All Hobbies
```
GET /api/hobbies
Authorization: Bearer <token>

Response: 200 OK
[
  { ... hobby objects ... }
]
```

#### Get Hobby by ID
```
GET /api/hobbies/{hobby_id}
Authorization: Bearer <token>

Response: 200 OK
{ ... hobby object ... }
```

#### Update Hobby
```
PUT /api/hobbies/{hobby_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description"
}

Response: 200 OK
{ ... updated hobby object ... }
```

#### Delete Hobby
```
DELETE /api/hobbies/{hobby_id}
Authorization: Bearer <token>

Response: 204 No Content
```

### Category Endpoints

#### Add Category to Hobby
```
POST /api/hobbies/{hobby_id}/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Latex",
  "fields": [
    {
      "name": "Brand",
      "field_type": "text",
      "required": true
    },
    {
      "name": "Thickness",
      "field_type": "number",
      "required": true
    },
    {
      "name": "Quantity",
      "field_type": "number",
      "required": false
    }
  ]
}

Response: 201 Created
{ ... updated hobby object with new category ... }
```

#### Update Category
```
PUT /api/hobbies/{hobby_id}/categories/{category_name}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Category Name",
  "fields": [ ... ]
}

Response: 200 OK
{ ... updated hobby object ... }
```

#### Delete Category
```
DELETE /api/hobbies/{hobby_id}/categories/{category_name}
Authorization: Bearer <token>

Response: 200 OK
{ ... updated hobby object ... }
```

### Item Endpoints

#### Add Item to Category
```
POST /api/hobbies/{hobby_id}/categories/{category_name}/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "data": {
    "Brand": "Snipersling",
    "Thickness": 0.4,
    "Quantity": 4
  }
}

Response: 201 Created
{ ... updated hobby object ... }
```

#### Update Item
```
PUT /api/hobbies/{hobby_id}/categories/{category_name}/items/{item_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "data": {
    "Brand": "Snipersling",
    "Thickness": 0.45,
    "Quantity": 3
  }
}

Response: 200 OK
{ ... updated hobby object ... }
```

#### Delete Item
```
DELETE /api/hobbies/{hobby_id}/categories/{category_name}/items/{item_id}
Authorization: Bearer <token>

Response: 200 OK
{ ... updated hobby object ... }
```

---

## Frontend Architecture

### State Management

The application uses React Context API for global state management:

1. **AuthContext**: Manages user authentication state
   - User information
   - JWT token
   - Login/logout functions
   - Authentication status

2. **EditModeContext**: Manages edit mode state
   - Edit mode toggle
   - Unsaved changes tracking
   - Save/cancel handlers

### Component Hierarchy

```
App
├── Router
    ├── Login (public route)
    └── Dashboard (protected route)
        ├── BurgerMenu
        ├── Sidebar
        │   └── HobbyTab (multiple)
        ├── HobbyView
        │   └── CategoryBox (multiple)
        │       ├── DynamicForm (modal)
        │       └── Items List
        └── FloatingActions (edit mode only)
```

### Dynamic Form System

The dynamic form system is the core innovation of HobBees:

1. **SchemaBuilder**: UI for users to define custom fields
   - Field name input
   - Field type selection (text, number, date, boolean)
   - Required checkbox
   - Add/remove fields

2. **FieldRenderer**: Renders appropriate input based on field type
   - Text → text input
   - Number → number input with spinners
   - Date → date picker
   - Boolean → checkbox

3. **DynamicForm**: Generates entire forms from schema definitions
   - Uses React Hook Form for validation
   - Dynamically creates fields based on schema
   - Handles form submission

### Theme System

The application features a bee-themed design with two modes:

**Normal Mode:**
- Primary color: Bee Yellow (#FFD700)
- Secondary: Black (#1A1A1A)
- Accent: Bee Yellow Dark (#FFA500)

**Edit Mode:**
- Primary color: Bee Red (#DC2626)
- Secondary: Black (#1A1A1A)
- Accent: Bee Red Dark (#991B1B)

The theme automatically switches when entering edit mode, providing clear visual feedback.

### Routing

Protected routes require authentication:
- `/login` - Public login page
- `/` - Protected dashboard (redirects to login if not authenticated)

The `ProtectedRoute` component wraps protected routes and handles authentication checks.

---

## Development Workflow

### Initial Setup

1. **Clone and navigate to project:**
   ```bash
   cd HobBees
   ```

2. **Create environment files:**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   # Edit backend/.env and set SECRET_KEY
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

3. **Start with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/api/docs

### Local Development (without Docker)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**MongoDB:**
Ensure MongoDB is running locally on port 27017, or update `MONGODB_URL` in backend `.env`.

### Development Commands

**Backend:**
- Run tests: `pytest`
- Format code: `black app/`
- Type checking: `mypy app/`

**Frontend:**
- Run dev server: `npm run dev`
- Build production: `npm run build`
- Run tests: `npm test`
- Lint: `npm run lint`

---

## Deployment

### Production Considerations

1. **Environment Variables:**
   - Change `SECRET_KEY` to a secure random value
   - Set `DEBUG=False` in backend
   - Update `CORS_ORIGINS` to production domains
   - Use environment-specific MongoDB URLs

2. **Security:**
   - Enable HTTPS
   - Use secure password policies
   - Implement rate limiting
   - Enable MongoDB authentication
   - Set up proper CORS policies

3. **Database:**
   - Use MongoDB Atlas or managed MongoDB
   - Enable backups
   - Set up proper indexes
   - Monitor performance

4. **Backend:**
   - Use production ASGI server (uvicorn with workers)
   - Enable logging and monitoring
   - Set up health checks
   - Use reverse proxy (nginx)

5. **Frontend:**
   - Build production bundle: `npm run build`
   - Serve static files via CDN
   - Enable caching headers
   - Minify and optimize assets

### Docker Production Deployment

Update `docker-compose.yml` for production:
- Remove volume mounts (use built images)
- Set restart policies
- Configure logging drivers
- Use Docker secrets for sensitive data
- Add health checks

---

## Testing

### Backend Tests

Location: `backend/tests/`

**Test Structure:**
- `conftest.py`: Pytest fixtures and configuration
- `test_auth.py`: Authentication tests
- `test_hobbies.py`: Hobby CRUD tests (to be added)

**Run Tests:**
```bash
cd backend
pytest
pytest -v  # Verbose output
pytest --cov=app  # With coverage
```

**Key Test Fixtures:**
- `test_db`: Test database instance
- `test_user_data`: Sample user data
- `test_hobby_data`: Sample hobby data

### Frontend Tests

Location: `frontend/src/tests/` (to be added)

**Test Files:**
- Component tests
- Integration tests
- E2E tests (optional)

**Run Tests:**
```bash
cd frontend
npm test
```

### Test Coverage Goals

- Backend: > 80% coverage for core functionality
- Frontend: > 70% coverage for critical components
- Integration: Key user flows (login, create hobby, add category)

---

## Future Enhancements

### Planned Features

1. **SSO Integration**
   - Google OAuth
   - Microsoft Azure AD
   - Configurable SSO providers

2. **Data Export/Import**
   - Export hobbies to JSON/CSV
   - Import from JSON
   - Bulk operations

3. **Search and Filtering**
   - Search across all hobbies
   - Filter items by field values
   - Sort categories and items

4. **Images and File Uploads**
   - Add images to items
   - File storage (S3 or GridFS)
   - Image thumbnails

5. **Sharing and Collaboration**
   - Share hobbies with other users
   - Read-only sharing
   - Collaborative editing

6. **Mobile App**
   - React Native app
   - Offline support
   - Push notifications

7. **Advanced Fields**
   - Multi-select fields
   - File upload fields
   - Rich text fields
   - Custom validation rules

8. **Analytics and Reports**
   - Usage statistics
   - Inventory reports
   - Data visualizations

9. **Tagging System**
   - Add tags to items
   - Tag-based filtering
   - Tag clouds

10. **Backup and Restore**
    - Automated backups
    - Point-in-time recovery
    - User-triggered exports

### Technical Improvements

1. **Performance Optimization**
   - Implement caching (Redis)
   - Optimize MongoDB queries
   - Lazy loading for large datasets
   - Image optimization

2. **Enhanced Security**
   - Two-factor authentication
   - Session management improvements
   - API rate limiting per user
   - Audit logging

3. **Better Developer Experience**
   - GraphQL API (alternative to REST)
   - OpenAPI improvements
   - Better error messages
   - Development seed data

4. **UI/UX Enhancements**
   - Dark mode
   - Customizable themes
   - Keyboard shortcuts
   - Accessibility improvements (WCAG 2.1)

---

## Troubleshooting

### Common Issues

#### MongoDB Connection Failed
**Symptom:** Backend can't connect to MongoDB  
**Solution:**
- Ensure MongoDB is running
- Check `MONGODB_URL` in `.env`
- Verify Docker network connectivity
- Check MongoDB logs: `docker logs hobbees-mongodb`

#### Frontend Can't Connect to Backend
**Symptom:** API calls failing with CORS or network errors  
**Solution:**
- Verify backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS origins are configured correctly
- Check browser console for specific errors

#### Authentication Errors
**Symptom:** 401 Unauthorized responses  
**Solution:**
- Check JWT token is being sent in headers
- Verify token hasn't expired (7 days default)
- Ensure `SECRET_KEY` is consistent
- Clear localStorage and re-login

#### Docker Build Failures
**Symptom:** Docker containers fail to build  
**Solution:**
- Delete old containers: `docker-compose down`
- Rebuild from scratch: `docker-compose build --no-cache`
- Check Dockerfile syntax
- Verify network connectivity for downloads

#### Edit Mode Not Working
**Symptom:** Edit mode doesn't change UI  
**Solution:**
- Check EditModeContext is properly wrapped
- Verify theme classes in Tailwind config
- Check browser console for React errors
- Clear browser cache

### Debug Mode

Enable debug logging:

**Backend:**
```python
# In config.py
DEBUG = True
```

**Frontend:**
```typescript
// In api.ts, add request/response logging
api.interceptors.request.use(config => {
  console.log('Request:', config)
  return config
})
```

---

## Best Practices

### Code Style

**Backend (Python):**
- Follow PEP 8
- Use type hints
- Document functions with docstrings
- Keep functions small and focused
- Use async/await consistently

**Frontend (TypeScript):**
- Use functional components with hooks
- Properly type all props and state
- Extract reusable logic to custom hooks
- Keep components focused (single responsibility)
- Use meaningful variable names

### Git Workflow

- Create feature branches from `main`
- Use descriptive commit messages
- Keep commits atomic and focused
- Review code before merging
- Tag releases with semantic versioning

### Security Best Practices

- Never commit `.env` files
- Rotate secrets regularly
- Use environment variables for config
- Validate all user inputs
- Sanitize data before storage
- Use parameterized queries (Pydantic handles this)
- Keep dependencies updated

---

## Architecture Decisions Record (ADR)

### ADR-001: Use MongoDB with Embedded Documents

**Decision:** Store categories and items as embedded documents within hobby documents.

**Rationale:**
- Simplifies queries for full hobby hierarchy
- Better performance for read operations
- Natural fit for the data model
- Reduces need for joins

**Consequences:**
- Document size limits (16MB)
- Updates require updating entire document
- Can't query items across hobbies easily

### ADR-002: JWT for Authentication

**Decision:** Use JWT tokens with 7-day expiration.

**Rationale:**
- Stateless authentication
- Scalable (no server-side session storage)
- Works well with single-page applications
- Standard and well-supported

**Consequences:**
- Can't invalidate tokens before expiration
- Token size in headers
- Need to handle token refresh (future enhancement)

### ADR-003: React Context API for State

**Decision:** Use React Context API instead of Redux.

**Rationale:**
- Simpler for application complexity
- No external dependencies
- Built into React
- Sufficient for current requirements

**Consequences:**
- May need to migrate to Redux for complex state
- Less tooling and devtools
- Manual optimization needed

### ADR-004: TypeScript for Frontend

**Decision:** Use TypeScript instead of JavaScript.

**Rationale:**
- Type safety reduces bugs
- Better IDE support
- Easier refactoring
- Self-documenting code

**Consequences:**
- Steeper learning curve
- More verbose code
- Compilation step required

### ADR-005: Tailwind CSS for Styling

**Decision:** Use Tailwind CSS utility-first framework.

**Rationale:**
- Rapid development
- Consistent design system
- Small production bundle
- No CSS file organization needed

**Consequences:**
- Longer className strings
- Learning curve for utility classes
- Pure CSS skills less utilized

---

## Contact and Resources

**Project Repository:** d:\gits\HobBees  
**Documentation:** This file (IMPLEMENTATION_NOTES.md)  
**Original Plan:** plan.md

### External Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Document Version:** 1.0  
**Last Updated:** February 28, 2026  
**Maintained By:** Development Team
