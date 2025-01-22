import React, { useEffect } from "react";
import InlineSVG from "react-inlinesvg";
import Floor7SVG from "../assets/7thfloormap.svg";

const RoomMap = ({ rooms, selectedFloor }) => {
  useEffect(() => {
    if (selectedFloor === "7" && rooms) {
      rooms.forEach((room) => {
        // Normalize the ID to match the SVG
        const normalizedId = room.roomNumber; // Adjust this if the SVG IDs have a suffix like '-text'
        const roomElement = document.getElementById(normalizedId);

        if (roomElement) {
          roomElement.style.fill = room.reserved ? "#f44336" : "#4caf50"; // Red for reserved, green for free
        } else {
          console.warn(`No SVG element found for room: ${normalizedId}`);
        }
      });
    }
  }, [rooms, selectedFloor]);

  if (selectedFloor !== "7") {
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
        src={Floor7SVG}
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
