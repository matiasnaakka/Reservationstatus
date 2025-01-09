import axios from 'axios'; // Add this line at the top of api.js

const API_BASE_URL = 'https://tilastatusapivaan-1b10756d977e.herokuapp.com/api/reservations';

import classrooms from './classrooms';

export const fetchRooms = async (floor, date = new Date().toISOString().split('T')[0]) => {
  const rangeStart = `${date}T00:00:00`;
  const rangeEnd = `${date}T23:59:59`;

  const floorRooms = classrooms[floor] || [];
  const roomNames = floorRooms.map((room) => room.name);

  if (roomNames.length === 0) return floorRooms;

  try {
    const response = await axios.post(API_BASE_URL, {
      rangeStart,
      rangeEnd,
      room: roomNames,
    });

    const reservations = response.data.reservations || [];
    return floorRooms.map((room) => {
      const reservation = reservations.find((res) =>
        res.resources.some((resource) => resource.code === room.name)
      );

      return {
        ...room,
        floor,
        reserved: !!reservation,
        reservationDetails: reservation
          ? {
              subject: reservation.subject,
              startDate: reservation.startDate,
              endDate: reservation.endDate,
            }
          : null,
      };
    });
  } catch (error) {
    console.error('Error fetching rooms by floor:', error);
    throw error;
  }
};
