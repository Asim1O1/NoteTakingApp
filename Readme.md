# Note Taking Application

A modern full-stack note-taking application built with React (Vite), Node.js, and PostgreSQL that allows users to create, organize, and manage their notes with category-based filtering and secure authentication.

## Features

### Core Features

- **Note Management**: Create, read, update, and delete notes
- **Category System**: Organize notes with multiple categories and filter by category
- **Authentication**: Secure user registration and login system with email verification
- **Authorization**: Protected routes and API endpoints with refresh token support
- **Responsive UI**: Clean and mobile-friendly interface built with Tailwind CSS

### Additional Features

- **Email Verification**: Account verification system
- **Search Functionality**: Search notes by title or content
- **Sorting Options**: Sort notes by creation date, modification date, or alphabetically
- **Server-side Pagination**: Efficient handling of large note collections
- **Error Handling**: Comprehensive error management with user-friendly messages
- **API Documentation**: Interactive Swagger documentation

## Tech Stack

### Frontend

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful and accessible UI components
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API communication

### Backend

- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **Prisma**: Modern database ORM
- **PostgreSQL**: Robust relational database
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Zod**: TypeScript-first schema validation
- **Swagger**: API documentation
- **Winston**: Logging library

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd note-taking-app
   ```

2. **Install backend dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the server directory:

   ```env
   PORT=5000
   DATABASE_URL="postgresql://username:password@localhost:5432/notes_app"
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # Email configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password

   # Frontend URL
   FRONTEND_URL=http://localhost:5173
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma db push

   ```

5. **Start the backend server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**

   ```bash
   cd client
   npm install
   ```

2. **Start the frontend application**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## API Documentation

The API documentation is available via Swagger UI at `http://localhost:3301/api-docs` when the backend server is running.

### Authentication Endpoints

#### Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login User

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

#### Logout User

```
POST /api/auth/logout
Authorization: Bearer <token>
```

#### Refresh Token

```
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "string"
}
```

#### Verify Email

```
GET /api/auth/verify-email?token=<verification_token>
```

#### Resend Verification Email

```
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "string"
}
```

#### Get Current User

```
GET /api/auth/me
Authorization: Bearer <token>
```

### Notes Endpoints

#### Get All Notes

```
GET /api/notes?page=1&limit=10&category=string&search=string&sort=created_at
Authorization: Bearer <token>
```

#### Get Single Note

```
GET /api/notes/:id
Authorization: Bearer <token>
```

#### Create Note

```
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "content": "string",
  "categoryIds": ["string"]
}
```

#### Update Note

```
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "content": "string",
  "categoryIds": ["string"]
}
```

#### Delete Note

```
DELETE /api/notes/:id
Authorization: Bearer <token>
```

### Categories Endpoints

#### Get All Categories

```
GET /api/categories
Authorization: Bearer <token>
```

#### Create Category (Admin only)

```
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "color": "string"
}
```

#### Add Categories to Note

```
POST /api/categories/:noteId/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoryIds": ["string"]
}
```

## Database Schema (Prisma)

```prisma
model User {
  id                  String    @id @default(uuid())
  username            String    @unique
  email               String    @unique
  password            String
  role                UserRole  @default(USER)
  fullname            String?
  isVerified          Boolean   @default(false)
  refreshToken        String?
  refreshTokenExpires DateTime?
  notes               Note[]
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt

  @@map("users")
}

enum UserRole {
  USER
  ADMIN
}

model Note {
  id             String         @id @default(uuid())
  title          String
  content        String
  author         User           @relation(fields: [authorId], references: [id])
  authorId       String
  noteCategories NoteCategory[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  @@unique([title, authorId])
  @@map("notes")
}

model Category {
  id             String         @id @default(uuid())
  name           String         @unique
  noteCategories NoteCategory[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt

  @@map("categories")
}

model NoteCategory {
  note       Note     @relation(fields: [noteId], references: [id])
  noteId     String
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId String
  createdAt  DateTime @default(now())

  @@id([noteId, categoryId])
  @@map("note_categories")
}
```

### Database Design Decisions

#### User Management

