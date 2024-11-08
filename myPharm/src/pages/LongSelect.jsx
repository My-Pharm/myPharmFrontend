import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "../styles/datepicker.css";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import MedRef from "../components/ui/MedRefLong.jsx";

export default function LongTermMedicine() {
  // const [data, setData] = useState([]); //데이터 저장할곳
  const [searchText, setSearchText] = useState(""); //검색어
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [searchResults, setSearchResults] = useState([]); //검색결과저장
  const [allMedicines] = useState([
    { id: 1, name: "타이레놀" },
    { id: 2, name: "아스피린" },
    { id: 3, name: "부루펜" },
    { id: 4, name: "게보린" },
    { id: 5, name: "판콜에이" },
    { id: 6, name: "아스피린2" },
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

  const handleResultClick = (medicineName) => {
    setSearchText(medicineName);
    setSearchResults([]);

    const selectedMedicine = allMedicines.find(
      (medicine) => medicine.name === medicineName
    );
    if (selectedMedicine) {
      handleCheckboxChange(selectedMedicine);
    }
  };

  const handleSave = () => {
    console.log("savedMedicine");
    console.log(selectedMedicines);

    if (selectedMedicines.length > 0) {
      const medicinesWithDates = selectedMedicines.map((medicine) => ({
        ...medicine,
        startDate: startDate,
        endDate: endDate,
      }));
      const newMedicine = {
        name: searchText,
        startDate: startDate,
        endDate: endDate,
      };

      setSavedMedicines([
        ...savedMedicines,
        // newMedicine,
        ...medicinesWithDates,
      ]);
      setSearchText("");
      setSelectedMedicines([]);
      console.log(savedMedicines);
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

  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{}}>
      <Header />
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
              backgroundColor: "#12273d",
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
                  className="mb-2 p-2 border-b last:border-b-0 cursor-pointer"
                  onClick={() => handleResultClick(medicine.name)}
                >
                  <h3 className="font-bold">{medicine.name}</h3>
                  <p className="text-sm text-gray-600">
                    {medicine.dosage} - {medicine.period}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
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
      <button
        onClick={() => {
          console.log("AB");
          handleSave();
        }}
        className="w-full p-3 bg-green-500 text-white rounded-lg"
        // disabled={selectedMedicines.length === 0}
      >
        저장하기
      </button>
      {/* 
      <section className="mb-20">
        <h2 className="text-lg font-bold mb-3">저장된 약 목록</h2>
        <div className="bg-white rounded-lg shadow">
          {savedMedicines.length > 0 ? (
            savedMedicines.map((medicine, index) => (
              <div key={index} className="p-4 border-b last:border-b-0">
                <h3 className="font-bold">{medicine.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {medicine.startDate.toLocaleDateString("ko-KR")} ~{" "}
                  {medicine.endDate.toLocaleDateString("ko-KR")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  용량: {medicine.dosage}
                </p>
              </div>
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">
              저장된 약이 없습니다
            </p>
          )}
        </div>
      </section> */}

      <MedRef savedMedicines={savedMedicines} />
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
