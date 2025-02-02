import React from "react";

const Instructions = () => {
  return (
    <div className="bg-gray-100 p-2 rounded shadow-sm text-sm mb-3">
      <h2 className="text-base font-semibold text-gray-700 mb-1">How to use URL parameters:</h2>
      <ul className="list-disc pl-4 text-gray-600">
        <li>
          <strong>specificdate</strong>: Set a specific date.
          <code className="bg-gray-200 px-1 rounded ml-1">?specificdate=2025-01-13</code>
        </li>
        <li>
          <strong>floor</strong>: Select a floor or "All Floors".
          <code className="bg-gray-200 px-1 rounded ml-1">?floor=6</code> or <code>?floor=All%20Floors</code>
        </li>
        <li>
          <strong>building</strong>: Specify the building. Default: <code>Karamalmi</code>.
          <code className="bg-gray-200 px-1 rounded ml-1">?building=Karamalmi</code>
        </li>
        <li>
          <strong>reservable</strong>: Show only student-reservable rooms.
          <code className="bg-gray-200 px-1 rounded ml-1">?reservable=students</code>
        </li>
        <li>
          <strong>showFree</strong>: Show all currently free rooms from all floors and hide the floor maps.
          <code className="bg-gray-200 px-1 rounded ml-1">?showFree=true</code>
        </li>
        <li>
          Combine parameters:
          <code className="bg-gray-200 px-1 rounded ml-1">
            ?specificdate=2025-01-13&floor=6&building=Karamalmi&reservable=students
          </code>
        </li>
      </ul>
    </div>
  );
};

export default Instructions;
