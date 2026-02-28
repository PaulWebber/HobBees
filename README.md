# HobBees 🐝

A full-stack hobby tracking application with custom categories and dynamic field schemas. Built with FastAPI, React, TypeScript, and MongoDB.

## Features

- 🔐 **Multi-user Authentication**: Secure JWT-based user registration and login
- 🎨 **Custom Hobby Categories**: Create hobbies with unlimited custom categories
- 📝 **Dynamic Field Schemas**: Define custom fields (text, number, date, boolean) for each category
- 🗂️ **Flexible Item Management**: Add items with your custom field structure
- 🐝 **Bee-Themed UI**: Yellow theme that turns red in edit mode
- ✏️ **Edit Mode**: Global edit toggle with unsaved changes protection
- 📱 **Responsive Design**: Tailwind CSS with mobile-friendly layout

## Technology Stack

### Backend
- **FastAPI** (0.109.0): Modern Python web framework
- **MongoDB** (7.0): NoSQL database with embedded documents
- **Motor**: Async MongoDB driver
- **JWT Authentication**: Secure token-based auth with python-jose
- **Pydantic v2**: Data validation and serialization

### Frontend
- **React** (18.2): UI library
- **TypeScript** (5.3): Type-safe JavaScript
- **Vite** (5.0): Fast build tool and dev server
- **React Router** (6.21): Client-side routing
- **Tailwind CSS** (3.4): Utility-first styling
- **Axios**: HTTP client with interceptors
- **React Hook Form**: Efficient form handling

### DevOps
- **Docker Compose**: Multi-container orchestration
- **MongoDB Volume**: Persistent data storage
- **Hot Reload**: Enabled for both backend and frontend

## Prerequisites

Before running the application, ensure you have:

- **Docker** (20.10+)
- **Docker Compose** (2.0+)

That's it! Docker handles all other dependencies.

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HobBees
   ```

2. **Configure environment variables**
   ```bash
   # Backend configuration
   cp backend/.env.example backend/.env
   
   # Frontend configuration  
   cp frontend/.env.example frontend/.env
   ```

3. **Update the backend `.env` file**
   
   Edit `backend/.env` and set a secure secret key:
   ```env
   SECRET_KEY=your-secure-random-secret-key-here
   ```
   
   Generate a secure key with:
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

4. **Start the application**
   ```bash
   docker-compose up --build
   ```

5. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:8000/api
   - **API Documentation**: http://localhost:8000/docs

## Development

### Running without Docker

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Project Structure

```
HobBees/
├── backend/
│   ├── app/
│   │   ├── models/          # Data models (User, Hobby)
│   │   ├── schemas/         # Pydantic schemas for validation
│   │   ├── repositories/    # Database operations
│   │   ├── services/        # Business logic
│   │   ├── routers/         # API endpoints
│   │   ├── config.py        # Configuration
│   │   ├── database.py      # MongoDB connection
│   │   └── main.py          # FastAPI application
│   ├── tests/               # Backend tests
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript definitions
│   └── package.json
├── docker-compose.yml
├── IMPLEMENTATION_NOTES.md  # Comprehensive documentation
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Hobbies
- `GET /api/hobbies` - List all hobbies for current user
- `POST /api/hobbies` - Create new hobby
- `GET /api/hobbies/{id}` - Get hobby by ID
- `PUT /api/hobbies/{id}` - Update hobby
- `DELETE /api/hobbies/{id}` - Delete hobby

### Categories
- `POST /api/hobbies/{id}/categories` - Add category to hobby
- `PUT /api/hobbies/{id}/categories/{name}` - Update category
- `DELETE /api/hobbies/{id}/categories/{name}` - Delete category

### Items
- `POST /api/hobbies/{id}/categories/{name}/items` - Add item to category
- `PUT /api/hobbies/{id}/categories/{name}/items/{item_id}` - Update item
- `DELETE /api/hobbies/{id}/categories/{name}/items/{item_id}` - Delete item

For detailed API documentation with examples, visit http://localhost:8000/docs when the app is running.

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Run with coverage
```bash
pytest --cov=app --cov-report=html
```

## Data Model

### Three-Tier Hierarchy
1. **Hobby**: Top-level container (e.g., "Fountain Pens")
2. **Category**: Group within hobby with custom schema (e.g., "Nib Collection")
3. **Items**: Individual entries matching category schema (e.g., specific nibs)

### Custom Field Types
- **Text**: String values
- **Number**: Numeric values
- **Date**: ISO date strings
- **Boolean**: True/false values

Each category defines its own schema with custom fields and validation rules.

## Architecture Highlights

- **Embedded Documents**: MongoDB stores full hobby hierarchy in single document for efficient queries
- **Dynamic Schemas**: Categories store field definitions enabling runtime form generation
- **Type Validation**: Backend validates item data against category schema
- **Edit Mode**: Global UI state with color theme switching (yellow → red)
- **Protected Routes**: Frontend enforces authentication with JWT interceptors

## Documentation

For comprehensive technical documentation, architecture decisions, deployment guides, and future enhancements, see [IMPLEMENTATION_NOTES.md](IMPLEMENTATION_NOTES.md).

## License

See [LICENSE](LICENSE) file for details.

---

**Built with 🐝 by the HobBees team**
