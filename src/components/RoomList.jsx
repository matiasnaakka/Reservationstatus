import React, { useEffect, useRef, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBuilding,
  faRulerCombined,
  faClock,
  faUserTie,      // ✅ Add this for "Henkilökunta"
  faUserGraduate  // ✅ Add this for "Opiskelijat"
} from "@fortawesome/free-solid-svg-icons";

// filepath: /c:/Users/matia/Desktop/projekti/src/components/RoomList.jsx
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
  const now = new Date(); // 🔥 Hanki nykyhetki

  // Tarkista, onko nykyinen varaus voimassa
  if (room.currentReservation) {
    const currentStart = new Date(room.currentReservation.startDate);
    const currentEnd = new Date(room.currentReservation.endDate);
    if (now >= currentStart && now < currentEnd) {
      return true;
    }
  }

  // Tarkista, onko seuraava varaus alkanut, mutta sitä ei ole siirretty currentReservationiin
  if (room.nextReservation) {
    const nextStart = new Date(room.nextReservation.startDate);
    const nextEnd = new Date(room.nextReservation.endDate);

    if (now >= nextStart && now < nextEnd) {
      return true; // 🛑 Tämä varaus on jo alkanut
    }
  }

  return false; // ✅ Huone on vapaa
};

const useAutoScroll = (ref, enabled, speed = 50) => {
  useEffect(() => {
    if (!enabled) {
      return; // ✅ Stop if autoScroll=false
    }

    const element = ref.current;
    if (!element) {
      return;
    }

    let animationFrameId;
    let lastTime = 0;
    const scrollStep = 1;

    const smoothScroll = (time) => {
      if (!enabled || !element) return; // ✅ Stop if disabled

      if (time - lastTime > speed) {
        if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
          element.scrollTop = 0;
        } else {
          element.scrollTop += scrollStep;
        }
        lastTime = time;
      }

      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    animationFrameId = requestAnimationFrame(smoothScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [ref, enabled, speed]);
};

import { format, parseISO } from "date-fns";
import { fi } from "date-fns/locale"; // 🇫🇮 Suomen kielinen muotoilu

// Helper function to format closing time
const formatClosingTime = (closingTime) => {
  if (!closingTime) return "Unknown";
  return format(parseISO(closingTime), "HH:mm", { locale: fi });
};

const RoomList = ({ rooms, language, autoScroll, reservableStudents, reservableStaff, showMap }) => {
  const scrollRef = useRef(null);
  useAutoScroll(scrollRef, autoScroll, 30); // ✅ AutoScroll now works correctly

  const filteredRooms = useMemo(() => {
    return rooms.filter(room =>
      !isRoomReserved(room) &&
      (
        (!reservableStudents && !reservableStaff) ||
        (reservableStudents && room.reservableStudents === "true") ||
        (reservableStaff && room.reservableStaff === "true")
      )
    );
  }, [rooms, reservableStudents, reservableStaff]);



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
    <div ref={scrollRef} className="overflow-auto h-full w-full" style={{ scrollBehavior: "smooth", maxHeight: "90vh" }}>

      {/* 🟢 Responsive Grid for Room Cards */}
      <div
        className={`grid gap-4 ${showMap
          ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          }`}
      >
        {filteredRooms.map((room) => {
          const roomReserved = isRoomReserved(room);
          const formattedRoomNumber = room.roomNumber.replace(/\./g, "_");
          const roomImage = roomImages[formattedRoomNumber];

          console.log(`Room Image for ${room.roomNumber}:`, roomImage);

          return (
            <div
              key={room.roomNumber}
              className="relative border rounded-lg dynamic-padding shadow-md flex flex-col sm:flex-row bg-white p-4 w-full max-w-md room-card"
            >
              {/* 📌 Left Side - Room Details */}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-orange-600">
                  {room.roomNumber || (language === "fi" ? "Nimetön huone" : "Unnamed Room")}
                </h3>

                <p className="text-gray-600 font-semibold underline">{translateDetails(room.details, language)}</p>

                <p className="flex items-center text-sm text-gray-700">
                  <FontAwesomeIcon icon={faBuilding} className="mr-2 text-gray-500" />
                  {language === "fi" ? "Kerros" : "Floor"} {room.floor} | {room.wing || "?"}
                </p>

                <p className="flex items-center text-sm text-gray-700">
                  <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-500" />
                  {room.persons || "?"} {language === "fi" ? "henkilöä" : "persons"}
                </p>

                <p className="flex items-center text-sm text-gray-700">
                  <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-gray-500" />
                  {room.squareMeters || "0"} m²
                </p>

                {!roomReserved && (
                  <p className={`flex items-center font-bold mt-2 ${room.nextReservation ? "text-orange-500" : "text-green-600"}`}>
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    {room.nextReservation
                      ? language === "fi"
                        ? `Vapaa klo ${new Date(room.nextReservation.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} asti`
                        : `Available until ${new Date(room.nextReservation.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                      : language === "fi"
                        ? "Vapaana koko päivän"
                        : "Available all day"}
                  </p>
                )}


                {/* Reservability Icons - Vertically Aligned */}
                <div className="flex flex-col items-start mt-3">
                  {room.reservableStaff === "true" && (
                    <span className="flex items-center text-sm text-metropoliaGreen font-semibold">
                      <FontAwesomeIcon icon={faUserTie} className="mr-2 text-metropoliaGreen text-lg" />
                      {language === "fi" ? "Henkilökunta" : "Staff"}
                    </span>
                  )}

                  {room.reservableStudents === "true" && (
                    <span className="flex items-center text-sm text-metropoliaRed font-semibold mt-2">
                      <FontAwesomeIcon icon={faUserGraduate} className="mr-2 text-metropoliaRed text-lg" />
                      {language === "fi" ? "Opiskelijat" : "Students"}
                    </span>
                  )}
                </div>
              </div>

              {/* 🖼️ Right Side - Image & QR Code */}
              <div className="flex flex-col items-center space-y-2 sm:space-y-4">
                {roomImage && (
                  <img
                    src={roomImage}
                    alt={`Room ${room.roomNumber}`}
                    className="w-32 h-24 object-cover rounded-md shadow-sm"
                    width="128" height="96"
                    loading="lazy" decode="async"
                  />
                )}
                <QRCodeSVG value={generateTuudoLink(room.roomNumber)} size={100} className="border border-gray-300 p-1 rounded" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomList;
