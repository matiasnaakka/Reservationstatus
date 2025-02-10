import React, { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBuilding,
  faRulerCombined,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faUserGraduate, faUserTie
} from "@fortawesome/free-solid-svg-icons";

import roomImages from "../roomImages"; // ✅ Import room images

// Translation object for room types
const detailsTranslations = {
  "Yhteistyötila": { en: "Collaboration Space", fi: "Yhteistyötila" },
  "Työtila": { en: "Workspace", fi: "Työtila" },
  "Oppimistila": { en: "Learning Space", fi: "Oppimistila" },
  "Henkilöstön työtila": { en: "Staff Workspace", fi: "Henkilöstön työtila" },
  "VR/AR -laboratorio": { en: "VR/AR Laboratory", fi: "VR/AR -laboratorio" },
  "Ryhmätyötila": { en: "Group Workspace", fi: "Ryhmätyötila" },
};

// Helper function for translating room types
const translateDetails = (details, language) =>
  detailsTranslations[details]?.[language] || details;

// Helper function to generate Tuudo link
const generateTuudoLink = (roomNumber) => {
  const toHex = (text) => {
    return [...text]
      .map((char) => char.charCodeAt(0).toString(16).toUpperCase())
      .join("");
  };
  return `https://l14k.tuudo.fi/b004/?ix=3130303635&rx=${toHex(roomNumber)}`;
};

// Function to check if the room is currently reserved
export const isRoomReserved = (room) => {
  const now = new Date();
  const currentReservationStart = room.currentReservation
    ? new Date(room.currentReservation.startDate)
    : null;
  const currentReservationEnd = room.currentReservation
    ? new Date(room.currentReservation.endDate)
    : null;

  return currentReservationStart && now >= currentReservationStart && now < currentReservationEnd;
};

// Function to check if the room has a reservation later today
const hasReservationToday = (room) => {
  const now = new Date();
  if (!room.nextReservation) return false;

  const nextReservationTime = new Date(room.nextReservation.startDate);
  return nextReservationTime.getDate() === now.getDate();
};

const useAutoScroll = (ref, enabled, speed = 40) => {
  useEffect(() => {
    if (!enabled) return; // ✅ Disable auto-scroll if 'enabled' is false

    const element = ref.current;
    if (!element) return;

    const scroll = () => {
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        element.scrollTop = 0; // Reset to top
      } else {
        element.scrollTop += 1; // Scroll down gradually
      }
    };

    const interval = setInterval(scroll, speed);
    return () => clearInterval(interval);
  }, [ref, enabled, speed]); // ✅ Add 'enabled' to dependencies
};

const RoomList = ({ rooms, language, autoScroll, reservableStudents, reservableStaff }) => {
  const scrollRef = useRef(null);
  useAutoScroll(scrollRef, autoScroll, 35); // ✅ AutoScroll now works correctly

  const filteredRooms = rooms.filter((room) =>
    !isRoomReserved(room) &&
    (
      (!reservableStudents && !reservableStaff) || // ✅ No filter applied = show all
      (reservableStudents && room.reservableStudents === "true") ||
      (reservableStaff && room.reservableStaff === "true")
    )
  );


  if (filteredRooms.length === 0) {
    return (
      <p className="text-center text-gray-500">
        {language === "fi"
          ? "Ei saatavilla olevia huoneita valitulle kerrokselle."
          : "No rooms available for the selected floor."}
      </p>
    );
  }

  return (
<div
  ref={scrollRef}
  className="overflow-y-auto h-[100vh] w-full"
  style={{ scrollBehavior: "smooth" }}
>
  {/* 🟢 Responsive Grid for Room Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
    {filteredRooms.map((room) => {
      const roomReserved = isRoomReserved(room);
      const formattedRoomNumber = room.roomNumber.replace(/\./g, "_");
      const roomImage = roomImages[formattedRoomNumber];

      return (
        <div
          key={room.roomNumber}
          className="relative border rounded-lg dynamic-padding shadow-md flex justify-between room-card"
        >
          {/* 📌 Left Side - Room Details */}
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-bold text-orange-600 flex items-center mb-2">
              <FontAwesomeIcon icon={faBuilding} className="mr-2" />
              {room.roomNumber || (language === "fi" ? "Nimetön huone" : "Unnamed Room")}
            </h3>

            <p className="flex items-center">
              <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-500" />
              {language === "fi" ? "Kerros" : "Floor"} {room.floor} | {room.wing || (language === "fi" ? "Tuntematon siipi" : "Unknown Wing")}
            </p>

            <p className="flex items-center">
              <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-500" />
              {room.persons || "Tuntematon"} {language === "fi" ? "henkilöä" : "persons"}
            </p>

            <p className="flex items-center">
              <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-gray-500" />
              {room.squareMeters || "0"} m²
            </p>

            <p className="text-gray-600">{translateDetails(room.details, language)}</p>

            {!roomReserved && (
              <p className="flex items-center text-green-600 font-bold mt-6 underline">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {room.nextReservation
                  ? language === "fi"
                    ? `Vapaa klo ${new Date(room.nextReservation.startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} asti`
                    : `Available until ${new Date(room.nextReservation.startDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : language === "fi"
                    ? "Vapaana koko päivän"
                    : "Available all day"}
              </p>
            )}
          </div>

          {/* 🖼️ Right Side - Image & QR Code */}
          <div className="flex flex-col items-center space-y-4">
            {roomImage && (
              <img src={roomImage} alt={`Room ${room.roomNumber}`} className="w-40 h-32 object-cover rounded-md" />
            )}
            <QRCodeSVG value={generateTuudoLink(room.roomNumber)} size={100} />
          </div>
        </div>
      );
    })}
  </div>
</div>
  );
};

export default RoomList;
