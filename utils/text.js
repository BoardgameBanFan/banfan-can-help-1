/**
 * Clean HTML content from description text and truncate if needed
 * @param {string} description - The text to clean
 * @param {number} [maxLength=100] - Maximum length before truncating
 * @returns {string} Cleaned and truncated text
 */
export const cleanDescription = (description, maxLength = 100) => {
  if (!description) return 'No description available';

  // Remove HTML tags and decode HTML entities
  const cleanText = description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#10;/g, ' '); // Replace newlines with spaces

  return cleanText.length > maxLength ? cleanText.substring(0, maxLength) + '...' : cleanText;
};
