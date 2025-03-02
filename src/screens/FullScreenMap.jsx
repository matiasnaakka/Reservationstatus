import React, { Suspense } from "react";
import RoomMap from "../components/RoomMap";
import OptimizedLoading from "../components/OptimizedLoading";

const FullScreenMap = ({ rooms, selectedFloor }) => {
  return (
    <div className="absolute inset-0 flex justify-center items-center bg-white transition-opacity duration-1000">
      <div className="w-[90vw] h-[90vh] flex justify-center items-center">
        <Suspense fallback={<OptimizedLoading message="Loading map..." />}>
          <RoomMap rooms={rooms} selectedFloor={selectedFloor} />
        </Suspense>
      </div>
    </div>
  );
};

export default FullScreenMap;
