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
    <div className="bg-campus-bg bg-cover bg-center bg-fixed min-h-screen relative">
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black  bg-opacity-75"></div>
  
      <div className="relative p-6 max-w-6xl mx-auto ">
        {/* Header Section */}
        <header className="text-center mb-6">
          <h1 className="text-4xl font-title text-metropoliaOrange font-bold drop-shadow-lg">
            Karamalmi Campus reservations
          </h1>
          <p className="text-lg mt-2 font-body drop-shadow-lg text-white">
            Select a campus, floor, and date to view room availability.
          </p>
        </header>
  
        {/* Filters Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8  bg-opacity-90 p-4 rounded shadow-md">
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
          <div className="mt-4 md:mt-0">
            <label className="font-body font-semibold text-white">
              Select Date:
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="border border-metropoliaGray rounded-md px-2 py-1"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
  
        {/* Content Section */}
        <main>
          {loading ? (
            <p className="text-center text-white font-body drop-shadow-lg">
              Loading rooms...
            </p>
          ) : (
            <RoomList rooms={rooms} />
          )}
        </main>
      </div>
    </div>
  );
};  

export default App;
