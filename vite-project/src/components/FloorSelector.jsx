const FloorSelector = ({ selectedFloor, onFloorChange, availableFloors }) => (
  <div className="mb-4 text-center">
    <label className="font-semibold mr-2">Select Floor:</label>
    <select
      value={selectedFloor}
      onChange={(e) => onFloorChange(e.target.value)}
      className="border rounded-md px-2 py-1"
    >
      <option value="All Floors">All Floors</option>
      {availableFloors.map((floor) => (
        <option key={floor} value={floor}>
          {floor}
        </option>
      ))}
    </select>
  </div>
);

export default FloorSelector;
