import React from 'react';

const RoomList = ({ rooms }) => {
  if (rooms.length === 0) {
    return <p className="text-center text-gray-500">No rooms available for the selected floor.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <div
          key={room.name}
          className="border p-4 rounded shadow-lg bg-white"
          style={{ borderColor: room.reserved ? 'red' : 'green' }}
        >
          <h3 className="text-lg font-bold">{room.name}</h3>
          <p>Type (FI): {room.typeFi}</p>
          <p>Type (EN): {room.typeEn}</p>
          <p>Capacity: {room.capacity}</p>
          <p>
            Status:{' '}
            <span className={room.reserved ? 'text-red-500' : 'text-green-500'}>
              {room.reserved ? 'Reserved' : 'Available'}
            </span>
          </p>
          {room.reservationDetails && <p>Reservation: {room.reservationDetails}</p>}
        </div>
      ))}
    </div>
  );
};

export default RoomList;
