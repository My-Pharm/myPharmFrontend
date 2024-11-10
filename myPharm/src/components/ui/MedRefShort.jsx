import React from "react";

const MedRefShort = ({ savedMedicines, onDelete }) => {
  return (
    <div className="space-y-2">
      {savedMedicines.map((medicine, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
        >
          <span>{medicine.medicineName}</span>
          <button
            onClick={() => onDelete(medicine)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default MedRefShort;
