import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,          // Capacity
  faBuilding,       // Wing
  faRulerCombined,  // Area
  faCheckCircle,    // Available status
  faTimesCircle,    // Reserved status
  faTag,            // Room type
  faClock,          // Next reservation time
} from "@fortawesome/free-solid-svg-icons";

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
  const hexValue = toHex(roomNumber);
  return `https://l14k.tuudo.fi/b004/?ix=3130303635&rx=${hexValue}`;
};

// Function to check if the room is currently reserved
// Function to check if the room is currently reserved
export const isRoomReserved = (room) => {
  const now = new Date();
  const freeUntil = room.freeUntil ? new Date(room.freeUntil) : null;
  const closingTime = room.closingTime ? new Date(room.closingTime) : null;
  const currentReservationStart = room.currentReservation ? new Date(room.currentReservation.startDate) : null;
  const currentReservationEnd = room.currentReservation ? new Date(room.currentReservation.endDate) : null;

  if (room.reserved && currentReservationStart && now >= currentReservationStart && now < currentReservationEnd) {
    return true;
  }
  if (room.reserved && !currentReservationStart) {
    return false;
  }
  if (freeUntil && freeUntil > now) {
    return false;
  }
  if (room.nextReservation) {
    const nextReservationStart = new Date(room.nextReservation.startDate);
    if (now < nextReservationStart) return false;
  }
  if (!room.reserved && !room.currentReservation) {
    return false;
  }
  if (closingTime && now >= closingTime) {
    return true;
  }
  return true;
};



const RoomList = ({ rooms, language }) => {
  if (rooms.length === 0) {
    return (
      <p className="text-center text-gray-500">
        {language === "fi"
          ? "Ei saatavilla olevia huoneita valitulle kerrokselle."
          : "No rooms available for the selected floor."}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {rooms.map((room) => {
        const roomReserved = isRoomReserved(room);

        return (
          <div
            key={room.roomNumber}
            className="border p-2 rounded shadow-md bg-white text-sm"
            style={{ borderColor: roomReserved ? "red" : "green" }}
          >
            <h3 className="text-base font-bold">
              {room.roomNumber || (language === "fi" ? "Nimetön huone" : "Unnamed Room")}
            </h3>

            {/* Wing and Room Type on the same line */}
            <p className="text-sm flex items-center">
              
              {room.wing || (language === "fi" ? "Tuntematon siipi" : "Unknown Wing")},{" "}
              {translateDetails(room.details, language) || (language === "fi" ? "Tuntematon" : "Unknown")}
            </p>

            {/* Capacity */}
            <p className="text-sm flex items-center">
              <FontAwesomeIcon icon={faUsers} className="mr-2 text-gray-500" />
              {language === "fi" ? "Kapasiteetti" : "Capacity"}: {room.persons || (language === "fi" ? "Tuntematon" : "Unknown")}
            </p>

            {/* Area */}
            <p className="text-sm flex items-center">
              <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-gray-500" />
              {language === "fi" ? "Pinta-ala" : "Area"}: {room.squareMeters || "0"} m²
            </p>

            {/* Status */}
            <p className="text-sm flex items-center">
              <FontAwesomeIcon
                icon={roomReserved ? faTimesCircle : faCheckCircle}
                className={`mr-2 ${roomReserved ? "text-red-500" : "text-green-500"}`}
              />
              {language === "fi" ? "Tila" : "Status"}:{" "}
              <span className={roomReserved ? "text-red-500 ml-1" : "text-green-500 ml-1"}>
                {roomReserved ? (language === "fi" ? "Varattu" : "Reserved") : (language === "fi" ? "Vapaa" : "Available")}
              </span>
            </p>

            {/* Next Reservation or Available Until */}
            {!roomReserved && (
              <p className="text-sm flex items-center">
                <FontAwesomeIcon icon={faClock} className="mr-2 text-gray-500" />
                {room.nextReservation
                  ? `${language === "fi" ? "Seuraava varaus" : "Next Reservation"}: ${new Date(
                      room.nextReservation.startDate
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : `${language === "fi" ? "Vapaa asti" : "Available Until"}: ${
                      room.closingTime
                        ? new Date(room.closingTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : language === "fi"
                        ? "Kampuksen sulkemisaika"
                        : "Campus Closing Time"
                    }`}
              </p>
            )}

            {/* QR Code for Tuudo link */}
            <div className="mt-2">
              <a href={generateTuudoLink(room.roomNumber || "Unknown")} target="_blank" rel="noopener noreferrer">
                <QRCodeSVG
                  value={generateTuudoLink(room.roomNumber || "Unknown")}
                  size={80} // Smaller QR code
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </a>
            </div>
          </div>
        );
      })}

      {/* Feedback Card */}
      <div className="border p-2 rounded shadow-md bg-blue-100 text-sm flex flex-col items-center justify-center">
        <h3 className="text-base font-bold text-blue-700 mb-2">
          {language === "fi" ? "Anna palautetta" : "Please leave feedback"}
        </h3>
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSdk-MbIeGFiI_sMFYiY_1QmlV_CiIUBZeovlATbKX5mNDnv_g/viewform?usp=header"
          target="_blank"
          rel="noopener noreferrer"
        >
          <QRCodeSVG value="https://docs.google.com/forms/d/e/1FAIpQLSdk-MbIeGFiI_sMFYiY_1QmlV_CiIUBZeovlATbKX5mNDnv_g/viewform?usp=header" size={80} fgColor="#000000" bgColor="#ffffff" />
        </a>
        <p className="text-xs mt-1 text-gray-600 text-center">
          {language === "fi" ? "Skannaa tai napsauta antaaksesi palautetta" : "Scan or click to provide feedback"}
        </p>
      </div>
    </div>
  );
};

export default RoomList;
