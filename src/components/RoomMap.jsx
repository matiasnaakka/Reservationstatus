import React, { useEffect } from "react";
import InlineSVG from "react-inlinesvg";
import Floor7SVG from "../assets/7thfloormap.svg";
import Floor6SVG from "../assets/6thfloormap.svg";
import Floor5SVG from "../assets/5thfloormap.svg";

// Import the same function used in RoomList.jsx
import { isRoomReserved } from "./RoomList";

const RoomMap = ({ rooms, selectedFloor }) => {
  useEffect(() => {
    if (rooms && selectedFloor) {
      rooms.forEach((room) => {
        const normalizedId = room.roomNumber; // Normalize the ID to match the SVG
        const roomElement = document.getElementById(normalizedId);

        if (roomElement) {
          // ✅ Use the same logic as RoomList.jsx to determine if the room is reserved
          const roomReserved = isRoomReserved(room);

          // Set fill color based on reservation status
          roomElement.style.fill = roomReserved ? "#f44336" : "#4caf50"; // Red for reserved, green for free

          // Add tooltip-like information for the room
          roomElement.setAttribute(
            "title",
            `Room: ${room.roomNumber}\nStatus: ${
              roomReserved ? "Reserved" : "Available"
            }\nFree Until: ${
              room.freeUntil ? new Date(room.freeUntil).toLocaleTimeString() : "N/A"
            }\nCapacity: ${room.persons || "Unknown"}`
          );
        } else {
          console.warn(`No SVG element found for room: ${normalizedId}`);
        }
      });
    }
  }, [rooms, selectedFloor]);

  const getFloorSVG = () => {
    switch (selectedFloor) {
      case "5":
        return Floor5SVG; // Return the 5th-floor SVG
      case "6":
        return Floor6SVG; // Return the 6th-floor SVG
      case "7":
        return Floor7SVG; // Return the 7th-floor SVG
      default:
        return null; // No map available for other floors
    }
  };

  const floorSVG = getFloorSVG();

  if (!floorSVG) {
    return <div className="text-gray-500">No map available for this floor.</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <InlineSVG
        src={floorSVG}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "100%",
        }}
      />
    </div>
  );
};

export default RoomMap;
