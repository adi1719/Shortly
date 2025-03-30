const config = {
  development: {
    apiUrl: "http://localhost:8080",
  },
  production: {
    apiUrl: "https://your-production-api.com", // Update this with your production URL
  },
};

// Get the current environment, default to development
const env = process.env.NODE_ENV || "development";

// Export the configuration for the current environment
export default config[env];
