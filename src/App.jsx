import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchRooms } from './api';
import RoomList from './components/RoomList';
import Instructions from './components/instructions';
import Clock from './components/Clock';
import campuses from './campuses';

const App = () => {
  const [searchParams] = useSearchParams();

  // Application state
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStaffWorkspace, setShowStaffWorkspace] = useState(false);

  // Update application state based on URL parameters
  useEffect(() => {
    const floor = searchParams.get('floor') || 'All Floors';
    const campus = searchParams.get('building') || 'Karamalmi';
    const specificDate = searchParams.get('specificdate') || new Date().toISOString().split('T')[0];
    const staffWorkspaceParam = searchParams.get('Staffworkspace') === 'true';

    setSelectedFloor(floor);
    setSelectedCampus(campus);
    setSelectedDate(new Date(specificDate));
    setShowStaffWorkspace(staffWorkspaceParam);
  }, [searchParams]);

  // Fetch data logic
  const fetchData = async () => {
    if (!selectedFloor || !selectedCampus || !selectedDate) return;
    setLoading(true);

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const floors = selectedFloor === 'All Floors' ? campuses[selectedCampus] : [selectedFloor];

      // Fetch rooms from API
      const allRooms = await Promise.all(
        floors.map((floor) => fetchRooms(floor, formattedDate, showStaffWorkspace))
      );

      setRooms(allRooms.flat());
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data whenever state changes
  useEffect(() => {
    fetchData();
  }, [selectedFloor, selectedCampus, selectedDate, showStaffWorkspace]);

  return (
    <div className="bg-campus-bg bg-cover bg-center bg-fixed h-screen w-screen flex">
      {/* Left side: Reservations */}
      <div className="w-3/5 h-full p-4 bg-gray-100 overflow-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-title text-metropoliaOrange font-bold drop-shadow-lg">
              Campus Reservations
            </h1>
            <p className="text-lg mt-2 font-body drop-shadow-lg text-gray-800">
              {showStaffWorkspace
                ? 'Showing staff workspaces only.'
                : `Showing room availability for floor ${selectedFloor} at ${selectedCampus}.`}
            </p>
          </div>
          <Clock />
        </header>

        <main className="h-full">
          {loading ? (
            <p className="text-center text-gray-800 font-body drop-shadow-lg">Loading rooms...</p>
          ) : (
            <RoomList rooms={rooms} />
          )}
        </main>
      </div>

      {/* Right side: Map (placeholder for now) */}
      <div className="w-2/5 h-full p-4 bg-gray-200 flex items-center justify-center">
        <div className="text-xl text-gray-600">
          Kartta näkyy tässä kohtaa tulevaisuudessa!
        </div>
      </div>
    </div>
  );
};

export default App;
