import React from "react";
import { QRCodeSVG } from "qrcode.react";

const toHex = (text) => {
  return [...text]
    .map((char) => char.charCodeAt(0).toString(16).toUpperCase())
    .join("");
};

const generateTuudoLink = (roomNumber) => {
  const hexValue = toHex(roomNumber);
  return `https://l14k.tuudo.fi/b004/?ix=3130303635&rx=${hexValue}`;
};

// Helper function to format current date
const formatDate = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options); // Adjust locale as needed
};

const RoomList = ({ rooms }) => {
  const currentDate = new Date(); // Get the current date

  if (rooms.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No rooms available for the selected criteria.
      </p>
    );
  }

  // Filter out reserved rooms
  const freeRooms = rooms.filter((room) => !room.reserved);

  if (freeRooms.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No free rooms available for the selected criteria.
      </p>
    );
  }

  const roomsByFloor = freeRooms.reduce((acc, room) => {
    const floor = room.floor || "Unknown Floor";
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(room);
    return acc;
  }, {});

  return (
    <div>
      {Object.entries(roomsByFloor).map(([floor, floorRooms]) => (
        <div key={floor} className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-orange-500">
            {floor === "Unknown Floor" ? "Unknown Floor" : `Floor ${floor}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {floorRooms.map((room) => (
              <div
                key={room.roomNumber} // Ensuring unique key
                className="border p-2 rounded shadow-md bg-white text-sm"
                style={{ borderColor: "green" }}
              >
                <h3 className="text-base font-bold">
                  {room.roomNumber || "Unnamed Room"}
                </h3>
                <p className="text-sm">
                  (Details): {room.details || "No details available"}
                </p>
                <p className="text-sm">
                  Capacity: {room.persons || "Unknown capacity"}
                </p>
                <p className="text-sm">
                  Wing: {room.wing || "Unknown wing"}
                </p>
                <p className="text-sm">
                  Area: {room.squareMeters || "0"} m²
                </p>
                <p className="text-sm">
                  Status:{" "}
                  <span className="text-green-500">Available</span>
                </p>

                {/* QR Code for Tuudo link */}
                <div className="mt-2">
                  <a
                    href={generateTuudoLink(room.roomNumber || "Unknown")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <QRCodeSVG
                      value={generateTuudoLink(room.roomNumber || "Unknown")}
                      size={80} // Smaller QR code
                      fgColor="#000000"
                      bgColor="#ffffff"
                    />
                  </a>
                </div>
              </div>
            ))}

            {/* Add Feedback Card */}
            <div className="border p-2 rounded shadow-md bg-blue-100 text-sm flex flex-col items-center justify-center">
              <h3 className="text-base font-bold text-blue-700 mb-2">
                Please leave feedback
              </h3>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdk-MbIeGFiI_sMFYiY_1QmlV_CiIUBZeovlATbKX5mNDnv_g/viewform?usp=header"
                target="_blank"
                rel="noopener noreferrer"
              >
                <QRCodeSVG
                  value="https://docs.google.com/forms/d/e/1FAIpQLSdk-MbIeGFiI_sMFYiY_1QmlV_CiIUBZeovlATbKX5mNDnv_g/viewform?usp=header"
                  size={80}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </a>
              <p className="text-xs mt-1 text-gray-600 text-center">
                Scan or click to provide feedback
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
