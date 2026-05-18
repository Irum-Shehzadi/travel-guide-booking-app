// API service for Places endpoints
const API_BASE_URL = "https://travel-guide-fyp.duckdns.org";

/**
 * Search for places using Serper.dev Google Places API
 * @param {string} query - Search query (e.g., "restaurants in Lahore")
 * @param {string} location - Location context (default: "Pakistan")
 * @param {string} gl - Country code (default: "pk")
 * @param {number} num - Number of results (default: 10)
 * @returns {Promise} - Promise resolving to places search results
 */
export const searchPlaces = async (query, location = "Pakistan", gl = "pk", num = 10) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/places/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                location,
                gl,
                num
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to search places');
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching places:', error);
        throw error;
    }
};

/**
 * Search for places using GET endpoint (alternative)
 * @param {string} query - Search query
 * @param {Object} options - Optional parameters (location, gl, num)
 * @returns {Promise} - Promise resolving to places search results
 */
export const searchPlacesGet = async (query, options = {}) => {
    const { location = "Pakistan", gl = "pk", num = 10 } = options;

    try {
        const params = new URLSearchParams({
            location,
            gl,
            num: num.toString()
        });

        const response = await fetch(
            `${API_BASE_URL}/api/places/search/${encodeURIComponent(query)}?${params}`
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to search places');
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching places:', error);
        throw error;
    }
};
