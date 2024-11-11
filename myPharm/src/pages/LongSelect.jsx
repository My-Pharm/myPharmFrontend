import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "../styles/datepicker.css";
import { Button } from "../components/ui/button";
import Header from "../components/Header";
import MedRef from "../components/ui/MedRefLong.jsx";

const API_BASE_URL = "http://localhost:8080";
// const ACCESS_TOKEN =
//   "eyJ0eXBlIjoiYWNjZXNzIiwiYWxnIjoiSFMyNTYifQ.eyJ1c2VySWQiOjM3ODUyNTY0NjksImlhdCI6MTczMTE3MTY1OSwiZXhwIjoxNzMxNzc2NDU5fQ.HjXkr1XHjQbMgc2Sqjv1m6J94NjUO88vPlOJGkrYXDM";

export default function LongTermMedicine() {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const ACCESS_TOKEN = localStorage.getItem('accessToken');

  // 저장된 약품 목록 가져오기
  useEffect(() => {
    const fetchSavedMedicines = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/medbox/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API 오류: ${response.status}`);
        }

        const data = await response.json();
        console.log("Saved medicines from API:", data);
        setSavedMedicines(data);
      } catch (err) {
        console.error("Error fetching saved medicines:", err);
        setError(err.message);
      }
    };

    fetchSavedMedicines();
  }, []);
  const fetchUserName = async (token) => {
    try {
      const response = await fetch("http://localhost:8080/userinfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserName(userData.userName);
      } else if (response.status === 401) {
        console.error("권한 거부");
        alert("로그인이 만료되었습니다");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      fetchUserName(accessToken);
    } else {
      console.error("No access token found");
    }
  }, []);

  // 약품 검색 API 호출 함수
  const searchMedicines = async (searchText) => {
    if (!searchText.trim()) {
      setError("검색어를 입력해주세요");
      return;
    }

    setIsSearchLoading(true);
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
      setIsSearchLoading(false);
    }
  };

  const handleSearch = () => {
    searchMedicines(searchText);
  };

  const handleResultClick = (medicine) => {
    console.log("Selected medicine:", medicine);
    setSearchText(medicine.name);
    setSearchResults([]);
    handleCheckboxChange(medicine);
  };

  const handleSave = async () => {
    if (selectedMedicines.length === 0) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/medbox/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          medicineName: selectedMedicines[0].name,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("약품 저장에 실패했습니다.");
      }

      const medicinesWithDates = selectedMedicines.map((medicine) => ({
        medicineName: medicine.name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      }));

      setSavedMedicines((prev) => [...prev, ...medicinesWithDates]);
      setSearchText("");
      setSelectedMedicines([]);
      setSearchResults([]);
      console.log("Saved medicines:", medicinesWithDates);
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };
  const deleteMedicine = async (medicine) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/medbox/delete?medicineName=${encodeURIComponent(
          medicine.medicineName
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("약품 삭제에 실패했습니다.");
      }

      // 성공적으로 삭제되면 목록에서도 제거
      setSavedMedicines((prev) =>
        prev.filter((item) => item.medicineName !== medicine.medicineName)
      );
    } catch (err) {
      console.error("Delete error:", err);
      setError("약품 삭제 중 오류가 발생했습니다.");
    }
  };
  const handleCheckboxChange = (medicine) => {
    setSelectedMedicines((prev) => {
      const isSelected = prev.some((item) => item.name === medicine.name);
      if (isSelected) {
        return prev.filter((item) => item.name !== medicine.name);
      } else {
        return [...prev, medicine];
      }
    });
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };
  const containerStyle = {
    fontFamily: "'Gowun Batang', serif",
    backgroundColor: "#BFDBFE",
    color: "#374151",
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  return (
    <div style={containerStyle}>
      <header
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          {userName ? `${userName}님의 복용중인 약물입니다!` : "사용자님"}
        </span>
        <button
          style={{
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
            border: "none",
          }}
        >
          <i className="fas fa-list" style={{ color: "#333" }}></i>
        </button>
      </header>
      <Header />
    <div className="min-h-screen bg-gray-50 p-4">

      {/* 검색 섹션 */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="약품명을 입력하세요"
            className="flex-1 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={isSearchLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
          >
            {isSearchLoading ? "검색 중..." : "검색"}
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* 검색 결과 표시 */}
        {isSearchLoading ? (
          <div className="text-center p-2"></div>
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

        {/* 선택된 약품 표시 */}
        {selectedMedicines.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">선택된 약품:</h3>
            <div className="bg-white p-4 rounded-lg shadow">
              {selectedMedicines.map((medicine) => (
                <div key={medicine.id} className="mb-2">
                  {medicine.name}
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
        onClick={handleSave}
        disabled={selectedMedicines.length === 0 || isSaving}
        className="w-full p-3 bg-green-500 text-white rounded-lg disabled:bg-gray-400 mb-6 rounded-lg"
      >
        저장하기
      </button>
      <br/>
      <br/>

      <div style={{ maxHeight: "300px", overflowY: "auto" }} className="mb-20">
        <MedRef savedMedicines={savedMedicines} onDelete={deleteMedicine} />
      </div>
      <button
        onClick={() => navigate("/long-check-medicines")}
        className="w-full p-3 bg-blue-600 text-white rounded-lg fixed bottom-4 left-0 mx-4 max-w-[calc(100%-32px)]"
      >
        검사하기
      </button>
    </div>
    </div>
  );
}
