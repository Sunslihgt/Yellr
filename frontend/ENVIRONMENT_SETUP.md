# Frontend Environment Setup

## Environment Variables

The frontend application uses environment variables for configuration. To set up your environment:

1. Create a `.env` file in the `frontend/` directory
2. Add the following variables:

```bash
# Base URL for the application (default: http://localhost:8080)
REACT_APP_BASE_URL=http://localhost:8080
```

## Available Variables

- `REACT_APP_BASE_URL`: The base URL for the application. This is used for:
  - API calls to backend services
  - Share URLs for posts
  - Default: `http://localhost:8080`

## Notes

- All environment variables must be prefixed with `REACT_APP_` to be accessible in the React application
- The `.env` file should not be committed to version control (it's already in `.gitignore`)
- For production, set `REACT_APP_BASE_URL` to your production domain 