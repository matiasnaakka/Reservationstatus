import React from 'react';

const RoomList = ({ rooms }) => {
  if (rooms.length === 0) {
    return <p className="text-center text-gray-500">No rooms available for the selected floor.</p>;
  }

  // Group rooms by floor
  const roomsByFloor = rooms.reduce((acc, room) => {
    const floor = room.floor || 'Unknown Floor';
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
            Floor {floor}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {floorRooms.map((room) => (
              <div
                key={room.name}
                className="border p-4	rounded shadow-lg bg-white"
                style={{ borderColor: room.reserved ? 'red' : 'green' }}
              >
                <h3 className="text-lg font-bold">
                  {room.name}
                </h3>
                <p>(FI): {room.typeFi}</p>
                <p>(EN): {room.typeEn}</p>
                <p>
                  Capacity: {room.capacity}{' '}
                  <span role="img" aria-label="head icon">🧑</span>
                </p>
                <p>
                  Status:{' '}
                  <span className={room.reserved ? 'text-red-500' : 'text-green-500'}>
                    {room.reserved ? 'Reserved' : 'Available'}
                  </span>
                </p>
                {room.reserved && room.reservationDetails && (
                  <p className="text-sm text-gray-700 mt-2">
                    Reserved from{' '}
                    {new Date(room.reservationDetails.startDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    to{' '}
                    {new Date(room.reservationDetails.endDate).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
