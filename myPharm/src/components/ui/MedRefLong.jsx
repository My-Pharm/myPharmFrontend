import React from "react";
import "../../styles/MedRef.css";
export default function MedRefLong({ savedMedicines }) {
  return (
    <div>
      <ul className="med-list">
        {savedMedicines.map((medicine, index) => (
          <li key={index} className="med-item">
            {medicine.name} - {medicine.startDate.toLocaleDateString("ko-KR")} ~{" "}
            {medicine.endDate.toLocaleDateString("ko-KR")}
          </li>
        ))}
      </ul>
    </div>
  );
}
