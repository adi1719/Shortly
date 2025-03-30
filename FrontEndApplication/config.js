const config = {
  development: {
    apiUrl: "https://shortly-tkhg.onrender.com",
  },
  production: {
    apiUrl: "https://shortly-tkhg.onrender.com",
  },
};

// Get the current environment, default to development
const env = process.env.NODE_ENV || "development";

// Export the configuration for the current environment
export default config[env];
