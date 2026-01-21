# Memory API Quick Reference

Read the file `memory-server/API_QUICKREF.md` for full Memory API documentation.

## Quick Commands

**Environments:**
| Env | URL | Key |
|-----|-----|-----|
| Sandbox | `softwaredesignv20-sandbox-production.up.railway.app` | `qNWhIVjOouVt0mZzV2tytYC/0XneUf2aC2JYYZnEmfU=` |
| Production | `softwaredesignv20-production.up.railway.app` | `vk4Tx7NOdLmDKgyjbNERVBFPuDyO1ULN7TFffGRX+HU=` |

**Common Operations:**

```bash
# Get pattern
curl.exe -s -H "Authorization: Bearer KEY" "URL/api/pattern?id=P42&memory=common_mistakes"

# List all
curl.exe -s -H "Authorization: Bearer KEY" "URL/api/patterns?memory=common_mistakes"

# Add/Update (write JSON to temp file first)
curl.exe -s -X POST -H "Authorization: Bearer KEY" -H "Content-Type: application/json" -d @file.json "URL/api/patterns"

# Delete
curl.exe -s -X DELETE -H "Authorization: Bearer KEY" "URL/api/pattern?id=P42&memory=common_mistakes"
```

**Pattern JSON format:**
```json
{
  "id": "P42",
  "memory": "common_mistakes",
  "title": "Pattern Title",
  "content": "Full content",
  "priority": "P1",
  "tags": ["tag1"],
  "critical": true,
  "repo": "mlaia",
  "approved": true
}
```

**Tips:**
- Always use temp file for JSON (avoids escaping issues)
- `memory=common_mistakes` is required on all calls
- Add `&repo=mlaia` for repo-scoped patterns