- **UUID Primary Keys**: Using UUIDs instead of auto-incrementing integers for better security and distributed system compatibility
- **Role-Based Access**: `UserRole` enum supports future expansion to different permission levels
- **Refresh Token Storage**: Tokens stored directly in user table with expiration for simplicity
- **Unique Constraints**: Both username and email must be unique across the system

#### Note Management

- **Author Relationship**: Foreign key to User table ensures data integrity
- **Unique Title Per User**: Prevents duplicate note titles for the same user while allowing different users to have notes with the same title
- **Content Field**: Required string field (not nullable) to ensure all notes have content

#### Category System

- **Global Categories**: Categories are shared across all users (admin-only creation)
- **Many-to-Many Relationship**: Implemented through `NoteCategory` junction table
- **Unique Category Names**: Global uniqueness prevents category duplication

#### Junction Table Design

- **Composite Primary Key**: `[noteId, categoryId]` prevents duplicate category assignments
- **Cascade Deletion**: When notes or categories are deleted, related junction records are automatically removed
- **Creation Timestamp**: Track when categories were added to notes

## Project Structure

```
note-taking-app/
├── server/ (Backend)
│   ├── node_modules/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── src/
│   │   ├── constants/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── category/
│   │   │   └── notes/
│   │   ├── middlewares/
│   │   ├── scripts/
│   │   ├── utils/
│   │   ├── validations/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── swagger.js
├── client/ (Frontend)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── layout/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── sections/
│   │   ├── stores/ (Zustand)
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── components.json (shadcn config)
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

### Backend Structure (Feature-Based)

The backend follows a feature-based architecture where each domain is organized in its own folder:

```
src/
├── constants/          # Application constants and enums
├── features/           # Feature-based modules
│   ├── auth/          # Authentication feature
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── models/
│   ├── category/      # Category management feature
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── models/
│   └── notes/         # Notes management feature
│       ├── controllers/
│       ├── services/
│       ├── routes/
│       └── models/
├── middlewares/       # Express middlewares (auth, validation, error handling)
├── scripts/          # Database seeding and utility scripts
├── utils/            # Utility functions and helpers
├── validations/      # Zod validation schemas
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

### Frontend Structure (Domain-Driven)

The frontend is organized by domain and functionality:

```
src/
├── assets/           # Static assets (images, icons)
├── components/       # Reusable UI components
│   ├── ui/          # shadcn/ui components
│   ├── forms/       # Form components
│   └── common/      # Common components
├── config/          # Configuration files
├── layout/          # Layout components
├── lib/             # Utility libraries and helpers
├── pages/           # Page components
├── routes/          # Route configuration
├── sections/        # Page sections and feature components
├── stores/          # Zustand state management
├── App.jsx          # Main app component
├── index.css        # Global styles (Tailwind)
└── main.jsx         # Application entry point
```

## Engineering Decisions

### Architecture Choices

- **Vite**: Chosen for faster development and build times compared to Create React App
- **Tailwind CSS + shadcn/ui**: Provides utility-first styling with pre-built accessible components
- **Zustand**: Lightweight state management without the complexity of Redux
- **Prisma**: Modern ORM with excellent TypeScript support and type safety
- **PostgreSQL**: Robust relational database with better performance than MySQL
- **Zod**: Runtime validation with TypeScript inference for better type safety

### Security Implementations

- **JWT with Refresh Tokens**: Secure authentication with token rotation
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Zod validation on both frontend and backend
- **Email Verification**: Account verification to prevent spam registrations
- **CORS Protection**: Configured for secure cross-origin requests

### Performance Optimizations

- **Server-side Pagination**: Efficient handling of large datasets
- **Database Indexing**: Optimized queries for search and filtering
- **Lazy Loading**: React components loaded as needed
- **Vite's Fast Refresh**: Instant updates during development

## Logging (Winston)

Comprehensive logging is implemented with different log levels:

- **Error**: Application errors and exceptions
- **Warn**: Warning messages
- **Info**: General information about app execution
- **Debug**: Detailed debug information

## Development

### Available Scripts

#### Backend

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations

#### Frontend

- `npm run dev` - Start development server

## API Documentation

