import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchRooms } from './api';
import CampusSelector from './components/CampusSelector';
import FloorSelector from './components/FloorSelector';
import RoomList from './components/RoomList';
import campuses from './campuses';

// Default campus and floors
const defaultCampus = 'Karamalmi';

const App = () => {
  const [selectedCampus, setSelectedCampus] = useState(defaultCampus);
  const [selectedFloor, setSelectedFloor] = useState('All Floors'); // Default to "All Floors"
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with today's date

  const fetchData = async () => {
    setLoading(true);

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const floors = selectedFloor === 'All Floors'
        ? campuses[selectedCampus]
        : [selectedFloor];

      // Fetch rooms for selected floors
      const allRooms = await Promise.all(
        floors.map((floor) => fetchRooms(floor, formattedDate))
      );

      setRooms(allRooms.flat()); // Flatten room data
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the page loads or when campus/floor/date changes
  }, [selectedCampus, selectedFloor, selectedDate]);

  useEffect(() => {
    // Refresh data every 2 minutes
    const interval = setInterval(() => {
      fetchData();
    }, 120000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [selectedCampus, selectedFloor, selectedDate]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <CampusSelector
          selectedCampus={selectedCampus}
          onCampusChange={(campus) => {
            setSelectedCampus(campus);
            setSelectedFloor('All Floors'); // Reset floor selection when campus changes
          }}
        />
        <FloorSelector
          selectedFloor={selectedFloor}
          onFloorChange={setSelectedFloor}
          availableFloors={campuses[selectedCampus]} // Show only floors for the selected campus
        />
        <div>
          <label className="font-semibold mr-2">Select Date:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border rounded-md px-2 py-1"
            dateFormat="yyyy-MM-dd"
          />
        </div>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading rooms...</p>
      ) : (
        <RoomList rooms={rooms} />
      )}
    </div>
  );
};

export default App;
