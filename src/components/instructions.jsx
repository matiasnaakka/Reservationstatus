import React from "react";

const Instructions = () => {
  return (
    <div className="bg-gray-100 p-3 rounded shadow-sm text-sm mb-3 border border-gray-300">
      <h2 className="text-base font-semibold text-gray-800 mb-2">📌 How to Use URL Parameters</h2>
      <p className="text-gray-700 mb-2">
        Use URL parameters to filter rooms and adjust the floor map display dynamically.
      </p>

      <ul className="list-disc pl-5 text-gray-600 space-y-2">
        <li>
          <strong>📅 specificdate</strong>: Select a specific date for room availability.
          <br />
          <code className="bg-gray-200 px-2 py-1 rounded ml-1">?specificdate=2025-01-13</code>
        </li>

        <li>
          <strong>🏢 floor</strong>: Choose a specific floor to display its free rooms and floor map.
          <br />
          <code className="bg-gray-200 px-2 py-1 rounded ml-1">?floor=6</code>
          <br />
          <span className="text-gray-500 text-xs">
            (Selecting a floor will show only its free rooms and enable the floor map.)
          </span>
        </li>

        <li>
          <strong>🎓 reservable</strong>: Show only student-reservable rooms.
          <br />
          <code className="bg-gray-200 px-2 py-1 rounded ml-1">?reservable=students</code>
          <br />
          <span className="text-gray-500 text-xs">
            (Only rooms available for student reservations will be displayed.)
          </span>
        </li>

        <li>
          <strong>✅ showFree</strong>: Display all free rooms across all floors (default mode).
          <br />
          <code className="bg-gray-200 px-2 py-1 rounded ml-1">?showFree=true</code>
          <br />
          <span className="text-gray-500 text-xs">
            (This will hide the floor map and list free rooms from all floors.)
          </span>
        </li>

        <li>
          <strong>🏢 Default Behavior</strong>: 
          <br />
          - When **no floor is selected**, all free rooms are displayed, and the floor map is **hidden**.  
          - When **a floor is selected**, only its free rooms are shown, and the floor map is **enabled**.  
        </li>

        <li>
          <strong>🔗 Combine Multiple Parameters</strong>: Customize your search with multiple filters.
          <br />
          <code className="bg-gray-200 px-2 py-1 rounded ml-1">
            ?specificdate=2025-01-13&floor=6&reservable=students
          </code>
          <br />
          <span className="text-gray-500 text-xs">
            (This will show student-reservable free rooms on the 6th floor for January 13, 2025.)
          </span>
        </li>
      </ul>

      <p className="text-gray-700 mt-4 text-sm">
        Need help? Adjust filters or refresh if needed. 🚀
      </p>
    </div>
  );
};

export default Instructions;
