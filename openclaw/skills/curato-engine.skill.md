---
name: curato-engine
description: Interface to the CuratoBase Engine API.
---

# Actions

## ingest_signal
Ingests a social signal for processing.

- **url**: POST http://localhost:3000/api/ingest/signal
- **body**:
  ```json
  {
    "source": "{{source}}",
    "type": "{{type}}",
    "rawText": "{{text}}",
    "authorHandle": "{{author}}",
    "timestamp": "{{timestamp}}",
    "urls": {{urls}} // array of strings
  }
  ```

## verify_rewards
Triggers the on-chain reward verification loop.

- **url**: POST http://localhost:3000/api/rewards/verify
- **body**: {}
