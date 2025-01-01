const FloorSelector = ({ selectedFloor, onFloorChange }) => (
    <div className="mb-4 text-center">
      <label className="font-semibold mr-2">Select Floor:</label>
      <select
        value={selectedFloor}
        onChange={(e) => onFloorChange(e.target.value)}
        className="border rounded-md px-2 py-1"
      >
        <option value="All Floors">All Floors</option>
        <option value="2">2</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
      </select>
    </div>
  );
  
  export default FloorSelector;
  