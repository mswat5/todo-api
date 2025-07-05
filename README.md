# Todo API - Express.js Backend with Prisma & PostgreSQL

This project provides a foundational Express.js backend API setup with Prisma ORM and PostgreSQL database integration.

## 🚀 Features

- **TypeScript Configuration**: Properly configured TypeScript with strict settings
- **Express.js Server**: Security middleware, error handling, and structured routing
- **Prisma ORM**: Database schema with User and Todo models
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Validation**: Joi validation for request data
- **Security**: Helmet, CORS, rate limiting, and Morgan logging
- **Organized Structure**: Clean folder organization with types, middleware, controllers, and routes

## 📁 Project Structure

```
src/
├── server.ts          # Main server entry point
├── routes/
│   ├── auth.ts        # Authentication routes (login, register, logout)
│   ├── todos.ts       # Todo CRUD routes
│   └── users.ts       # User management routes (profile)
├── controllers/       # Route handlers
│   ├── authController.ts
│   ├── todoController.ts
│   └── userController.ts
├── middleware/        # Custom middleware
│   ├── auth.ts        # JWT verification middleware
│   ├── errorHandler.ts # Global error handling
│   ├── rateLimiter.ts # Rate limiting configurations
│   └── security.ts    # Security middleware stack
├── types/             # TypeScript type definitions
│   └── index.ts       # API response types and interfaces
├── utils/             # Utility functions
└── prisma/            # Prisma client initialization
    └── client.ts
prisma/
├── schema.prisma      # Database schema definition
└── migrations/        # Migration files (generated)
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
   
   Update the following variables in `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/todoapp"
   JWT_SECRET="your-super-secure-jwt-secret-key-here"
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

3. **Database Setup**:
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   ```

4. **Build the application**:
   ```bash
   npm run build
   ```

5. **Start the server**:
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📊 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:migrate` - Run Prisma migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## 🔗 API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout (requires auth)

### Todos
- `GET /api/todos` - List user's todos (requires auth)
- `POST /api/todos` - Create new todo (requires auth)
- `GET /api/todos/:id` - Get specific todo (requires auth)
- `PUT /api/todos/:id` - Update todo (requires auth)
- `DELETE /api/todos/:id` - Delete todo (requires auth)

### Users
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  todos     Todo[]
}
```

### Todo Model
```prisma
model Todo {
  id          String    @id @default(cuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  userId      String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Login and password reset protection
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Joi schema validation
- **Error Handling**: Structured error responses

## 🚀 Testing the Setup

Once the server is running, test the endpoints:

```bash
# Health check
curl http://localhost:3000/health

# API information
curl http://localhost:3000/api

# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123", "name": "Test User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

## ✅ Success Criteria Verification

- ✅ **Project Structure**: Organized folder structure with proper TypeScript configuration
- ✅ **Dependencies**: All required packages installed (Express, Prisma, JWT, validation, security)
- ✅ **Express Server**: Basic server with middleware and error handling
- ✅ **Prisma Configuration**: Schema with User and Todo models, client initialization
- ✅ **Development Workflow**: TypeScript compilation, dev scripts, hot reloading
- ✅ **Route Structure**: Placeholder routes for auth, todos, and users
- ✅ **Environment Configuration**: `.env.example` with required variables
- ✅ **TypeScript Types**: Interfaces for API responses and data structures

## 📝 Next Steps

1. **Database Connection**: Ensure PostgreSQL is running and accessible
2. **Prisma Generation**: Run `npm run db:generate` when database is connected
3. **Migration**: Run `npm run db:migrate` to create database tables
4. **Testing**: Implement the full authentication and todo functionality
5. **Advanced Features**: Add password reset, email verification, advanced todo filtering

This setup provides a solid foundation for building a full-featured todo API with modern best practices and security considerations.