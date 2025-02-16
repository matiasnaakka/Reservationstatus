import React from "react";

const Instructions = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md text-sm border border-gray-300">
      <h2 className="text-lg font-semibold text-orange-600 mb-3">Using URL Parameters</h2>
      <p className="text-gray-700 mb-3">
        URL parameters allow filtering rooms, adjusting the display, and enabling auto-scrolling or loop mode.
      </p>

      <ul className="list-disc pl-5 text-gray-700 space-y-3">
        <li>
          <strong className="text-orange-600">Floor</strong>: Display available rooms for a specific floor.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?floor=6</code>
          <br />
          <span className="text-gray-600 text-xs">
            Selecting a floor displays only its available rooms and enables the floor map.
          </span>
          <br />
          <span className="text-red-600 font-semibold text-xs">
            ⚠️ Note: <strong>`loopMode=true` does not work when `?floor=` is set.</strong>
          </span>
        </li>

        <li>
          <strong className="text-orange-600">Reservable</strong>: Filter rooms by student or staff reservations.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?reservable=students</code>
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?reservable=staff</code>
        </li>

        <li>
          <strong className="text-orange-600">Show Free Rooms</strong>: Display available rooms from all floors.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?showFree=true</code>
          <br />
          <span className="text-gray-600 text-xs">
            Hides the floor map and lists all available rooms.
          </span>
        </li>

        <li>
          <strong className="text-orange-600">Loop Mode</strong>: Automatically cycle through different screens.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?loopMode=true</code>
          <br />
          <span className="text-gray-600 text-xs">
            Rotates between the room list, map, and feedback screen at set intervals.
          </span>
          <br />
          <span className="text-red-600 font-semibold text-xs">
            ⚠️ `loopMode` cannot be used with `?floor=`.
          </span>
        </li>

        <li>
          <strong className="text-orange-600">Loop Duration</strong>: Set custom durations for each screen.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?loopRoom=10</code>
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?loopMap=15</code>
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?loopFeedback=8</code>
          <br />
          <span className="text-gray-600 text-xs">
            Defines the number of seconds each screen remains visible before switching.
          </span>
        </li>

        <li>
          <strong className="text-orange-600">Auto Scroll</strong>: Enables automatic scrolling in the room list.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">?autoScroll=true</code>
          <br />
          <span className="text-gray-600 text-xs">
            Useful for displaying information on public screens or digital signage.
          </span>
        </li>

        <li>
          <strong className="text-orange-600">Combining Parameters</strong>: Apply multiple filters simultaneously.
          <br />
          <code className="bg-orange-100 px-2 py-1 rounded text-orange-700">
            ?floor=6&reservable=students&loopMode=true
          </code>
          <br />
          <span className="text-red-600 font-semibold text-xs">
            ⚠️ `loopMode=true` will not work when combined with `?floor=`.
          </span>
        </li>
      </ul>

      <p className="text-gray-700 mt-4 text-sm">
        For any issues, adjust the filters or refresh the page.
      </p>
    </div>
  );
};

export default Instructions;
