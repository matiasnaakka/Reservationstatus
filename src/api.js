import axios from "axios";

const API_BASE_URL = "https://opendataapi-6c68c2d89038.herokuapp.com";
const API_KEY = import.meta.env.VITE_API_KEY;


// Fetch filtered rooms with reservation data
export const fetchFilteredRoomsWithReservations = async (floor, Staffworkspace, startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/rooms/reservations`, {
      headers: { apikey: API_KEY },
      params: { floor, Staffworkspace, startDate, endDate }, // Pass query parameters
    });
    console.log("Filtered rooms with reservations fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching filtered rooms with reservations:", error);
    throw error;
  }
};


// Fetch business hours
export const fetchBusinessHours = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/businesshours`, {
      headers: { apikey: API_KEY },
    });
    console.log("Business hours fetched:", response.data);
    return response.data.campuses;
  } catch (error) {
    console.error("Error fetching business hours:", error);
    throw error;
  }
};

// Fetch reservations for a specific room
export const fetchReservations = async (roomNumber, building, startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reservations`, {
      headers: { apikey: API_KEY },
      params: {
        room: roomNumber,
        building,
        startDate,
        endDate,
      },
    });
    console.log("Reservations fetched:", response.data.reservations);
    return response.data.reservations || [];
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }
};
