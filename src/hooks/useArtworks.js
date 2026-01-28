import { useState, useEffect } from 'react';
import { getAllArtworks } from '../services/artworkService';

export const useArtworks = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllArtworks();
      setArtworks(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching artworks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  const refetch = () => {
    fetchArtworks();
  };

  return {
    artworks,
    loading,
    error,
    refetch,
  };
};
