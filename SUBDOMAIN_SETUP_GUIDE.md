# 🌐 Subdomain Setup Guide for Hostinger VPS + Dockploy

## 📋 Recommended Subdomain Structure

For your Malvern Design Studio deployment, here's the recommended setup:

```
Main Website:     https://yourdomain.com
Admin Panel:      https://yourdomain.com/login (same domain)
Email API:        https://api.yourdomain.com
```

**Why this structure?**
- Main website and admin on same domain (simpler, no CORS issues)
- Email API on subdomain (clean separation, easier to manage)

---

## 🔧 Step-by-Step Subdomain Setup

### Step 1: Configure DNS in Hostinger

1. **Login to Hostinger Control Panel**
   - Go to: https://hpanel.hostinger.com

2. **Navigate to DNS Settings**
   - Click on your domain
   - Go to "DNS / Name Servers"
   - Click "DNS Zone Editor" or "Manage DNS"

3. **Add A Records**

Add these DNS records:

| Type | Name | Points to | TTL |
|------|------|-----------|-----|
| A | @ | your-vps-ip | 14400 |
| A | www | your-vps-ip | 14400 |
| A | api | your-vps-ip | 14400 |

**Example:**
```
Type: A
Name: @
Points to: 123.45.67.89
TTL: 14400

Type: A
Name: www
Points to: 123.45.67.89
TTL: 14400

Type: A
Name: api
Points to: 123.45.67.89
TTL: 14400
```

4. **Save Changes**
   - Click "Add Record" or "Save"
   - Wait 5-30 minutes for DNS propagation

---

### Step 2: Configure Dockploy Projects

You'll create **TWO separate projects** in Dockploy:

#### Project 1: Frontend (Main Website + Admin)

1. **In Dockploy Dashboard:**
   - Create new project: "malvern-frontend"
   - Source: Your Git repository
   - Build path: `/` (root)

2. **Add Domains:**
   - Primary: `yourdomain.com`
   - Alias: `www.yourdomain.com`

3. **Enable SSL:**
   - Toggle "Auto SSL" or "Enable SSL"
   - Dockploy will automatically get Let's Encrypt certificate

4. **Environment Variables:**
   ```env
   REACT_APP_SUPABASE_URL=https://qzlvrycszdhctjmvuhug.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   REACT_APP_EMAIL_API_URL=https://api.yourdomain.com
   NODE_ENV=production
   ```

5. **Deploy**

#### Project 2: Email Server (API)

1. **In Dockploy Dashboard:**
   - Create new project: "malvern-email-api"
   - Source: Your Git repository
   - Build path: `/server`

2. **Add Domain:**
   - Primary: `api.yourdomain.com`

3. **Enable SSL:**
   - Toggle "Auto SSL" or "Enable SSL"

4. **Environment Variables:**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   PORT=3001
   FRONTEND_URL=https://yourdomain.com
   NODE_ENV=production
   ```

5. **Deploy**

---

### Step 3: Verify DNS Propagation

**Check if DNS is working:**

```bash
# Check main domain
nslookup yourdomain.com

# Check www subdomain
nslookup www.yourdomain.com

# Check api subdomain
nslookup api.yourdomain.com
```

All should return your VPS IP address.

**Online tools:**
- https://dnschecker.org
- https://www.whatsmydns.net

---

### Step 4: Test Your Deployment

#### Test Main Website:
```bash
# Should show your website
curl https://yourdomain.com

# Should also work
curl https://www.yourdomain.com
```

#### Test Admin Access:
```bash
# Should show login page
curl https://yourdomain.com/login
```

#### Test Email API:
```bash
# Should return health check
curl https://api.yourdomain.com/api/health

# Expected response:
# {"status":"ok","message":"Email service is running","timestamp":"..."}
```

#### Test Contact Form:
```bash
# Send test email
curl -X POST https://api.yourdomain.com/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message"
  }'
```

---

## 🔐 SSL Certificate Setup

### Automatic SSL (Recommended)

Dockploy handles this automatically:

1. In each project, enable "Auto SSL"
2. Dockploy uses Let's Encrypt
3. Certificates auto-renew every 90 days

### Manual SSL (If Needed)

If auto SSL doesn't work:

```bash
# SSH into VPS
ssh root@your-vps-ip

# Install Certbot
apt-get update
apt-get install certbot

# Get certificates
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
certbot certonly --standalone -d api.yourdomain.com

# Certificates saved to:
# /etc/letsencrypt/live/yourdomain.com/
# /etc/letsencrypt/live/api.yourdomain.com/
```

---

## 📊 Complete URL Structure

After setup, your URLs will be:

### Public URLs (No Login Required):

| Page | URL |
|------|-----|
| **Home** | `https://yourdomain.com` |
| **Gallery** | `https://yourdomain.com/#gallery` |
| **About** | `https://yourdomain.com/about` |
| **Resume** | `https://yourdomain.com/resume` |
| **Exhibits** | `https://yourdomain.com/exhibits` |

