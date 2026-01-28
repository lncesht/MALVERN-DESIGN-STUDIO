// Exhibit service for managing exhibit images
// Currently using static assets from public/img_exhibit
// TODO: Migrate to Supabase storage bucket 'img_exhibit' when ready

// List of exhibit images from public/img_exhibit
const EXHIBIT_IMAGES = [
  'DSC_0030.JPG',
  'DSC_0031.JPG',
  'DSC_0032.JPG',
  'DSC_0033.JPG',
  'DSC_0034.JPG',
  'DSC_0035.JPG',
  'DSC_0036.JPG',
  'DSC_0037.JPG',
  'DSC_0038.JPG',
  'DSC_0039.JPG',
  'DSC_0040.JPG',
  'DSC_0041.JPG',
  'DSC_0042.JPG',
  'DSC_0043.JPG',
  'DSC_0044.JPG',
  'DSC_0045.JPG',
  'DSC_0046.JPG',
  'DSC_0048.JPG',
  'DSC_0049.JPG',
  'DSC_0050.JPG',
  'DSC_0072.JPG',
  'DSC_0073.JPG',
  'DSC_0074.JPG',
  'DSC_0075.JPG',
  'DSC_0077.JPG',
  'DSC_0079.JPG',
  'DSC_0091.JPG',
  'DSC_0102.JPG',
  'DSC_0112.JPG',
  'DSC_0144.JPG',
  'exhibits1.JPG'
];

// Get all exhibit images
export const getAllExhibits = async () => {
  try {
    // For now, return static image data
    // TODO: Replace with Supabase storage bucket fetch when migrated
    const exhibits = EXHIBIT_IMAGES.map((filename, index) => ({
      id: index + 1,
      title: `Exhibit ${index + 1}`,
      imageUrl: `/img_exhibit/${filename}`,
      filename: filename,
      // Add more metadata as needed
    }));

    return exhibits;
  } catch (error) {
    console.error('Error getting exhibits:', error);
    throw error;
  }
};

// Get single exhibit by ID
export const getExhibitById = async (id) => {
  try {
    const exhibits = await getAllExhibits();
    const exhibit = exhibits.find(ex => ex.id === parseInt(id));

    if (!exhibit) {
      throw new Error('Exhibit not found');
    }

    return exhibit;
  } catch (error) {
    console.error('Error getting exhibit:', error);
    throw error;
  }
};

// TODO: Add functions for Supabase integration when ready
// export const uploadExhibitImage = async (file) => { ... }
// export const deleteExhibitImage = async (id) => { ... }
