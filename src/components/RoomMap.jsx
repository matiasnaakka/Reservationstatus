import React, { useEffect } from "react";
import InlineSVG from "react-inlinesvg";
import Floor7SVG from "../assets/7thfloormap.svg";
import Floor6SVG from "../assets/6thfloormap.svg";
import Floor5SVG from "../assets/5thfloormap.svg"; // Import the 5th-floor map

const RoomMap = ({ rooms, selectedFloor }) => {
  useEffect(() => {
    if (rooms) {
      rooms.forEach((room) => {
        const normalizedId = room.roomNumber; // Normalize the ID to match the SVG
        const roomElement = document.getElementById(normalizedId);

        if (roomElement) {
          roomElement.style.fill = room.reserved ? "#f44336" : "#4caf50"; // Red for reserved, green for free
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
        width: "100%", // Full width of the container
        height: "100%", // Full height of the container
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden", // Prevent overflow if the SVG is too large
      }}
    >
      <InlineSVG
        src={floorSVG}
        style={{
          width: "100%", // Scale SVG to the parent container
          height: "auto", // Maintain aspect ratio
          maxHeight: "100%", // Constrain the maximum height
        }}
      />
    </div>
  );
};

export default RoomMap;
