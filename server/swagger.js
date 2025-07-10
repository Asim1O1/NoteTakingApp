import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Note Taking App API",
      version: "1.0.0",
      description: "API documentation for the Note Taking App",
    },
  },
  apis: ["./src/features/**/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
