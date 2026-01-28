# Email Service Backend

This is the backend email service for the Art Visa portfolio website. It handles contact form submissions and sends emails via Gmail SMTP.

## Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Variables

The `.env` file is already configured with your Gmail SMTP credentials:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=lanesrateam@gmail.com
SMTP_PASS=azdf xvmf vtok mlvk
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**Important:** Make sure you're using a Gmail App Password, not your regular Gmail password. To create an App Password:
1. Go to your Google Account settings
2. Enable 2-Step Verification if not already enabled
3. Go to Security > 2-Step Verification > App passwords
4. Generate a new app password for "Mail"

### 3. Start the Server

```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Send Email
- **POST** `/api/send-email`
- Body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "country": "USA",
    "message": "Your message here"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "message": "Email sent successfully",
    "messageId": "..."
  }
  ```

## Testing

You can test the email service using curl:

```bash
curl -X POST http://localhost:3001/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "country": "Test Country",
    "message": "This is a test message"
  }'
```

## Troubleshooting

### SMTP Connection Issues
- Verify your Gmail App Password is correct
- Check if "Less secure app access" is enabled (if not using App Password)
- Ensure your firewall allows outbound connections on port 465

### Email Not Sending
- Check server logs for error messages
- Verify the email address in SMTP_USER is correct
- Make sure the Gmail account has not exceeded sending limits

## Security Notes

- Never commit the `.env` file to version control
- Use environment variables for sensitive data
- The `.env` file is already in `.gitignore`
- Consider using a dedicated email service account
