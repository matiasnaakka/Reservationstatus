import React, { useEffect, useRef, useState } from "react";
import InlineSVG from "react-inlinesvg";
import Floor7SVG from "../assets/7thfloormap.svg";
import Floor6SVG from "../assets/6thfloormap.svg";
import Floor5SVG from "../assets/5thfloormap.svg";
import { isRoomReserved } from "./RoomList"; // ✅ Importoidaan oikea logiikka

const RoomMap = ({ rooms, selectedFloor, reservableFilter }) => {
  const svgRef = useRef(null);
  const [svgLoaded, setSvgLoaded] = useState(false);

  // Function to update room colors
  const updateRoomColors = () => {
    if (!svgRef.current || !svgLoaded) return;

    // ✅ Huoneet, jotka halutaan pitää aina keltaisina
    const alwaysYellowRooms = ["KMC550", "KMC590"];

    const filterByStaff = reservableFilter === "staff";
    const filterByStudents = reservableFilter === "students";

    rooms.forEach((room) => {
      const normalizedId = room.roomNumber.replace(/\./g, "\\.");
      const roomElement = svgRef.current.querySelector(`#${normalizedId}`);

      if (roomElement) {
        let roomColor = "#4caf50"; // Oletus: vihreä (vapaa)

        // ✅ Jos huone on manuaalisesti määritelty keltaiseksi
        if (alwaysYellowRooms.includes(room.roomNumber)) {
          roomColor = "#ffeb3b"; // Keltainen
        }
        // ✅ Jos huone on oikeasti varattu nyt
        else if (isRoomReserved(room)) {
          roomColor = "#f44336"; // Punainen
        }
        // ✅ Jos suodatetaan opiskelijatilat
        else if (filterByStudents && room.reservableStudents !== "true") {
          roomColor = "#ffeb3b"; // Keltainen, ei varattavissa opiskelijalle
        }
        // ✅ Jos suodatetaan henkilökunnalle
        else if (filterByStaff && room.reservableStaff !== "true") {
          roomColor = "#ffeb3b"; // Keltainen, ei varattavissa henkilökunnalle
        }

        roomElement.setAttribute("fill", roomColor);
      } else {
        console.warn(`⚠️ No SVG element found for room: ${room.roomNumber}`);
      }
    });
  };

  useEffect(() => {
    if (svgLoaded) {
      setTimeout(updateRoomColors, 500); // Odota hetki, että SVG latautuu kokonaan
    }
  }, [rooms, selectedFloor, svgLoaded, reservableFilter]);

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
        onLoad={() => setSvgLoaded(true)}
        innerRef={svgRef}
        style={{
          width: "100%",
          height: "100%",
          maxHeight: "100vh",
          objectFit: "contain",
        }}
      />
    </div>
  );
};

export default RoomMap;