### Admin URLs (Login Required):

| Page | URL |
|------|-----|
| **Login** | `https://yourdomain.com/login` |
| **Dashboard** | `https://yourdomain.com/admin` |
| **Artworks** | `https://yourdomain.com/admin/artworks` |
| **Add Artwork** | `https://yourdomain.com/admin/add-artwork` |
| **Exhibits** | `https://yourdomain.com/admin/exhibits` |
| **CV Settings** | `https://yourdomain.com/admin/cv-settings` |

### API URLs:

| Endpoint | URL |
|----------|-----|
| **Health Check** | `https://api.yourdomain.com/api/health` |
| **Send Email** | `https://api.yourdomain.com/api/send-email` |

---

## 🎯 Alternative Subdomain Structures

### Option 1: Separate Admin Subdomain (Not Recommended)

```
Main:    https://yourdomain.com
Admin:   https://admin.yourdomain.com
API:     https://api.yourdomain.com
```

**Pros:** Clear separation
**Cons:** More complex, CORS issues, need 3 deployments

### Option 2: Path-based (Current - Recommended)

```
Main:    https://yourdomain.com
Admin:   https://yourdomain.com/admin
API:     https://api.yourdomain.com
```

**Pros:** Simple, no CORS issues, 2 deployments
**Cons:** None

### Option 3: All on Main Domain (Not Recommended for API)

```
Main:    https://yourdomain.com
Admin:   https://yourdomain.com/admin
API:     https://yourdomain.com/api
```

**Pros:** Single deployment
**Cons:** Need reverse proxy, more complex nginx config

---

## 🔧 Troubleshooting

### Issue 1: DNS not propagating

**Solution:**
- Wait 30 minutes to 24 hours
- Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
- Check with: https://dnschecker.org

### Issue 2: SSL certificate error

**Solution:**
- Ensure DNS is fully propagated first
- In Dockploy, disable then re-enable Auto SSL
- Check Dockploy logs for SSL errors
- Verify domain points to correct IP

### Issue 3: api.yourdomain.com not accessible

**Solution:**
- Verify A record for "api" exists in DNS
- Check Dockploy email server is running
- Verify port 3001 is exposed
- Check firewall allows traffic

### Issue 4: CORS errors

**Solution:**
- Verify `FRONTEND_URL` in email server env vars matches your domain
- Should be: `https://yourdomain.com` (no trailing slash)
- Redeploy email server after changing

### Issue 5: Admin routes return 404

**Solution:**
- Verify nginx.conf has `try_files $uri $uri/ /index.html;`
- Redeploy frontend
- Clear browser cache

---

## 📋 Deployment Checklist with Subdomains

### DNS Configuration:
- [ ] A record for @ (root domain)
- [ ] A record for www
- [ ] A record for api
- [ ] DNS propagated (check with nslookup)

### Dockploy - Frontend Project:
- [ ] Project created
- [ ] Domain added: yourdomain.com
- [ ] Domain added: www.yourdomain.com
- [ ] Auto SSL enabled
- [ ] Environment variables set (including REACT_APP_EMAIL_API_URL)
- [ ] Deployed successfully
- [ ] HTTPS working

### Dockploy - Email Server Project:
- [ ] Project created
- [ ] Domain added: api.yourdomain.com
- [ ] Auto SSL enabled
- [ ] Environment variables set (including FRONTEND_URL)
- [ ] Deployed successfully
- [ ] HTTPS working
- [ ] Health check responds

### Testing:
- [ ] Main website loads: https://yourdomain.com
- [ ] WWW redirect works: https://www.yourdomain.com
- [ ] Admin login accessible: https://yourdomain.com/login
- [ ] API health check works: https://api.yourdomain.com/api/health
- [ ] Contact form sends emails
- [ ] All HTTPS (no mixed content warnings)

---

## 🎉 Final Setup Summary

**Your complete deployment will have:**

1. **Main Website:** `https://yourdomain.com`
   - Home, Gallery, About, Resume, Exhibits
   - Admin panel at `/login` and `/admin/*`
   - Deployed from root folder
   - Uses Dockerfile + nginx.conf

2. **Email API:** `https://api.yourdomain.com`
   - Contact form backend
   - Deployed from /server folder
   - Uses server/Dockerfile
   - Handles SMTP email sending

3. **Database:** Supabase (cloud-hosted)
   - Artworks, exhibits, timeline data
   - User authentication
   - File storage

**All with HTTPS, auto-renewing SSL certificates, and proper subdomain structure!**

---

**Last Updated:** 2024
**Project:** Malvern Design Studio
**Deployment:** Hostinger VPS + Dockploy + Subdomains
