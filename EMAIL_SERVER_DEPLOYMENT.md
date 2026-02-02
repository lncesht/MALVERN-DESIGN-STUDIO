# 📧 Email Server Deployment Guide (SMTP Service)

## ⚠️ IMPORTANT: Two Separate Deployments Required

Your Malvern Design Studio has **TWO separate applications** that need to be deployed:

1. **Frontend (React App)** - Main website with admin panel
2. **Backend (Email Server)** - SMTP service for contact form

Both need to be deployed separately in Dockploy.

---

## 📋 Email Server Overview

**Location:** `/server` folder
**Purpose:** Handles contact form submissions via SMTP
**Technology:** Node.js + Express + Nodemailer
**Port:** 3001

### What It Does:
- Receives contact form submissions from your website
- Sends confirmation email to the user
- Sends notification email to you (the owner)
- Uses SMTP (Gmail, Hostinger email, etc.)

---

## 🚀 Deployment Steps for Email Server

### Step 1: Prepare Email Credentials

You need an SMTP email account. Options:

**Option A: Gmail (Recommended for Testing)**
1. Use your Gmail account
2. Enable 2-Factor Authentication
3. Generate App Password: https://myaccount.google.com/apppasswords
4. Use the 16-character app password

**Option B: Hostinger Email (Recommended for Production)**
1. Create email account in Hostinger cPanel
2. Use your Hostinger email credentials
3. SMTP settings:
   - Host: `smtp.hostinger.com`
   - Port: `465` (SSL) or `587` (TLS)
   - Secure: `true` for 465, `false` for 587

**Option C: Other SMTP Providers**
- SendGrid, Mailgun, AWS SES, etc.

---

### Step 2: Deploy Email Server in Dockploy

#### 2.1 Create New Project in Dockploy

1. **Login to Dockploy:** `http://your-vps-ip:3000`
2. **Click "New Project"** or **"Add Application"**
3. **Name:** `malvern-email-server` (or any name)
4. **Source:** Git Repository
5. **Repository:** Your GitHub/GitLab repo
6. **Branch:** `main` (or your branch)
7. **Build Path:** `/server` (IMPORTANT!)

#### 2.2 Configure Build Settings

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

**Port:** `3001`

**Dockerfile Path:** `/server/Dockerfile`

#### 2.3 Set Environment Variables

In Dockploy, add these environment variables:

```env
# SMTP Configuration (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here

# Server Configuration
PORT=3001
FRONTEND_URL=https://yourdomain.com

# Node Environment
NODE_ENV=production
```

**For Hostinger Email:**
```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contact@yourdomain.com
SMTP_PASS=your-email-password
PORT=3001
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

#### 2.4 Deploy

1. Click **"Deploy"** or **"Create"**
2. Wait for build to complete
3. Check logs for any errors

---

### Step 3: Update Frontend to Use Email Server

After deploying the email server, you need to update your frontend to point to it.

#### 3.1 Find Your Email Server URL

In Dockploy, your email server will be accessible at:
- `http://your-vps-ip:3001` (if exposed)
- Or internal Docker network URL

#### 3.2 Update Frontend Environment Variables

In your **frontend Dockploy project**, add this environment variable:

```env
REACT_APP_EMAIL_API_URL=http://your-email-server-url:3001
```

Or if using domain:
```env
REACT_APP_EMAIL_API_URL=https://api.yourdomain.com
```

#### 3.3 Update Frontend Code (if needed)

Check `src/services/emailService.js` in your frontend:

```javascript
const API_URL = process.env.REACT_APP_EMAIL_API_URL || 'http://localhost:3001';

export const sendContactEmail = async (formData) => {
  const response = await fetch(`${API_URL}/api/send-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  return response.json();
};
```

---

## 🔧 Configuration Options

### Using Subdomain for Email API (Recommended)

**Setup:**
1. In Hostinger DNS, add A record:
   - Name: `api`
   - Value: `your-vps-ip`
   
2. In Dockploy email server project:
   - Add domain: `api.yourdomain.com`
   - Enable Auto SSL

3. Update frontend env:
   ```env
   REACT_APP_EMAIL_API_URL=https://api.yourdomain.com
   ```

### Using Reverse Proxy (Alternative)

Configure nginx to proxy `/api/send-email` to email server:

```nginx
location /api/ {
    proxy_pass http://email-server:3001/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

---

## ✅ Testing Email Server

### Test 1: Health Check

```bash
curl http://your-vps-ip:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Email service is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test 2: Send Test Email

```bash
curl -X POST http://your-vps-ip:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "country": "Philippines",
    "message": "This is a test message"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "..."
}
```

### Test 3: From Frontend

1. Visit your deployed website
2. Go to Contact page
3. Fill out the form
4. Submit
5. Check:
   - User receives confirmation email
   - You receive notification email

---

## 🔐 Security Considerations

### 1. CORS Configuration

The email server is configured to accept requests only from your frontend:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

Make sure `FRONTEND_URL` is set correctly!

### 2. Rate Limiting (Recommended)

Add rate limiting to prevent spam:

```bash
npm install express-rate-limit
```

Update `server/server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many requests, please try again later'
});

