const CampusSelector = ({ selectedCampus, onCampusChange }) => (
    <div className="mb-4 text-center">
      <label className="font-semibold mr-2">Select Campus:</label>
      <select
        value={selectedCampus}
        onChange={(e) => onCampusChange(e.target.value)}
        className="border rounded-md px-2 py-1"
      >
        <option value="Karamalmi">Karamalmi</option>
        </select>
    </div>
  );
  
  export default CampusSelector;
  