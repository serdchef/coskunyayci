Quick-order microservice

This small service accepts a minimal POST to create a quick order and enqueue a notification job.

Endpoints

- POST /quick-order
  - Headers:
    - x-api-key: (optional) server API key to protect the endpoint. Set `QUICK_SERVICE_API_KEY` in .env to require it.
  - Body (JSON): one of:
    - { "sku": "FISTIK_1KG", "phone": "+905551234567", "name": "Müşteri" }
    - { "items": [{ "sku": "FISTIK_1KG", "qty": 1 }], "customer": { "phone": "+905551234567" } }

Security / rate limiting

- Set `QUICK_SERVICE_API_KEY` in your `.env` to require API key authentication.
- A basic in-memory rate limiter is used (configured by `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX_REQUESTS` in `.env`).

Example

```bash
curl -X POST http://localhost:5001/quick-order \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev_quick_key_please_change" \
  -d '{"sku":"FISTIK_1KG","phone":"+905551234567"}'
```

Notes

- This service is intentionally minimal. For production use consider:
  - Using a persistent rate limiter (Redis),
  - Proper input schema validation (server-side libraries),
  - Authentication & logging, and
  - Running as a proper container image with pinned dependencies.
