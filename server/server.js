const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sendContactEmail, verifyConnection } = require('./emailService');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Email service is running',
    timestamp: new Date().toISOString(),
  });
});

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, country, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, and message are required',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
      });
    }

    // Prepare form data
    const formData = {
      name: name.trim(),
      email: email.trim(),
      country: country ? country.trim() : '',
      message: message.trim(),
    };

    console.log('📧 Processing email request from:', formData.email);

    // Send email
    const result = await sendContactEmail(formData);

    if (result.success) {
      res.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error || 'Failed to send email',
      });
    }
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
const startServer = async () => {
  try {
    // Verify SMTP connection before starting server
    console.log('🔍 Verifying SMTP connection...');
    const isConnected = await verifyConnection();
    
    if (!isConnected) {
      console.warn('⚠️  SMTP connection verification failed, but server will start anyway');
    }

    app.listen(PORT, () => {
      console.log('');
      console.log('='.repeat(50));
      console.log('🚀 Email Service Server Started');
      console.log('='.repeat(50));
      console.log(`📍 Server running on: http://localhost:${PORT}`);
      console.log(`📧 SMTP Host: ${process.env.SMTP_HOST}`);
      console.log(`📮 Email: ${process.env.SMTP_USER}`);
      console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log('='.repeat(50));
      console.log('');
      console.log('Available endpoints:');
      console.log(`  GET  /api/health      - Health check`);
      console.log(`  POST /api/send-email  - Send contact form email`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

// Start the server
startServer();
