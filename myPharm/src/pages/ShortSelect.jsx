import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "../styles/datepicker.css";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import MedRef from "../components/ui/MedRefLong.jsx";
import MedRefShort from "../components/ui/MedRefShort.jsx";

const API_BASE_URL = "http://localhost:8080";
const ACCESS_TOKEN =
  "eyJ0eXBlIjoiYWNjZXNzIiwiYWxnIjoiSFMyNTYifQ.eyJ1c2VySWQiOjM3ODUyNTY0NjksImlhdCI6MTczMTE3MTY1OSwiZXhwIjoxNzMxNzc2NDU5fQ.HjXkr1XHjQbMgc2Sqjv1m6J94NjUO88vPlOJGkrYXDM";

export default function ShortTermMedicine() {
  // const [data, setData] = useState([]); //데이터 저장할곳
  const [searchText, setSearchText] = useState(""); //검색어
  //   const [startDate, setStartDate] = useState(new Date());
  //   const [endDate, setEndDate] = useState(new Date());
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [searchResults, setSearchResults] = useState([]); //검색결과저장
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 약품 검색 API 호출 함수
  const searchMedicines = async (searchText) => {
    if (!searchText.trim()) {
      setError("검색어를 입력해주세요");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Searching for:", searchText);

      const response = await fetch(
        `${API_BASE_URL}/medicine/search?medicineName=${encodeURIComponent(
          searchText
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // API 응답 형식에 따라 데이터 처리
      let formattedResults;
      if (Array.isArray(data)) {
        formattedResults = data.map((item, index) => ({
          id: index + 1,
          name: item.medicineName || item.name,
        }));
      } else if (data.medicineName) {
        formattedResults = [
          {
            id: 1,
            name: data.medicineName,
          },
        ];
      } else {
        formattedResults = [];
      }

      setSearchResults(formattedResults);

      if (formattedResults.length === 0) {
        setError("검색 결과가 없습니다");
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const navigate = useNavigate();

  const handleSearch = () => {
    searchMedicines(searchText);
  };

  const handleResultClick = (medicine) => {
    console.log("Selected medicine:", medicine);
    setSearchText(medicine.name);
    setSearchResults([]);
    handleCheckboxChange(medicine);
  };

  const handleSave = () => {
    if (selectedMedicines.length > 0) {
      const currentDateTime = new Date();

      const medicinesWithDates = selectedMedicines.map((medicine) => {
        const { id, name, ...rest } = medicine;
        return {
          medicineName: name,
          startDate: currentDateTime.toISOString(),
          endDate: currentDateTime.toISOString(),
        };
      });
      console.log("Medicines with dates:", medicinesWithDates);
      console.log("Current saved medicines:", savedMedicines);

      setSavedMedicines([...savedMedicines, ...medicinesWithDates]);
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
        {/* 검색 결과 표시 */}
        {isLoading ? (
          <div className="text-center p-4">검색 중...</div>
        ) : (
          searchResults.length > 0 && (
            <div className="mb-4">
              <div
                className="bg-white p-3 rounded-lg shadow max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
                style={{
                  maxHeight: "240px",
                  overflowY: "auto",
                }}
              >
                {searchResults.map((medicine) => (
                  <div
                    key={medicine.id}
                    className="mb-2 p-2 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleResultClick(medicine)}
                  >
                    <span className="text-sm font-medium">{medicine.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </section>

      <button
        onClick={() => {
          handleSave();
        }}
        className="w-full p-3 bg-green-500 text-white rounded-lg"
        // disabled={selectedMedicines.length === 0}
      >
        저장하기
      </button>

      <MedRefShort savedMedicines={savedMedicines} />
      {/* 검사하기 버튼 */}
      <button
        onClick={() =>
          navigate("/short-check-medicines", {
            state: { savedMedicines },
          })
        }
        className="w-full p-4 bg-blue-600 text-white rounded-lg fixed bottom-4 left-0 mx-4 max-w-[calc(100%-32px)]"
      >
        검사하기
      </button>
    </div>
  );
}
