import React, { useState, useEffect } from 'react';
import { fetchRooms } from './api';
import FloorSelector from './components/FloorSelector';
import RoomList from './components/RoomList';
import classrooms from './classrooms'; // Import the classroom data

const App = () => {
  const [selectedFloor, setSelectedFloor] = useState('All Floors');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRooms = async () => {
      setLoading(true);

      try {
        let fetchedRooms = [];
        if (selectedFloor === 'All Floors') {
          // Fetch classrooms for all floors
          const allFloors = Object.keys(classrooms);
          const allReservations = await Promise.all(
            allFloors.map((floor) => fetchRooms(floor))
          );
          fetchedRooms = allReservations.flat(); // Flatten the results into a single array
        } else {
          // Fetch classrooms for the selected floor
          fetchedRooms = await fetchRooms(selectedFloor);
        }

        setRooms(fetchedRooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    getRooms();
  }, [selectedFloor]);

  useEffect(() => {
    // Trigger initial fetch for "All Floors" on load
    setSelectedFloor('All Floors');
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Karamalmi Campus Room Checker</h1>
      <FloorSelector selectedFloor={selectedFloor} onFloorChange={setSelectedFloor} />
      {loading ? (
        <p className="text-center text-gray-500">Loading rooms...</p>
      ) : (
        <RoomList rooms={rooms} />
      )}
    </div>
  );
};

export default App;
