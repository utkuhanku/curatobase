---
name: neynar
description: Interface to Neynar Farcaster API.
---

# Actions

## search
Search for casts matching a query.

- **url**: GET https://api.neynar.com/v2/farcaster/feed/search?q={{query}}&limit=10
- **headers**:
  - api_key: {{env.NEYNAR_API_KEY}}

## post
Publish a cast.

- **url**: POST https://api.neynar.com/v2/farcaster/cast
- **headers**:
  - api_key: {{env.NEYNAR_API_KEY}}
- **body**:
  ```json
  {
    "signer_uuid": "{{env.NEYNAR_SIGNER_UUID}}",
    "text": "{{text}}"
  }
  ```
