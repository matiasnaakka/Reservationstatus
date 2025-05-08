

/**
 * Fetches all available rooms based on the specified floor and date range.
 *
 * @async
 * @function fetchAllRooms
 * @param {number} floor - The floor number to filter rooms by.
 * @param {string} startDate - The start date for the availability search (in ISO format).
 * @param {string} endDate - The end date for the availability search (in ISO format).
 * @returns {Promise<Object[]>} A promise that resolves to an array of room objects.
 * @throws {Error} Throws an error if the API request fails.
 */
import axios from "axios";

const API_BASE_URL = "https://opendataapi-6c68c2d89038.herokuapp.com";
const API_KEY = import.meta.env.VITE_API_KEY;

export const fetchAllRooms = async (floor, startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/rooms/freespace-full`, {
      headers: { apikey: API_KEY },
      params: {
        floor,
        startDate,
        endDate,
      },
    });
    return response.data.rooms; // Return the room data
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};