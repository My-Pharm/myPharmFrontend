import React from "react";
import "../../styles/MedRef.css";
export default function MedRefLong({ savedMedicines }) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">내가 먹고 있는 약</h3>
      <div className="space-y-2">
        {savedMedicines.map((medicine, index) => (
          <div key={index} className="p-3 bg-white rounded-lg shadow">
            <div className="font-medium">{medicine.medicineName}</div>
            <div className="text-sm text-gray-600 mt-1">
              <span>시작일: {formatDate(medicine.startDate)}</span>
              <span className="mx-2">~</span>
              <span>종료일: {formatDate(medicine.endDate)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
