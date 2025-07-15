import swaggerJSDoc from "swagger-jsdoc";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Note Taking App API",
      version: "1.0.0",
      description: "API documentation for the Note Taking App",
    },
    components: {
      schemas: {
        RegisterInput: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: {
              type: "string",
              minLength: 3,
              maxLength: 20,
              pattern: "^[a-zA-Z0-9_]+$",
              description:
                "Username can only contain letters, numbers, and underscores",
              example: "john_doe",
            },
            email: {
              type: "string",
              format: "email",
              maxLength: 100,
              example: "john@example.com",
            },
            password: {
              type: "string",
              minLength: 8, // Assuming PASSWORD_MIN_LENGTH is 8
              pattern:
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
              description:
                "Must contain at least one uppercase, one lowercase, one number and one special character",
              example: "SecurePassword123!",
            },
            fullname: {
              type: "string",
              minLength: 2,
              maxLength: 50,
              pattern: "^[a-zA-Z\\s'-]+$",
              description:
                "Can only contain letters, spaces, hyphens, and apostrophes",
              example: "John Doe",
              nullable: true,
            },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              maxLength: 100,
              example: "john@example.com",
            },
            password: {
              type: "string",
              minLength: 8,
              pattern:
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
              example: "SecurePassword123!",
            },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            accessToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            },
            user: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                  example: "clx4a9z8e0000v2xk0q1q2w3r",
                },
                username: {
                  type: "string",
                  example: "john_doe",
                },
                email: {
                  type: "string",
                  example: "john@example.com",
                },
                fullname: {
                  type: "string",
                  example: "John Doe",
                  nullable: true,
                },
              },
            },
          },
        },

        Note: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "clx4a9z8e0000v2xk0q1q2w3r",
            },
            title: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              example: "My First Note",
            },
            content: {
              type: "string",
              minLength: 1,
              example: "This is the content of my first note.",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z",
            },
            categories: {
              type: "array",
              items: {
                type: "string",
                format: "uuid",
              },
              example: [
                "clx4a9z8e0000v2xk0q1q2w3r",
                "clx4a9z8e0000v2xk0q1q2w3s",
              ],
            },
          },
        },
        CreateNoteInput: {
          type: "object",
          required: ["title", "content"],
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              example: "My First Note",
            },
            content: {
              type: "string",
              minLength: 1,
              example: "This is the content of my first note.",
            },
            categories: {
              type: "array",
              items: {
                type: "string",
                format: "uuid",
              },
              example: [
                "clx4a9z8e0000v2xk0q1q2w3r",
                "clx4a9z8e0000v2xk0q1q2w3s",
              ],
            },
          },
        },
        UpdateNoteInput: {
          type: "object",
          properties: {
            title: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              example: "Updated Note Title",
            },
            content: {
              type: "string",
              minLength: 1,
              example: "Updated content of my note.",
            },
            categories: {
              type: "array",
              items: {
                type: "string",
                format: "uuid",
              },
              example: ["clx4a9z8e0000v2xk0q1q2w3r"],
            },
          },
        },
        GetNotesQuery: {
          type: "object",
          properties: {
            category: {
              type: "string",
              format: "uuid",
              description: "Filter notes by category ID",
              example: "clx4a9z8e0000v2xk0q1q2w3r",
            },
            page: {
              type: "integer",
              minimum: 1,
              default: 1,
              example: 1,
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
              example: 10,
            },
            orderBy: {
              type: "string",
              enum: ["createdAt", "title"],
              default: "createdAt",
              example: "createdAt",
            },
            order: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc",
              example: "desc",
            },
            search: {
              type: "string",
              description: "Search term to filter notes by title or content",
              example: "important",
            },
          },
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
          description: "JWT refresh token stored in HTTP-only cookie",
        },
      },
    },
  },
  apis: ["./src/features/**/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
