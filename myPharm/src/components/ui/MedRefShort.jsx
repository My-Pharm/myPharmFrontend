import React from "react";

const MedRefShort = ({ savedMedicines, onDelete }) => {
  return (
    <div className="space-y-2">
      {savedMedicines.map((medicine, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
        >
          <span className="text-sm font-medium">{medicine.medicineName}</span>
          <span className="text-sm text-gray-500">
            {new Date(medicine.startDate).toLocaleDateString()} ~{" "}
            {new Date(medicine.endDate).toLocaleDateString()}
          </span>
          <button
            onClick={() => onDelete(medicine)}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 border-none p-0"
            style={{
              color: "#12273d",
              minWidth: "auto",
              boxShadow: "none",
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default MedRefShort;
