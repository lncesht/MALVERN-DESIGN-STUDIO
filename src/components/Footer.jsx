import React, { useState, useEffect } from 'react';
import { sendContactEmail } from '../services/emailService';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear general error message when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus(null);
      setErrorMessage('');
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    // Message validation
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');
    setFieldErrors({});

    try {
      // Send email via backend API
      const result = await sendContactEmail(formData);
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', country: '', message: '' });
        
        // Auto-dismiss success message after 3 seconds
        setTimeout(() => {
          setSubmitStatus(null);
        }, 3000);
      } else {
        setSubmitStatus('error');
        // Provide specific error messages
        if (result.error.includes('network') || result.error.includes('fetch')) {
          setErrorMessage('Unable to connect to the server. Please check your internet connection and try again.');
        } else if (result.error.includes('email')) {
          setErrorMessage('There was a problem with the email address. Please check and try again.');
        } else {
          setErrorMessage(result.error || 'Failed to send email. Please try again.');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      
      // Provide user-friendly error messages based on error type
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setErrorMessage('Cannot connect to the email service. Please check your internet connection or try again later.');
      } else if (error.message.includes('timeout')) {
        setErrorMessage('The request timed out. Please try again.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again later or contact us directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-dismiss error messages after 5 seconds
  useEffect(() => {
    if (submitStatus === 'error') {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <footer className="bg-brown-900 text-warm-200">
      {/* Contact Form Section */}
      <section id="contact" className="border-b border-brown-800">
        <div className="container-custom section-padding">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-warm-50 mb-4">
                Interested in My Artwork?
              </h2>
              <h3 className="text-2xl sm:text-3xl font-display font-semibold text-warm-50 mb-6">
                Let's Connect.
              </h3>
              <p className="text-base sm:text-lg text-warm-300 leading-relaxed max-w-2xl mx-auto">
                At Malvern Design Studio, I'm passionate about creating art that speaks to the soul. Whether you're interested in commissioning a piece, purchasing existing artwork, or simply want to discuss art, I'd love to hear from you.
                Tell me more about what you're looking for, and let's create something beautiful together.
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-warm-50 font-medium mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name..."
                  className={`w-full px-4 py-3 bg-white text-brown-900 rounded-lg border-2 ${
                    fieldErrors.name 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-transparent focus:border-brown-500 focus:ring-brown-500/20'
                  } outline-none transition-all placeholder:text-brown-400`}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-warm-50 font-medium mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your Email Address..."
                  className={`w-full px-4 py-3 bg-white text-brown-900 rounded-lg border-2 ${
                    fieldErrors.email 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-transparent focus:border-brown-500 focus:ring-brown-500/20'
                  } outline-none transition-all placeholder:text-brown-400`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>
                )}
              </div>

              {/* Country Field */}
              <div>
                <label htmlFor="country" className="block text-warm-50 font-medium mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Your Country..."
                  className="w-full px-4 py-3 bg-white text-brown-900 rounded-lg border-2 border-transparent focus:border-brown-500 focus:ring-2 focus:ring-brown-500/20 outline-none transition-all placeholder:text-brown-400"
                />
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-warm-50 font-medium mb-2">
                  How can we help? <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Your Message..."
                  className={`w-full px-4 py-3 bg-white text-brown-900 rounded-lg border-2 ${
                    fieldErrors.message 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-transparent focus:border-brown-500 focus:ring-brown-500/20'
                  } outline-none transition-all resize-none placeholder:text-brown-400`}
                ></textarea>
                {fieldErrors.message && (
                  <p className="mt-1 text-sm text-red-400">{fieldErrors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-brown-700 text-warm-50 font-semibold rounded-lg hover:bg-brown-600 active:bg-brown-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200 animate-fade-in">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold">Message sent successfully!</p>
                      <p className="text-sm mt-1">Thank you for reaching out. We'll get back to you soon.</p>
                    </div>
                  </div>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 animate-fade-in">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold">Failed to send message</p>
                      <p className="text-sm mt-1">{errorMessage || 'Something went wrong. Please try again.'}</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info Section with Social Icons */}
      <section className="border-b border-brown-800">
        <div className="container-custom py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brown-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-brown-600 transition-colors duration-200">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-warm-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-warm-50 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Email</h3>
                <p className="text-warm-300 text-sm sm:text-base">cldrarch@gmail.com</p>
              </div>

              <div className="text-center group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brown-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-brown-600 transition-colors duration-200">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-warm-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-warm-50 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Phone</h3>
                <p className="text-warm-300 text-sm sm:text-base">UK Mobile +44 7956 617010</p>
              </div>

              <div className="text-center group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brown-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-brown-600 transition-colors duration-200">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-warm-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-warm-50 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Location</h3>
                <p className="text-warm-300 text-sm sm:text-base">UK</p>
              </div>

              <div className="text-center group">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brown-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-brown-600 transition-colors duration-200">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-warm-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-warm-50 font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Social</h3>
                <div className="flex gap-2 justify-center">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Facebook" 
                    className="w-8 h-8 bg-brown-800 rounded-full flex items-center justify-center hover:bg-brown-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Instagram" 
                    className="w-8 h-8 bg-brown-800 rounded-full flex items-center justify-center hover:bg-brown-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Twitter" 
                    className="w-8 h-8 bg-brown-800 rounded-full flex items-center justify-center hover:bg-brown-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
