# 🚀 Hostinger VPS + Dockploy Deployment Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Dockploy Setup](#dockploy-setup)
3. [Deploy React App](#deploy-react-app)
4. [Environment Variables](#environment-variables)
5. [Accessing Admin Panel](#accessing-admin-panel)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### What You Need:
- ✅ Hostinger VPS with Docker installed
- ✅ Dockploy installed on your VPS
- ✅ Domain name (optional but recommended)
- ✅ Supabase credentials (already configured)
- ✅ Git repository (GitHub/GitLab)

---

## Dockploy Setup

### Step 1: Access Dockploy Dashboard

1. **SSH into your Hostinger VPS:**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Access Dockploy:**
   - Open browser: `http://your-vps-ip:3000` (or your Dockploy port)
   - Login with your Dockploy credentials

### Step 2: Create New Project

1. Click **"New Project"** or **"Add Application"**
2. Choose **"Git Repository"** as source
3. Connect your GitHub/GitLab account
4. Select your Malvern Design Studio repository

---

## Deploy React App

### Step 1: Configure Build Settings

In Dockploy, set these build configurations:

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npx serve -s build -l 3000
```

**Or use this Dockerfile approach:**

Create a `Dockerfile` in your project root:

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create nginx.conf (Optional but Recommended)

Create `nginx.conf` in project root:

```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

---

## Environment Variables

### In Dockploy Dashboard:

1. Go to your project settings
2. Find **"Environment Variables"** section
3. Add these variables:

```env
REACT_APP_SUPABASE_URL=https://qzlvrycszdhctjmvuhug.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_actual_anon_key_here
NODE_ENV=production
```

**Important:** 
- Click **"Add"** after each variable
- Click **"Save"** or **"Deploy"** to apply changes
- Redeploy the application after adding variables

---

## Accessing Admin Panel

### 🔐 Admin Access URLs

Once deployed, you can access the admin panel at:

**Option 1: Using Domain**
```
https://yourdomain.com/login
```

**Option 2: Using VPS IP**
```
http://your-vps-ip/login
```

**Option 3: Using Subdomain (Recommended)**
```
https://admin.yourdomain.com/login
```

### Admin Routes Available:

| Route | Purpose |
|-------|---------|
| `/login` | Admin login page |
| `/admin` | Main admin dashboard |
| `/admin/artworks` | Manage artworks |
| `/admin/add-artwork` | Add new artwork |
| `/admin/edit-artwork/:id` | Edit artwork |
| `/admin/exhibits` | Manage exhibits |
| `/admin/add-exhibit` | Add new exhibit |
| `/admin/cv-settings` | CV/Resume settings |
| `/admin/timeline-settings` | Timeline settings |

### Default Login Credentials

**Important:** You need to create an admin user in Supabase first!

**Step 1: Create Admin User in Supabase**

1. Go to: https://app.supabase.com/project/qzlvrycszdhctjmvuhug
2. Click **"Authentication"** → **"Users"**
3. Click **"Add User"** → **"Create new user"**
4. Enter:
   - **Email:** your-admin@email.com
   - **Password:** (create a strong password)
   - **Auto Confirm User:** ✅ Enable this
5. Click **"Create User"**

**Step 2: Login to Your Deployed Site**

1. Visit: `https://yourdomain.com/login`
2. Enter the email and password you created
3. Click **"Sign In"**
4. You'll be redirected to `/admin` dashboard

---

## Post-Deployment Checklist

### ✅ Verify Deployment

- [ ] Website loads at your domain/IP
- [ ] Home page displays correctly
- [ ] Gallery shows artworks
- [ ] All images load properly
- [ ] Navigation works
- [ ] Responsive design works on mobile

### ✅ Verify Admin Access

- [ ] Can access `/login` page
- [ ] Can login with Supabase credentials
- [ ] Redirected to `/admin` after login
- [ ] Can view admin dashboard
- [ ] Can add new artwork
- [ ] Can edit existing artwork
- [ ] Can delete artwork
- [ ] Can manage exhibits
- [ ] Can logout successfully

### ✅ Security Check

- [ ] HTTPS is enabled (SSL certificate)
- [ ] Environment variables are set
- [ ] RLS policies are active in Supabase
- [ ] Non-authenticated users cannot access admin routes
- [ ] Session persists after page refresh

---

## Domain Configuration (Optional)

### If Using Custom Domain:

1. **In Hostinger Domain Settings:**
   - Add A record: `@` → `your-vps-ip`
   - Add A record: `www` → `your-vps-ip`
   - Add A record: `admin` → `your-vps-ip` (optional subdomain)

2. **In Dockploy:**
   - Go to project settings
   - Add your domain in **"Domains"** section
   - Enable **"Auto SSL"** for HTTPS

3. **Wait for DNS propagation** (5-30 minutes)

---

## SSL Certificate (HTTPS)

### Enable HTTPS in Dockploy:

1. Go to your project in Dockploy
2. Navigate to **"Domains"** or **"SSL"** section
3. Click **"Enable SSL"** or **"Auto SSL"**
4. Dockploy will automatically get Let's Encrypt certificate
5. Your site will be accessible via `https://`

**Or manually with Certbot:**

```bash
# SSH into VPS
ssh root@your-vps-ip

# Install Certbot
apt-get update
apt-get install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
```

---

## Troubleshooting

### Issue 1: "Missing environment variables" error

**Solution:**
1. Check Dockploy environment variables are set
2. Redeploy the application
3. Clear browser cache
4. Check browser console for errors

### Issue 2: Cannot access admin panel

**Solution:**
1. Verify you created a user in Supabase Authentication
2. Check the email/password are correct
3. Verify RLS policies are applied
4. Check browser console for errors
5. Try accessing: `https://yourdomain.com/login` directly

### Issue 3: 404 on admin routes

**Solution:**
1. Ensure nginx.conf has `try_files $uri $uri/ /index.html;`
2. Redeploy with correct nginx configuration
3. Check Dockploy logs for errors

### Issue 4: Images not loading

**Solution:**
1. Check Supabase storage bucket permissions
2. Verify RLS policies for storage
3. Check image URLs in browser console
4. Ensure storage bucket is public for read access

### Issue 5: Build fails in Dockploy

**Solution:**
1. Check build logs in Dockploy
2. Verify `package.json` has all dependencies
3. Try building locally first: `npm run build`
4. Check Node.js version compatibility

---

## Monitoring & Maintenance

### Check Application Logs:

In Dockploy:
1. Go to your project
2. Click **"Logs"** or **"Console"**
3. Monitor for errors

### Update Application:

1. Push changes to your Git repository
2. In Dockploy, click **"Redeploy"** or enable auto-deploy
3. Wait for build to complete
4. Verify changes are live

### Backup Database:

Supabase automatically backs up your data, but you can also:
1. Go to Supabase Dashboard
2. Navigate to **"Database"** → **"Backups"**
3. Download manual backup if needed

---

## Quick Reference

### Important URLs:

| Service | URL |
|---------|-----|
| **Live Website** | `https://yourdomain.com` |
| **Admin Login** | `https://yourdomain.com/login` |
| **Admin Dashboard** | `https://yourdomain.com/admin` |
| **Dockploy** | `http://your-vps-ip:3000` |
| **Supabase Dashboard** | `https://app.supabase.com/project/qzlvrycszdhctjmvuhug` |

### Admin Credentials:

- **Email:** (created in Supabase Authentication)
- **Password:** (created in Supabase Authentication)

### Support Resources:

- **Dockploy Docs:** https://dockploy.com/docs
- **Hostinger Support:** https://www.hostinger.com/tutorials/vps
- **Supabase Docs:** https://supabase.com/docs

---

## 🎉 Deployment Complete!

Your Malvern Design Studio is now live on Hostinger VPS with Dockploy!

**Next Steps:**
1. Create admin user in Supabase
2. Login at `/login`
3. Start managing your artworks
4. Share your portfolio with the world! 🎨

---

**Last Updated:** 2024
**Project:** Malvern Design Studio
**Deployment:** Hostinger VPS + Dockploy
