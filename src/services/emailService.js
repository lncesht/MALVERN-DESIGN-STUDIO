// Email service to communicate with backend API

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Send contact form email via backend API
 * @param {Object} formData - Form data containing name, email, country, message
 * @returns {Promise<Object>} Response object with success status
 */
export const sendContactEmail = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        country: formData.country,
        message: formData.message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      message: data.message || 'Email sent successfully',
      messageId: data.messageId,
    };
  } catch (error) {
    console.error('Email service error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email',
    };
  }
};

/**
 * Check if email service is available
 * @returns {Promise<boolean>} True if service is available
 */
export const checkEmailServiceHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Email service health check failed:', error);
    return false;
  }
};
