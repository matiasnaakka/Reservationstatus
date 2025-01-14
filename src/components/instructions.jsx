import React from 'react';

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
          <strong>Staffworkspace</strong>: Show only staff workspaces.
          <code className="bg-gray-200 px-1 rounded ml-1">?Staffworkspace=true</code>
        </li>
        <li>
          Combine parameters:
          <code className="bg-gray-200 px-1 rounded ml-1">
            ?specificdate=2025-01-13&floor=6&building=Karamalmi&Staffworkspace=true
          </code>
        </li>
      </ul>
    </div>
  );
};

export default Instructions;
