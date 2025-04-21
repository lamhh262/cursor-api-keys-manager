# API Endpoints Documentation

This document provides information about the API endpoints available in the API Keys Manager application.

## Authentication

All API endpoints require authentication using NextAuth. The authentication token is automatically included in requests made from the frontend. For external API calls, you need to include the API key in the request headers.

## API Endpoints

### List All API Keys

```
GET /api/keys
```

Returns a list of all API keys for the authenticated user.

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "My API Key",
    "key": "sk-abcdefghijklmnopqrstuvwxyz",
    "created_at": "2023-01-01T00:00:00Z",
    "usage": 0,
    "monthly_limit": 1000,
    "user_id": "user-uuid"
  }
]
```

### Create a New API Key

```
POST /api/keys
```

Creates a new API key for the authenticated user.

**Request Body:**

```json
{
  "name": "My New API Key",
  "monthlyLimit": 1000
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "My New API Key",
  "key": "sk-abcdefghijklmnopqrstuvwxyz",
  "created_at": "2023-01-01T00:00:00Z",
  "usage": 0,
  "monthly_limit": 1000,
  "user_id": "user-uuid"
}
```

### Get a Specific API Key

```
GET /api/keys/{id}
```

Returns a specific API key by ID.

**Response:**

```json
{
  "id": "uuid",
  "name": "My API Key",
  "key": "sk-abcdefghijklmnopqrstuvwxyz",
  "created_at": "2023-01-01T00:00:00Z",
  "usage": 0,
  "monthly_limit": 1000,
  "user_id": "user-uuid"
}
```

### Update an API Key

```
PATCH /api/keys/{id}
```

Updates a specific API key by ID.

**Request Body:**

```json
{
  "name": "Updated API Key Name",
  "monthlyLimit": 2000
}
```

**Response:**

```json
{
  "id": "uuid",
  "name": "Updated API Key Name",
  "key": "sk-abcdefghijklmnopqrstuvwxyz",
  "created_at": "2023-01-01T00:00:00Z",
  "usage": 0,
  "monthly_limit": 2000,
  "user_id": "user-uuid"
}
```

### Delete an API Key

```
DELETE /api/keys/{id}
```

Deletes a specific API key by ID.

**Response:**

```json
{
  "success": true
}
```

## Using API Keys for External Services

To use an API key for external services, include it in the request headers:

```
X-API-Key: sk-abcdefghijklmnopqrstuvwxyz
```

## Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Example error response:

```json
{
  "error": "Error message"
}
```
