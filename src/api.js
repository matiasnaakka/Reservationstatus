import axios from 'axios';
import classrooms from './classrooms';

const API_BASE_URL = 'https://tilastatusapivaan-1b10756d977e.herokuapp.com/api/reservations';

export const fetchRooms = async (floor, date = new Date().toISOString().split('T')[0], showOnlyStaffWorkspace = false) => {
  const rangeStart = `${date}T00:00:00`;
  const rangeEnd = `${date}T23:59:59`;

  // Suodata vain halutut huoneet
  const floorRooms = classrooms[floor] || [];
  const filteredRooms = floorRooms.filter((room) => {
    if (showOnlyStaffWorkspace) {
      return room.typeEn === 'Staff Workspace'; // Näytä vain henkilöstön työtilat
    }
    return true; // Näytä kaikki tilat, jos ei suodatusta
  });

  const roomNames = filteredRooms.map((room) => room.name);

  if (roomNames.length === 0) {
    // Lisää kerroksen tieto suoraan, vaikka ei ole varaustietoja
    return filteredRooms.map((room) => ({
      ...room,
      floor,
      reserved: false,
      reservationDetails: null,
    }));
  }

  try {
    // Tee yksi API-kutsu kaikille huoneille kerroksessa
    const response = await axios.post(API_BASE_URL, {
      rangeStart,
      rangeEnd,
      room: roomNames,
    });

    const reservations = response.data.reservations || [];
    return filteredRooms.map((room) => {
      const reservation = reservations.find((res) =>
        res.resources.some((resource) => resource.code === room.name)
      );

      return {
        ...room,
        floor, // Lisää kerroksen tieto
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