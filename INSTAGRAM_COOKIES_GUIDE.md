# How to Get Instagram Cookies

The `louisdeconinck/instagram-following-scraper` actor requires your Instagram session cookies to authenticate and scrape following lists.

## Step-by-Step Guide:

### 1. Login to Instagram
- Open your browser (Chrome, Firefox, Safari, etc.)
- Go to https://www.instagram.com
- Login to your Instagram account

### 2. Open Browser DevTools
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Safari**: Enable Developer menu first (Preferences > Advanced > Show Develop menu), then press `Cmd+Option+I`

### 3. Go to Application/Storage Tab
- In DevTools, click on the **Application** tab (Chrome/Edge) or **Storage** tab (Firefox)
- In the left sidebar, expand **Cookies**
- Click on `https://www.instagram.com`

### 4. Export Essential Cookies
You need to copy the following cookies (at minimum):
- `sessionid` - **REQUIRED** - Your session token
- `csrftoken` - **REQUIRED** - CSRF protection token
- `ds_user_id` - Your user ID
- `datr` - Device/browser identifier
- `ig_did` - Instagram device ID
- `mid` - Machine ID
- `rur` - Region/routing info

### 5. Format as JSON Array
Create a JSON array with your cookies in this format:

```json
[
  { "name": "sessionid", "value": "YOUR_SESSION_ID_HERE" },
  { "name": "csrftoken", "value": "YOUR_CSRF_TOKEN_HERE" },
  { "name": "ds_user_id", "value": "YOUR_USER_ID" },
  { "name": "datr", "value": "YOUR_DATR_VALUE" },
  { "name": "ig_did", "value": "YOUR_IG_DID" },
  { "name": "mid", "value": "YOUR_MID" },
  { "name": "rur", "value": "YOUR_RUR" }
]
```

### 6. Add to .env.local
Open `.env.local` and add your cookies **on a single line**:

```env
INSTAGRAM_COOKIES=[{"name":"sessionid","value":"..."},{"name":"csrftoken","value":"..."}]
```

**Important Notes:**
- Remove all line breaks - the entire JSON array must be on one line
- Keep the double quotes around names and values
- Don't share these cookies with anyone - they give full access to your Instagram account
- Cookies expire after some time - you may need to refresh them if they stop working

### Example:

```env
INSTAGRAM_COOKIES=[{"name":"sessionid","value":"40904370%3AONtPjAdiA51W6q%3A3"},{"name":"csrftoken","value":"GzkWGG5XIRnan931xKzRKX3ZvEt3jQN9"},{"name":"ds_user_id","value":"40904370"}]
```

## Alternative: Browser Extension

You can use a browser extension to export cookies:
- **Chrome**: [EditThisCookie](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg)
- **Firefox**: [Cookie Quick Manager](https://addons.mozilla.org/en-US/firefox/addon/cookie-quick-manager/)

These extensions can export cookies in JSON format automatically.

## Security Warning ⚠️

**These cookies provide full access to your Instagram account!**
- Never commit `.env.local` to git (it's in `.gitignore`)
- Don't share your cookies with anyone
- Regularly rotate your Instagram password to invalidate old cookies
- Consider using a separate Instagram account for scraping

## Troubleshooting

### "INSTAGRAM_COOKIES environment variable is not set"
- Make sure you added the cookies to `.env.local`
- Restart your dev server after adding the cookies

### "Session expired" or authentication errors
- Your cookies may have expired
- Generate fresh cookies by logging out and back into Instagram
- Copy the new cookie values

### Rate limiting
- Instagram may rate limit your account if you scrape too aggressively
- Consider adding delays between requests
- Use a separate account for scraping activities
