# Production CORS Configuration

## Overview

This project uses a production-ready CORS (Cross-Origin Resource Sharing) configuration that securely allows API access from specific domains only.

## Allowed Origins

The following origins are whitelisted:

- `https://careerhq.in` - Main production domain
- `https://www.careerhq.in` - WWW subdomain
- `http://localhost:3000` - Local development (remove in production if not needed)

## Implementation

### 1. Global Middleware (`src/middleware.ts`)

- Handles CORS for all API routes (`/api/*`)
- Validates request origin against whitelist
- Responds to OPTIONS preflight requests
- Adds appropriate CORS headers to all API responses

### 2. API Route Level (`src/app/api/blog/route.ts`)

- Additional CORS handling at route level
- Uses same origin validation logic
- Ensures consistent CORS behavior

## Security Features

### ✅ Origin Validation

- Only whitelisted domains can access the API
- Prevents unauthorized cross-origin requests
- Protects against CSRF attacks

### ✅ Credentials Support

- `Access-Control-Allow-Credentials: true` enabled
- Allows cookies and authentication headers
- Secure session management

### ✅ Preflight Caching

- `Access-Control-Max-Age: 86400` (24 hours)
- Reduces preflight requests
- Improves performance

### ✅ Allowed Methods

- GET, POST, PUT, DELETE, OPTIONS
- Explicitly defined for security
- No wildcard methods

### ✅ Allowed Headers

- Content-Type
- Authorization
- X-Requested-With
- Explicitly defined for security

## Configuration Updates

### Adding New Domains

To add a new allowed domain, update the `allowedOrigins` array in both files:

```typescript
const allowedOrigins = [
  "https://careerhq.in",
  "https://www.careerhq.in",
  "https://new-domain.com", // Add here
  "http://localhost:3000",
];
```

### Removing Development Access

For production deployment, remove localhost:

```typescript
const allowedOrigins = [
  "https://careerhq.in",
  "https://www.careerhq.in",
  // Remove: "http://localhost:3000",
];
```

## Testing CORS

### Test Preflight Request

```bash
curl -X OPTIONS https://careerhq.in/api/blog \
  -H "Origin: https://www.careerhq.in" \
  -H "Access-Control-Request-Method: GET" \
  -v
```

### Test Actual Request

```bash
curl -X GET https://careerhq.in/api/blog \
  -H "Origin: https://www.careerhq.in" \
  -v
```

## Common Issues

### Issue: "Redirect is not allowed for a preflight request"

**Solution**: Ensure your domain redirects (www to non-www or vice versa) happen at the DNS/CDN level, not in the application.

### Issue: "No 'Access-Control-Allow-Origin' header"

**Solution**: Verify the requesting origin is in the `allowedOrigins` array.

### Issue: CORS works locally but not in production

**Solution**: Check that production environment variables are set correctly and middleware is deployed.

## Best Practices

1. **Never use `*` wildcard in production** - Always specify exact origins
2. **Use HTTPS only** - HTTP origins should only be for local development
3. **Keep credentials enabled** - Required for authenticated requests
4. **Monitor CORS errors** - Set up logging for blocked requests
5. **Regular security audits** - Review allowed origins periodically

## Environment-Specific Configuration

You can make CORS configuration environment-aware:

```typescript
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://careerhq.in", "https://www.careerhq.in"]
    : [
        "https://careerhq.in",
        "https://www.careerhq.in",
        "http://localhost:3000",
      ];
```

## Deployment Checklist

- [ ] Verify allowed origins list
- [ ] Remove localhost from production
- [ ] Test preflight requests
- [ ] Test actual API requests
- [ ] Verify credentials work
- [ ] Check browser console for CORS errors
- [ ] Test from both www and non-www domains
- [ ] Monitor production logs

## Support

For CORS-related issues:

1. Check browser console for specific error messages
2. Verify request origin matches allowed list
3. Test with curl to isolate client-side issues
4. Review middleware logs for blocked requests
