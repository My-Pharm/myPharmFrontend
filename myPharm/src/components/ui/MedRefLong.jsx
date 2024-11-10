import React from "react";

const MedRefLong = ({ savedMedicines, onDelete }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">내가 먹고 있는 약</h3>
      <div className="space-y-2">
        {savedMedicines.map((medicine, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="flex flex-col items-center gap-2">
              <span className="font-medium text-lg">
                {medicine.medicineName}
              </span>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedRefLong;
