import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchAllRooms } from "./api";
import RoomList from "./components/RoomList";
import RoomMap from "./components/RoomMap";
import Instructions from "./components/instructions";
import { isRoomReserved } from "./components/RoomList";


const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const autoScroll = searchParams.get("autoScroll") === "true"; // ✅ Read autoScroll from URL
  const navigate = useNavigate();

  // Get current date in YYYY-MM-DD format
  const currentDate = new Date().toISOString().split("T")[0];

  // Extract floor and reservable settings from URL parameters
  const showFree = searchParams.get("showFree") === "true";
  const floorFromURL = showFree ? "all" : searchParams.get("floor") || "2";
  const reservableFilterFromURL = searchParams.get("reservable") === "students";

  const [selectedFloor, setSelectedFloor] = useState(floorFromURL);
  const [reservableFilter, setReservableFilter] = useState(reservableFilterFromURL);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [language, setLanguage] = useState("en");


  // Floors list for dropdown
  const floors = ["2", "5", "6", "7"];

  // Determine audience (students or staff/teachers)
  const reservableAudience = reservableFilter
    ? language === "en"
      ? "Reservable for Students"
      : "Varattavissa opiskelijoille"
    : language === "en"
      ? "Reservable for Staff"
      : "Varattavissa henkilökunnalle";


  // Translations
  const translations = {
    en: {
      title: "Campus Rooms Available",
      showInstructions: "Show Instructions",
      hideInstructions: "Hide Instructions",
      floor: "Floor",
      loading: "Loading rooms...",
      noRooms: "No rooms available for the selected criteria.",
      closeMap: "Close Map",
      filterStudents: "Show Student Reservable Rooms",
      allRooms: "Show All Rooms",
    },
    fi: {
      title: "Kampuksen Huoneet ",
      showInstructions: "Näytä ohjeet",
      hideInstructions: "Piilota ohjeet",
      floor: "Kerros",
      loading: "Ladataan huoneita...",
      noRooms: "Valitulla hakuehdolla ei ole vapaita huoneita.",
      closeMap: "Sulje kartta",
      filterStudents: "Näytä opiskelijoiden varattavat tilat",
      allRooms: "Näytä kaikki tilat",
    },
  };

  // Ensure URL parameters match selected values
  useEffect(() => {
    const params = new URLSearchParams(searchParams); // Preserve existing params

    // If showFree is active, override the floor filter
    if (showFree) {
      params.set("showFree", "true");
    } else {
      params.set("floor", selectedFloor);
    }

    params.set("specificdate", currentDate); // Always use current date

    if (reservableFilter) {
      params.set("reservable", "students");
    } else {
      params.delete("reservable");
    }

    // Ensure autoScroll stays in the URL
    if (autoScroll) {
      params.set("autoScroll", "true");
    } else {
      params.delete("autoScroll");
    }

    // Update the URL without reloading the page
    navigate(`?${params.toString()}`, { replace: true });
}, [selectedFloor, reservableFilter, showFree, autoScroll, navigate, searchParams]);



  const fetchData = async () => {
    setLoading(true);
    try {
      let allRooms = [];

      if (showFree) {
        // Fetch rooms from all floors
        const floorsToFetch = ["2", "5", "6", "7"];
        const roomPromises = floorsToFetch.map((floor) =>
          fetchAllRooms(floor, `${currentDate}T00:00`, `${currentDate}T23:59`)
        );
        const results = await Promise.all(roomPromises);
        allRooms = results.flat();

        // Filter only free rooms
        allRooms = allRooms.filter((room) => !isRoomReserved(room));
      } else {
        // Fetch rooms for the selected floor
        allRooms = await fetchAllRooms(selectedFloor, `${currentDate}T00:00`, `${currentDate}T23:59`);
      }

      // Apply filtering if "reservable=students" is set
      if (reservableFilter) {
        allRooms = allRooms.filter((room) => room.reservableStudents === "true");
      }

      setRooms(allRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Automatically switch language every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLanguage((prevLanguage) => (prevLanguage === "en" ? "fi" : "en"));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Fetch rooms when the floor or reservable filter changes
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [selectedFloor, reservableFilter]);

  return (
    <div className="h-screen w-screen flex bg-gray-100">
      {/* Left side: Reservations (Full width when floor 2 is selected) */}
      <div className={`relative w-full ${selectedFloor === "2" ? "md:w-full" : "md:w-5/7"} h-full p-4 overflow-auto`}>
        <header className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-title text-metropoliaOrange font-bold drop-shadow-lg flex items-center">
              {translations[language].title}
              <span className="ml-4 text-lg text-gray-600 bg-gray-200 px-3 py-1 rounded-md shadow-sm">
                {reservableAudience}
              </span>
            </h1>

            {/* Hover Container for Show Instructions Button */}
            <div className="relative group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="hidden md:block text-sm bg-white border px-4 py-2 rounded shadow-md"
                  onClick={() => setShowInstructions(!showInstructions)}
                >
                  {showInstructions
                    ? translations[language].hideInstructions
                    : translations[language].showInstructions}
                </button>
              </div>
            </div>


            {/* Hover Container for Floor Selector */}
            <div className="relative group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="text-sm bg-white border px-4 py-2 rounded shadow-md"
                >
                  {floors.map((floor) => (
                    <option key={floor} value={floor}>
                      {`${translations[language].floor} ${floor}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hover Container for Language Toggle */}
            <div className="relative group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  className="text-sm bg-gray-500 text-white px-4 py-2 rounded shadow-md"
                  onClick={() => setLanguage(language === "en" ? "fi" : "en")}
                >
                  {language === "en" ? "🇬🇧 English" : "🇫🇮 Suomi"}
                </button>
              </div>
            </div>

            {/* Toggle Student Reservable Rooms (Only in Mobile) */}
            <button
              className="text-sm bg-blue-500 text-white px-4 py-2 rounded shadow-md md:hidden"
              onClick={() => setReservableFilter(!reservableFilter)}
            >
              {reservableFilter
                ? translations[language].allRooms
                : translations[language].filterStudents}
            </button>
          </div>
        </header>

        {/* Conditionally render instructions */}
        {showInstructions && <Instructions />}

        {/* Always render RoomList */}
        <main className="h-full">
          {loading ? (
            <p className="text-center text-gray-800 font-body drop-shadow-lg">
              {translations[language].loading}
            </p>
          ) : (
            <RoomList rooms={rooms} language={language} autoScroll={autoScroll} />
          )}
        </main>
      </div>

      {/* Right side: Room Map (Hidden when showFree=true) */}
      {!showFree && selectedFloor !== "2" && (
        <div className={`absolute md:static inset-0 md:w-2/7 h-full p-4 bg-gray-200 flex flex-col items-center ${showMap ? "flex" : "hidden md:flex"}`}>
          <div className="relative w-full h-full">
            <RoomMap rooms={rooms} selectedFloor={selectedFloor} />
            <button
              className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg md:hidden"
              onClick={() => setShowMap(false)}
            >
              {translations[language].closeMap}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
