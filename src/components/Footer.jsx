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
                <div className="flex gap-3 justify-center">
                  <a 
                    href="https://www.facebook.com/share/1AnzCLsbRM/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Facebook" 
                    className="w-10 h-10 bg-brown-800 rounded-full flex items-center justify-center hover:bg-brown-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/john-g-price-riba-mciarb-47532b22" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="LinkedIn" 
                    className="w-10 h-10 bg-brown-800 rounded-full flex items-center justify-center hover:bg-brown-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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
