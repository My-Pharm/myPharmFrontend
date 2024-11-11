import React from "react";

const MedRefShort = ({ savedMedicines, onDelete }) => {
  return (
    <div className="space-y-2">
      {savedMedicines.map((medicine, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm relative">
          {/* Medicine 정보 컨테이너 */}
          <div>
            <div className="text-sm font-medium">{medicine.medicineName}</div>
            <div className="text-xs text-gray-500">
              {new Date(medicine.startDate).toLocaleDateString()} ~{" "}
              {new Date(medicine.endDate).toLocaleDateString()}
            </div>
          </div>

          {/* x 버튼을 오른쪽 상하 가운데에 위치시킴 */}
          <button
            onClick={() => onDelete(medicine)}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 flex items-center justify-center rounded-full hover:bg-gray-50"
            style={{
              color: "white",
              backgroundColor: "black",
              borderColor: "black",
              fontSize: "14px", // 텍스트 크기 조정
              padding: "6px 12px", // 버튼 패딩 조정
              minWidth: "auto",
            }}
          >
            삭제하기
          </button>
        </div>
      ))}
    </div>
  );
};

export default MedRefShort;