app.use('/api/send-email', limiter);
```

### 3. Email Validation

Already implemented in the server - validates email format and required fields.

### 4. Environment Variables

Never commit `.env` file! Always use Dockploy environment variables.

---

## 📊 Monitoring

### Check Logs in Dockploy

1. Go to email server project
2. Click "Logs" or "Console"
3. Look for:
   - `✅ SMTP connection verified successfully`
   - `✅ Confirmation email sent to user`
   - `✅ Notification email sent to owner`

### Common Log Messages

**Success:**
```
🚀 Email Service Server Started
📍 Server running on: http://localhost:3001
📧 SMTP Host: smtp.gmail.com
✅ SMTP connection verified successfully
```

**Errors:**
```
❌ SMTP connection verification failed
❌ Email sending error: Invalid login
```

---

## 🐛 Troubleshooting

### Issue 1: "SMTP connection verification failed"

**Causes:**
- Wrong SMTP credentials
- Gmail App Password not generated
- Firewall blocking port 465/587

**Solutions:**
1. Verify SMTP credentials in Dockploy env vars
2. For Gmail: Generate App Password
3. Check VPS firewall allows outbound SMTP

### Issue 2: "Failed to send email"

**Causes:**
- SMTP server blocking
- Invalid email format
- Rate limiting

**Solutions:**
1. Check SMTP provider status
2. Verify email addresses are valid
3. Check server logs for specific error

### Issue 3: Frontend can't reach email server

**Causes:**
- Wrong API URL
- CORS blocking
- Server not running

**Solutions:**
1. Verify `REACT_APP_EMAIL_API_URL` is correct
2. Check `FRONTEND_URL` in email server env vars
3. Test health endpoint: `curl http://api-url/api/health`

### Issue 4: Emails going to spam

**Solutions:**
1. Use professional email (not Gmail for production)
2. Set up SPF, DKIM, DMARC records
3. Use Hostinger email with your domain
4. Warm up email account (send gradually)

---

## 📋 Deployment Checklist

### Email Server Deployment:

- [ ] SMTP credentials obtained (Gmail App Password or Hostinger email)
- [ ] Email server deployed in Dockploy
- [ ] Environment variables set in Dockploy
- [ ] Build successful, no errors in logs
- [ ] Health check endpoint working
- [ ] SMTP connection verified in logs

### Frontend Integration:

- [ ] `REACT_APP_EMAIL_API_URL` set in frontend Dockploy
- [ ] Frontend redeployed with new env var
- [ ] CORS configured correctly
- [ ] Contact form tested and working
- [ ] Confirmation email received
- [ ] Notification email received

---

## 🎯 Production Recommendations

### 1. Use Professional Email

For production, use:
- **Hostinger Email** (comes with your hosting)
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 5,000 emails/month)
- **AWS SES** (very cheap, reliable)

### 2. Set Up Email Domain

Configure SPF, DKIM, DMARC for your domain to avoid spam folder.

### 3. Add Rate Limiting

Prevent abuse by limiting requests (see Security section).

### 4. Monitor Email Delivery

- Check bounce rates
- Monitor spam complaints
- Keep logs of sent emails

### 5. Backup Plan

Have a fallback email service in case primary fails.

---

## 📞 Quick Reference

### Email Server URLs:

| Environment | URL |
|-------------|-----|
| **Local Development** | `http://localhost:3001` |
| **VPS Direct** | `http://your-vps-ip:3001` |
| **Subdomain** | `https://api.yourdomain.com` |

### Endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/send-email` | POST | Send contact email |

### Environment Variables:

```env
# Required
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
FRONTEND_URL=https://yourdomain.com

# Optional
PORT=3001
NODE_ENV=production
```

---

## 🎉 Summary

**Yes, your SMTP email service WILL work after deployment!**

You just need to:
1. Deploy email server separately in Dockploy
2. Set SMTP environment variables
3. Update frontend to point to email server URL
4. Test the contact form

The email server is a standalone Node.js application that runs independently from your React frontend.

---

**Last Updated:** 2024
**Project:** Malvern Design Studio - Email Server
**Deployment:** Hostinger VPS + Dockploy
