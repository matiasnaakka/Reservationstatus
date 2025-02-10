import React, { useEffect, useRef, useState } from "react";
import InlineSVG from "react-inlinesvg";
import Floor7SVG from "../assets/7thfloormap.svg";
import Floor6SVG from "../assets/6thfloormap.svg";
import Floor5SVG from "../assets/5thfloormap.svg";
import { isRoomReserved } from "./RoomList";

const RoomMap = ({ rooms, selectedFloor, reservableFilter }) => {
  const svgRef = useRef(null);
  const [svgLoaded, setSvgLoaded] = useState(false);

  // ✅ Function to update room colors
  const updateRoomColors = () => {
    if (!svgRef.current || !svgLoaded) return;

    console.log("✅ SVG is loaded, updating room colors...");

    // ✅ Rooms that should always be yellow (5th floor)
    const alwaysYellowRooms = ["KMC550", "KMC590"];

    const filterByStaff = reservableFilter === "staff";
    const filterByStudents = reservableFilter === "students";

    // 🔹 Loop through API rooms and apply colors
    rooms.forEach((room) => {
      const normalizedId = room.roomNumber.replace(/\./g, "\\.");
      const roomElement = svgRef.current.querySelector(`#${normalizedId}`);

      if (roomElement) {
        console.log(`✅ Found room in SVG: ${room.roomNumber}`, roomElement);

        let roomColor = "#4caf50"; // Default: Green (Free)

        if (room.reserved) {
          roomColor = "#f44336"; // 🔴 Reserved (Red)
        } else if (filterByStaff) {
          roomColor = room.reserved ? "#f44336" : "#4caf50";
        } else if (filterByStudents) {
          roomColor = room.reservableStudents === "true" ? "#4caf50" : "#ffeb3b";
        }

        // ✅ Apply color
        roomElement.setAttribute("fill", roomColor);
      } else {
        console.warn(`🚨 No SVG element found for room: ${room.roomNumber}`);
      }
    });

    // 🟡 **Manually Color Missing Rooms (5th Floor)**
    if (selectedFloor === "5") {
      alwaysYellowRooms.forEach((roomId) => {
        const roomElement = svgRef.current.querySelector(`#${roomId}`);
        if (roomElement) {
          console.log(`✅ Forcing yellow for: ${roomId}`);
          roomElement.setAttribute("fill", "#ffeb3b"); // 🟡 Yellow
        } else {
          console.warn(`🚨 No SVG element found for: ${roomId} in the SVG!`);
        }
      });
    }
  };

  useEffect(() => {
    if (svgLoaded) {
      setTimeout(updateRoomColors, 500); // ✅ Ensure SVG is fully loaded before modifying
    }
  }, [rooms, selectedFloor, svgLoaded, reservableFilter]); // ✅ Added reservableFilter  

  // ✅ Function to get the correct floor SVG
  const getFloorSVG = () => {
    switch (selectedFloor) {
      case "5":
        return Floor5SVG;
      case "6":
        return Floor6SVG;
      case "7":
        return Floor7SVG;
      default:
        return null;
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
        onLoad={() => {
          console.log("✅ SVG Loaded");
          setSvgLoaded(true);
        }}
        innerRef={svgRef} // ✅ Store reference for DOM access
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
