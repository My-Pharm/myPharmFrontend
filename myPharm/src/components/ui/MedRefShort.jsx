import React from "react";

export default function MedRefShort({ savedMedicines }) {
  return (
    <div>
      <ul className="med-list">
        {savedMedicines.map((medicine, index) => (
          <li key={index} className="med-item">
            {medicine.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
