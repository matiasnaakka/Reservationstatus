import React from 'react';
import mapImage from '../assets/floor-map.jpg'; // Example map image

const RoomMap = ({ rooms, floor }) => {
  return (
    <div className="relative w-full h-full">
      {/* Map Image */}
      <img
        src={mapImage}
        alt={`Floor ${floor} Map`}
        className="w-full h-full object-contain"
      />

      {/* Room Overlays */}
      {rooms.map((room) => (
        <div
          key={room.name}
          className={`absolute ${
            room.reserved ? 'bg-red-500' : 'bg-green-500'
          }`}
          style={{
            // Adjust these positions based on the map image and room locations
            top: `${room.mapY}%`,
            left: `${room.mapX}%`,
            width: '20px',
            height: '20px',
            borderRadius: '50%',
          }}
          title={`${room.name} - ${room.reserved ? 'Reserved' : 'Available'}`}
        ></div>
      ))}
    </div>
  );
};

export default RoomMap;
