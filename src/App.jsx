import React, { useState, useEffect, lazy, Suspense } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchAllRooms } from "./api";
const RoomList = lazy(() => import("./components/RoomList"));
const RoomMap = lazy(() => import("./components/RoomMap"));
const Instructions = lazy(() => import("./components/instructions"));
import { isRoomReserved } from "./components/RoomList";


const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const autoScroll = searchParams.get("autoScroll") === "true"; // ✅ Read autoScroll from URL
  const loopMode = searchParams.get("loopMode") === "true"; // ✅ Read loop mode from URL
  const navigate = useNavigate();

  // Extract floor and reservable settings from URL parameters
  const showFree = !searchParams.has("floor") || searchParams.get("showFree") === "true";
  const reservableFilterFromURL = searchParams.get("reservable");

  const reservableStudentsFilter = reservableFilterFromURL === "students";
  const reservableStaffFilter = reservableFilterFromURL === "staff";
  // ✅ Define floorFromURL before using it
  const floorFromURL = searchParams.get("floor") || "all";

  // ✅ Add new state for filtering by staff
  const [reservableStudents, setReservableStudents] = useState(reservableStudentsFilter);
  const [reservableStaff, setReservableStaff] = useState(reservableStaffFilter);
  const [selectedFloor, setSelectedFloor] = useState(floorFromURL);
  const [reservableFilter, setReservableFilter] = useState(reservableFilterFromURL);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]); // ✅ Add this state
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showFullScreenMap, setShowFullScreenMap] = useState(loopMode);
  const [showFeedbackScreen, setShowFeedbackScreen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20); // Timer countdown (seconds)
  const [nextScreen, setNextScreen] = useState("Feedback Screen"); // Text for what's next


  // Floors list for dropdown
  const floors = ["2", "5", "6", "7"];

  const reservableAudience =
    selectedFloor !== "all" && (reservableStudents || reservableStaff)
      ? reservableStudents
        ? language === "en"
          ? "Reservable for Students"
          : "Varattavissa opiskelijoille"
        : language === "en"
          ? "Reservable for Staff"
          : "Varattavissa henkilökunnalle"
      : ""; // Hide when no filters are applied

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
      scanQRCode: "📲 Scan the room's QR code to reserve it.",
      nextScreen: "Coming next:",
      timeLeft: "",
      roomListMap: "Room List & Map",
      feedbackScreen: "Feedback Screen",
      fullMap: "Full Map",
    },
    fi: {
      title: "Kampuksen Vapaat Tilat",
      showInstructions: "Näytä ohjeet",
      hideInstructions: "Piilota ohjeet",
      floor: "Kerros",
      loading: "Ladataan huoneita...",
      noRooms: "Valitulla hakuehdolla ei ole vapaita huoneita.",
      closeMap: "Sulje kartta",
      filterStudents: "Näytä opiskelijoiden varattavat tilat",
      allRooms: "Näytä kaikki tilat",
      scanQRCode: "📲 Skannaa huoneen QR-koodi varataksesi sen.",
      nextScreen: "Seuraavaksi:",
      timeLeft: "",
      roomListMap: "Huonelista & Kartta",
      feedbackScreen: "Palaute-näyttö",
      fullMap: "Koko näytön kartta",
    },
  };


  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (reservableStudents) {
      params.set("reservable", "students");
    } else if (reservableStaff) {
      params.set("reservable", "staff");
    } else {
      params.delete("reservable");
    }

    if (selectedFloor !== "all") {
      params.set("floor", selectedFloor);
    } else {
      params.delete("floor"); // ✅ Remove floor if "all" is selected
    }

    navigate(`?${params.toString()}`, { replace: true });
  }, [reservableStudents, reservableStaff, selectedFloor, navigate, searchParams]); // ✅ Added `selectedFloor`

  const fetchData = async () => {
    setLoading(true);
    try {
      const currentDate = new Date().toISOString().split("T")[0]; // ✅ Compute inside function
      console.log("Current date:", currentDate); // ✅ Debugging  

      let allRooms = [];

      if (!reservableFilter) { // ✅ No reservable filter = Fetch all free rooms
        const floorsToFetch = ["2", "5", "6", "7"];
        const roomPromises = floorsToFetch.map(floor =>
          fetchAllRooms(floor, `${currentDate}T00:00`, `${currentDate}T23:59`)
        );
        const results = await Promise.all(roomPromises);
        allRooms = results.flat();
      } else {
        allRooms = await fetchAllRooms(selectedFloor, `${currentDate}T00:00`, `${currentDate}T23:59`);
      }

      console.log("All rooms fetched:", allRooms);

      // ✅ Update filtering to include staff-reservable rooms
      const filteredRoomCards = allRooms.filter((room) =>
        !isRoomReserved(room) &&
        (
          (!reservableStudents && !reservableStaff) || // ✅ No filter applied = show all
          (reservableStudents && room.reservableStudents === "true") ||
          (reservableStaff && room.reservableStaff === "true")
        )
      );

      setRooms(allRooms);
      setFilteredRooms(filteredRoomCards);
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
    }, 20000);

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

  useEffect(() => {
    if (loopMode) {
      let counter = 0;
      setTimeLeft(20); // Start with Room List & Map for 5s
      setNextScreen(translations[language].fullMap);

      const interval = setInterval(() => {
        counter = (counter + 1) % 3; // 🔄 Cycle through 3 states correctly

        if (counter === 0) {
          // ✅ Show Room List & Map for 5s
          setShowFullScreenMap(false);
          setShowFeedbackScreen(false);
          setTimeLeft(5);
          setNextScreen(translations[language].fullMap);
        } else if (counter === 1) {
          // ✅ Show Full Map for 5s
          setShowFullScreenMap(true);
          setShowFeedbackScreen(false);
          setTimeLeft(5);
          setNextScreen(translations[language].feedbackScreen);
        } else if (counter === 2) {
          // ✅ Show Feedback Screen for 5s
          setShowFullScreenMap(false); // 🔹 Ensure Full Screen Map is disabled
          setShowFeedbackScreen(true);
          setTimeLeft(5);
          setNextScreen(translations[language].roomListMap);
        }
      }, 5000); // 🔹 Correct cycle time (5s per state)

      return () => clearInterval(interval);
    }
  }, [loopMode, language]); // 🔹 Ensure it updates when language changes  

  useEffect(() => {
    if (loopMode) {
      const countdown = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : prev));
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [loopMode, timeLeft]);


  return (

    <div className="h-screen w-screen flex bg-gray-100">
      {/* ✅ Countdown Banner (Only if loopMode is active) */}
      {loopMode && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all duration-500 ease-in-out transform z-[9999] flex items-center space-x-3">
          {/* Text on the left */}
          <div className="text-right">
            <p className="text-sm opacity-80 tracking-wide">{translations[language].nextScreen}</p>
            <p className="text-lg font-extrabold tracking-widest">{nextScreen}</p>
          </div>
          {/* Timer Ball on the right (Jumping) */}
          <div className="w-12 h-12 flex items-center justify-center bg-white text-black rounded-full font-extrabold text-xl shadow-md animate-bounce">
            {timeLeft}
          </div>
        </div>
      )}


      {/* ✅ Fullscreen Feedback Screen Mode (Only if loopMode=true) */}
      {loopMode && showFeedbackScreen ? (
        <div className="absolute inset-0 font-sans flex justify-center items-center bg-white transition-opacity duration-1000">
          {/* 📢 Centered Feedback Section */}
          <div className="flex flex-col items-center text-center max-w-2xl px-4">
            {/* 🖼️ Enlarged GIF at the Top */}
            <div className="w-96 lg:w-96">
              <img
                src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3U2NWptcHI2ZXhxZm9wdnRsNWxkczNucTcwZDU5NGsxZzltZ253NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/R59Hhh3cnfuffSSAxP/giphy.gif"
                alt="Animated Thumbs Up"
                className="w-full transform transition-all duration-300 animate-bounce"
              />
            </div>
            {/* 📢 Feedback Heading */}
            <h2 className="mt-8 mb-4 font-heading text-4xl font-bold text-orange-500 transition-opacity duration-300">
              Heräsikö päässäsi kehitysehdotuksia?
            </h2>
            {/* 📄 Description */}
            <p className="mb-6 font-body text-xl text-gray-600 transition-opacity duration-300">
              Skannaa QR-koodi kerro niistä meille.
            </p>
            {/* 🔹 QR Code Centered */}
            <div className="relative">
              <img
                alt="Feedback Form QR Code"
                className="h-40 w-40 rounded-lg shadow-lg transition-all"
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://docs.google.com/forms/d/e/1FAIpQLSdk-MbIeGFiI_sMFYiY_1QmlV_CiIUBZeovlATbKX5mNDnv_g/viewform?usp=dialog"
              />
            </div>
            {/* 🏷️ Credits */}
            <p className="mt-6 font-body text-xl text-gray-500 transition-opacity duration-300">
              Terveisin Matias
            </p>
          </div>
        </div>
      ) : loopMode && showFullScreenMap ? (
        /* ✅ Fullscreen Map Mode (Only if loopMode=true) */
        <div className="absolute inset-0 flex justify-center items-center bg-white transition-opacity duration-1000">
          <div className="w-[90vw] h-[90vh] flex justify-center items-center">
            <Suspense fallback={<p className="text-center text-gray-500">Loading map...</p>}>
              <RoomMap rooms={rooms} selectedFloor={selectedFloor} />
            </Suspense>
          </div>
        </div>
      ) : (
        /* ✅ Normal Mode: Show Room List & Map */
        <div className={`relative w-full ${selectedFloor === "2" ? "md:w-full" : "md:w-5/7"} h-full p-4 overflow-auto`}>
          <header className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl font-title text-metropoliaOrange font-bold drop-shadow-lg flex items-center">
                {translations[language].title}
                {reservableAudience && (
                  <span className="ml-4 text-lg text-gray-600 bg-gray-200 px-3 py-1 rounded-md shadow-sm">
                    {reservableAudience}
                  </span>
                )}
              </h1>

              {/* ✅ Hover Container for Show Instructions Button */}
              <div className="relative group">
                <button
                  className="text-sm bg-white border px-4 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => setShowInstructions(!showInstructions)}
                >
                  {showInstructions ? translations[language].hideInstructions : translations[language].showInstructions}
                </button>
              </div>

              {/* ✅ Hover Container for Floor Selector */}
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

              {/* ✅ Hover Container for Language Toggle */}
              <div className="relative group">
                <button
                  className="text-sm bg-gray-500 text-white px-4 py-2 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => setLanguage(language === "en" ? "fi" : "en")}
                >
                  {language === "en" ? "🇬🇧 English" : "🇫🇮 Suomi"}
                </button>
              </div>

              {/* ✅ Toggle Student Reservable Rooms (Only in Mobile) */}
              <button
                className="text-sm bg-blue-500 text-white px-4 py-2 rounded shadow-md md:hidden"
                onClick={() => setReservableFilter(!reservableFilter)}
              >
                {reservableFilter ? translations[language].allRooms : translations[language].filterStudents}
              </button>
            </div>
          </header>

          {/* ✅ Conditionally render Instructions with Lazy Loading */}
          {showInstructions && (
            <Suspense fallback={<p className="text-center text-gray-500">Loading instructions...</p>}>
              <Instructions />
            </Suspense>
          )}

          {/* ✅ Always render RoomList with Lazy Loading */}
          <main className="h-full">
            {loading ? (
              <p className="text-center text-gray-800 font-body drop-shadow-lg">
                {translations[language].loading}
              </p>
            ) : (
              <Suspense fallback={<p className="text-center text-gray-500">Loading rooms...</p>}>
                <RoomList
                  rooms={filteredRooms}
                  language={language}
                  autoScroll={autoScroll}
                  reservableStudents={reservableStudents}
                  reservableStaff={reservableStaff}
                />
              </Suspense>
            )}
          </main>
        </div>
      )}

      {/* ✅ Map Display (Normal Mode) */}
      {!showFree && selectedFloor && !loopMode && (
        <div className={`absolute md:static inset-0 md:w-2/7 h-full p-4 bg-gray-200 flex flex-col items-center ${showMap ? "flex" : "hidden md:flex"}`}>
          <div className="relative w-full h-full">
            <Suspense fallback={<p className="text-center text-gray-500">Loading map...</p>}>
              <RoomMap rooms={rooms} selectedFloor={selectedFloor} reservableFilter={reservableFilter} />
            </Suspense>
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