Interactive API documentation is available at `http://localhost:3301/api-docs` when running the backend server. The documentation includes:

- All available endpoints
- Request/response schemas
- Authentication requirements
- Try-it-out functionality

## Assumptions Made During Development

### User Requirements

- **Single User Per Account**: Each user account is assumed to be used by one person only
- **Email Uniqueness**: Email addresses are unique across the system and serve as the primary identifier
- **Note Ownership**: Users can only access, modify, and delete their own notes
- **Category System**: Categories are global and shared across all users, with admin-only creation rights
- **Content Format**: Notes support plain text content with basic formatting assumptions

### Technical Assumptions

- **Authentication Flow**: Users must verify their email before accessing the full application
- **Token Management**: Single refresh token per user stored in database with expiration
- **Database Performance**: PostgreSQL is assumed to handle the expected user load efficiently
- **Network Reliability**: API calls may fail, so retry mechanisms and proper error handling are implemented
- **Browser Compatibility**: Modern browsers with ES6+ support are assumed
- **UUID Usage**: UUIDs are used for all primary keys for better security and scalability
- **Role-Based Access**: User roles (USER/ADMIN) determine access to certain features like category creation

### Business Logic Assumptions

- **Note Lifecycle**: Notes can be created, updated, and deleted without versioning or history tracking
- **Category Limitations**: Each note can have multiple categories, but categories cannot be nested
- **Search Functionality**: Search is case-insensitive and matches both title and content
- **Pagination**: Default page size is 10 items, which is assumed to be optimal for user experience
- **User Roles**: Only admin users can create categories; regular users can only assign existing categories
- **Note Uniqueness**: Users cannot have multiple notes with the same title (enforced by unique constraint)
- **Content Requirement**: All notes must have content; empty notes are not allowed
- **Refresh Token Management**: Single refresh token per user (new login invalidates previous token)

### Security Assumptions

- **Email Verification**: Email verification is mandatory and emails are assumed to be delivered successfully
- **Password Security**: Users are responsible for choosing strong passwords (minimum 6 characters enforced)
- **HTTPS in Production**: The application will be deployed with HTTPS in production environments
- **Rate Limiting**: API rate limiting is handled at the infrastructure level (not application level)
- **Data Privacy**: User data is private and not shared between different user accounts

### Performance Assumptions

- **Concurrent Users**: The application is designed to handle moderate concurrent usage (100-1000 users)
- **Note Size**: Individual notes are assumed to be relatively small (< 1MB of text content)
- **Database Scaling**: PostgreSQL can handle the expected read/write operations without additional optimization
- **Client-Side Caching**: Browser caching is leveraged for static assets and API responses where appropriate

### Development Assumptions

- **Environment Setup**: Developers have access to PostgreSQL and can run Node.js applications locally
- **Testing Coverage**: Unit and integration tests cover critical paths; end-to-end tests cover user flows
- **Documentation**: API documentation through Swagger is sufficient for frontend development
- **Logging**: Winston logging provides adequate monitoring and debugging capabilities
- **Error Handling**: Comprehensive error handling covers most edge cases and provides meaningful user feedback

### Deployment Assumptions

- **Environment Variables**: All sensitive configuration is managed through environment variables
- **Database Migrations**: Prisma migrations are run as part of the deployment process
- **Static Assets**: Frontend build artifacts are served efficiently (CDN or static file server)
- **Monitoring**: Application monitoring and alerting are handled by external services
- **Backup Strategy**: Database backups are managed at the infrastructure level

### Future Scalability Assumptions

- **Microservices**: The current monolithic structure can be refactored into microservices if needed
- **Real-time Features**: WebSocket support can be added for real-time collaboration without major refactoring
- **Mobile Support**: The responsive design assumptions allow for future mobile app development
- **API Versioning**: The current API structure supports versioning for backward compatibility
- **Third-party Integrations**: The architecture supports integration with external services (file storage, analytics, etc.)

## Author

This project was created by **Asim Khadka** as a full-stack note-taking application built with modern technologies like React, Node.js, and PostgreSQL.
GitHub: [@asimhkhadka](https://github.com/Asim1O1)

---

Built with ❤️ using React, Node.js, and PostgreSQL
