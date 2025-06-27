
import React from 'react';

const VersionSelector = ({ versions, selectedVersion, setSelectedVersion, label }) => {
  return (
    <div className="col-md-4">
      <label htmlFor={label} className="form-label">{label}</label>
      <select
        id={label}
        className="form-select"
        value={selectedVersion}
        onChange={(e) => setSelectedVersion(e.target.value)}
      >
        {versions.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VersionSelector;
