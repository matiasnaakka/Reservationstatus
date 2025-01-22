import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchBusinessHours, fetchFilteredRoomsWithReservations } from "./api";
import RoomList from "./components/RoomList";
import RoomMap from "./components/RoomMap";
import Clock from "./components/Clock";
import Instructions from "./components/instructions";

const App = () => {
  const [searchParams] = useSearchParams();

  // State variables
  const [selectedFloor, setSelectedFloor] = useState(""); // Initially empty
  const [selectedCampus, setSelectedCampus] = useState("Karamalmi");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [campusStatus, setCampusStatus] = useState("Checking campus status...");
  const [showMap, setShowMap] = useState(false); // State to toggle map visibility in mobile view
  const [showInstructions, setShowInstructions] = useState(false); // State to toggle instructions display

  // Floors list for dropdown
  const floors = ["2", "5", "6", "7"];

  // Read URL parameters
  const staffOnly = searchParams.get("Staffworkspace");
  const floorFromURL = searchParams.get("floor") || floors[0]; // Default to the first floor (2)
  const specificDate = searchParams.get("specificdate") || new Date().toISOString().split("T")[0];

  useEffect(() => {
    // Initialize floor state from URL parameters
    if (floors.includes(floorFromURL)) {
      setSelectedFloor(floorFromURL); // Only update if the floor is valid
    } else {
      setSelectedFloor(floors[0]); // Default to the first floor
    }
  }, [floorFromURL]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Format date for API query
      const startDate = `${specificDate}T00:00`;
      const endDate = `${specificDate}T23:59`;

      // Fetch rooms with reservations
      const roomsWithReservations = await fetchFilteredRoomsWithReservations(
        selectedFloor,
        staffOnly,
        startDate,
        endDate
      );

      setRooms(roomsWithReservations);
    } catch (error) {
      console.error("Error fetching rooms with reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkCampusStatus = async () => {
    try {
      const campuses = await fetchBusinessHours();
      const currentDay = new Date().toLocaleString("en-US", { weekday: "long" }).toLowerCase(); // e.g., 'monday'
      const currentTime = new Date();
      const currentCampus = campuses.find((campus) => campus.name === selectedCampus);

      if (currentCampus) {
        const todayHours = currentCampus.hours[currentDay];

        if (todayHours.isClosed) {
          setCampusStatus("Campus is currently closed.");
        } else {
          const openingTime = new Date(currentTime);
          openingTime.setHours(todayHours.hours, todayHours.minutes, 0, 0);

          const closingTime = new Date(currentTime);
          closingTime.setHours(todayHours.closeHours, todayHours.closeMinutes, 0, 0);

          if (currentTime >= openingTime && currentTime <= closingTime) {
            setCampusStatus("Campus is currently open.");
          } else {
            setCampusStatus("Campus is currently closed.");
          }
        }
      } else {
        setCampusStatus("Campus hours data not found.");
      }
    } catch (error) {
      console.error("Error checking campus status:", error);
      setCampusStatus("Unable to determine campus status.");
    }
  };

  useEffect(() => {
    checkCampusStatus();
    fetchData();

    // Set up an interval to refresh data every 1 minute
    const interval = setInterval(() => {
      fetchData();
      checkCampusStatus();
    }, 60000); // 60 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [selectedFloor, staffOnly, specificDate]);

  // Determine if campus is closed
  const isCampusClosed = campusStatus.includes("closed");

  return (
    <div className="h-screen w-screen flex bg-gray-100">
      {/* Left side: Reservations */}
      <div
        className={`relative w-full ${showMap ? "hidden" : "block"} md:w-4/6 h-full p-4 overflow-auto`}
      >
        <header className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-title text-metropoliaOrange font-bold drop-shadow-lg">
              Campus Reservations
            </h1>
            <button
              className="hidden md:block text-sm bg-white border px-4 py-2 rounded shadow-md"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              {showInstructions ? "Hide URL Parameters" : "Url Parameters"}
            </button>
            {/* Dropdown for selecting floors */}
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="text-sm bg-white border px-4 py-2 rounded shadow-md"
            >
              {floors.map((floor) => (
                <option key={floor} value={floor}>
                  {`Floor ${floor}`}
                </option>
              ))}
            </select>
          </div>
          <div className="hidden md:block">
            {/* Hide Clock in mobile */}
            <Clock />
          </div>
        </header>

        {/* Conditionally render instructions */}
        {showInstructions && <Instructions />}

        {/* Conditionally render GIF if campus is closed */}
        {isCampusClosed ? (
          <div className="flex flex-col items-center justify-center mt-8">
            <img
              src="/closed-campus.gif" // Path to your GIF file in the public folder
              alt="Campus is closed"
              className="max-w-md"
            />
            <p className="text-lg mt-4 text-gray-800">Campus is currently closed.</p>
          </div>
        ) : (
          <main className="h-full">
            {loading ? (
              <p className="text-center text-gray-800 font-body drop-shadow-lg">Loading rooms...</p>
            ) : (
              <RoomList rooms={rooms} />
            )}
          </main>
        )}

        {/* Show map button in mobile view */}
        <button
          className="block md:hidden fixed bottom-4 right-4 bg-orange-500 text-white px-4 py-2 rounded shadow-lg"
          onClick={() => setShowMap(true)}
        >
          Show Map
        </button>
      </div>

      {/* Right side: Room Map */}
      <div
        className={`absolute md:static inset-0 md:w-2/6 h-full p-4 bg-gray-200 flex flex-col items-center ${showMap ? "flex" : "hidden md:flex"
          }`}
      >
        <div className="relative w-full h-full">
          <RoomMap rooms={rooms} selectedFloor={selectedFloor} />
          {/* Close map button in mobile view */}
          <button
            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg md:hidden"
            onClick={() => setShowMap(false)}
          >
            Close Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
