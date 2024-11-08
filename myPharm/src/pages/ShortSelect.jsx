import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "../styles/datepicker.css";

export default function ShortTermMedicine() {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  const handleSearch = () => {
    // 실제로는 API 호출 들어갈예정
    const mockResults = [
      { id: 1, name: "타이레놀", dosage: "500mg", period: "1일 3회" },
      { id: 2, name: "아스피린", dosage: "300mg", period: "1일 2회" },
    ];
    setSearchResults(mockResults);
  };

  const handleSave = () => {
    if (searchResults.length > 0) {
      setSavedMedicines([...savedMedicines, ...searchResults]);
      setSearchResults([]);
      setSearchText("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{}}>
      {/* 검색 섹션 */}
      <section style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "16px",
            width: "100%",
          }}
        >
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="약품명을 입력하세요"
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "16px",
              outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              whiteSpace: "nowrap",
              minWidth: "80px",
            }}
          >
            검색
          </button>
        </div>

        {/* 검색 결과 및 저장 버튼 */}
        {searchResults.length > 0 && (
          <div className="mb-4">
            <div className="bg-white p-4 rounded-lg shadow mb-2">
              {searchResults.map((medicine) => (
                <div
                  key={medicine.id}
                  className="mb-2 p-2 border-b last:border-b-0"
                >
                  <h3 className="font-bold">{medicine.name}</h3>
                  <p className="text-sm text-gray-600">
                    {medicine.dosage} - {medicine.period}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={handleSave}
              className="w-full p-3 bg-green-500 text-white rounded-lg"
            >
              저장하기
            </button>
          </div>
        )}
      </section>

      {/* 저장된 약 목록 */}
      <section className="mb-20">
        {" "}
        {/* 하단 버튼을 위한 여백 */}
        <h2 className="text-lg font-bold mb-3">저장된 약 목록</h2>
        <div className="bg-white rounded-lg shadow">
          {savedMedicines.length > 0 ? (
            savedMedicines.map((medicine) => (
              <div key={medicine.id} className="p-4 border-b last:border-b-0">
                <h3 className="font-bold">{medicine.name}</h3>
                <p className="text-sm text-gray-600">
                  {medicine.dosage} - {medicine.period}
                </p>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">
              저장된 약이 없습니다
            </p>
          )}
        </div>
      </section>

      {/* 검사하기 버튼 */}
      <button
        onClick={() => navigate("/short-check-medicines")}
        className="w-full p-4 bg-blue-600 text-white rounded-lg fixed bottom-4 left-0 mx-4 max-w-[calc(100%-32px)]"
      >
        검사하기
      </button>
    </div>
  );
}
