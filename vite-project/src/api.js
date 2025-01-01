import axios from 'axios';

const API_BASE_URL = '/api/r1/reservation/search';
const API_KEY = 'uXIj6PjeH9oUHC6IQ7qG';
import classrooms from './classrooms'; // Classroom details

// Fetch rooms by floor
export const fetchRooms = async (floor, date = new Date().toISOString().split('T')[0]) => {
  const rangeStart = `${date}T00:00:00`;
  const rangeEnd = `${date}T23:59:59`;

  const floorRooms = classrooms[floor] || [];
  const roomNames = floorRooms.map((room) => room.name);

  if (roomNames.length === 0) return floorRooms;

  try {
    const response = await axios.post(
      API_BASE_URL,
      { rangeStart, rangeEnd, room: roomNames },
      {
        headers: {
          Authorization: `Basic ${btoa(API_KEY + ':')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reservations = response.data.reservations || [];
    return floorRooms.map((room) => {
      const reservation = reservations.find((res) =>
        res.resources.some((resource) => resource.code === room.name)
      );

      return {
        ...room,
        reserved: !!reservation,
        reservationDetails: reservation ? reservation.subject : null,
      };
    });
  } catch (error) {
    console.error('Error fetching rooms by floor:', error);
    throw error;
  }
};
