import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import Header from '../components/Header';

const Resume = () => {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchCV = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'cv')
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setCvData(data);
        }
      } catch (error) {
        console.error('Error fetching CV:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, []);

  const handleDownloadAsPDF = async () => {
    setDownloading(true);
    
    try {
      const imageUrl = cvData.image_url || cvData.imageUrl;
      if (imageUrl) {
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>CV - Download as PDF</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                }
                img {
                  max-width: 100%;
                  height: auto;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                @media print {
                  body {
                    padding: 0;
                  }
                  img {
                    box-shadow: none;
                    max-width: 100%;
                    page-break-inside: avoid;
                  }
                }
              </style>
            </head>
            <body>
              <img src="${imageUrl}" alt="CV" onload="window.print(); setTimeout(() => window.close(), 100);" />
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Failed to download CV. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-600 mx-auto"></div>
            <p className="mt-4 text-brown-600">Loading CV...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container-custom py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-brown-900 mb-4">
              Curriculum Vitae
            </h1>
            <p className="text-brown-600 text-lg">
              Professional Background & Experience
            </p>
          </div>

          {cvData && (cvData.image_url || cvData.imageUrl) ? (
            <>
              {/* Download PDF Button - Always show if CV exists */}
              <div className="text-center mb-8">
                <button
                  onClick={handleDownloadAsPDF}
                  disabled={downloading}
                  className="inline-flex items-center gap-2 bg-brown-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-brown-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Preparing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download as PDF
                    </>
                  )}
                </button>
                <p className="text-sm text-brown-500 mt-2">
                </p>
              </div>

              {/* CV Image Display */}
              {(cvData.image_url || cvData.imageUrl) && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
                  <img
                    src={cvData.image_url || cvData.imageUrl}
                    alt="Curriculum Vitae"
                    className="max-w-3xl mx-auto h-auto rounded-lg shadow-md"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Alternative Download Link */}
              <div className="text-center mt-6">
                <p className="text-brown-600 text-sm">
                </p>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <svg className="w-16 h-16 text-brown-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-2xl font-bold text-brown-900 mb-2">CV Not Available</h2>
              <p className="text-brown-600">
                The CV has not been uploaded yet. Please check back later.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer with Contact Info */}
      <footer className="bg-brown-900 text-warm-200">
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
      </footer>
    </div>
  );
};

export default Resume;
