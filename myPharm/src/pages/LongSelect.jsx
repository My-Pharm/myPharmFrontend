import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "../styles/datepicker.css";
import { Button } from "../components/ui/button";

export default function LongTermMedicine() {
  const [data, setData] = useState([]); //데이터 저장할곳
  const [searchText, setSearchText] = useState(""); //검색어
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [allMedicines] = useState([
    { id: 1, name: "타이레놀", dosage: "500mg", period: "1일 3회" },
    { id: 2, name: "아스피린", dosage: "300mg", period: "1일 2회" },
    { id: 3, name: "부루펜", dosage: "200mg", period: "1일 3회" },
    { id: 4, name: "게보린", dosage: "300mg", period: "1일 2회" },
    { id: 5, name: "판콜에이", dosage: "400mg", period: "1일 3회" },
    { id: 6, name: "아스피린2", dosage: "300mg", period: "1일 2회" },
  ]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      const filteredResults = allMedicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleSave = () => {
    if (selectedMedicines.length > 0) {
      const medicinesWithDates = selectedMedicines.map((medicine) => ({
        ...medicine,
        startDate: startDate,
        endDate: endDate,
      }));
      setSavedMedicines([...savedMedicines, ...medicinesWithDates]);
      // setSearchResults([]);
      setSearchText("");
      setSelectedMedicines([]);
    }
  };

  const handleCheckboxChange = (medicine) => {
    setSelectedMedicines((prev) => {
      const isSelected = prev.some((item) => item.id === medicine.id);
      if (isSelected) {
        return prev.filter((item) => item.id !== medicine.id);
      } else {
        return [...prev, medicine];
      }
    });
  };

  useEffect(() => {}, [{}]);

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

        {/* 달력 선택 */}
        <div className="calendar-container">
          <div className="calendar-wrapper">
            <p className="mb-2 text-sm text-gray-600">시작</p>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              locale={ko}
              dateFormat="yyyy년 MM월 dd일"
              inline
            />
          </div>
          <div className="calendar-wrapper">
            <p className="mb-2 text-sm text-gray-600">끝</p>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              locale={ko}
              dateFormat="yyyy년 MM월 dd일"
              inline
            />
          </div>
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
                  {" "}
                  <input
                    type="checkbox"
                    checked={selectedMedicines.some(
                      (item) => item.id === medicine.id
                    )}
                    onChange={() => handleCheckboxChange(medicine)}
                    className="mr-3 w-4 h-4"
                  />
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
              disabled={selectedMedicines.length === 0}
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
                <p className="text-xs text-gray-500 mt-1">
                  {medicine.startDate.toLocaleDateString("ko-KR")} ~{" "}
                  {medicine.endDate.toLocaleDateString("ko-KR")}
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
        onClick={() => navigate("/long-check-medicines")}
        className="w-full p-4 bg-blue-600 text-white rounded-lg fixed bottom-4 left-0 mx-4 max-w-[calc(100%-32px)]"
      >
        검사하기
      </button>
    </div>
  );
}
