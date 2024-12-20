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
import "../../src/index.css";


export default function ShortTermMedicine() {
  const [searchText, setSearchText] = useState("");
  const [savedMedicines, setSavedMedicines] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  const API_BASE_URL = "http:///51.21.23.40/api";

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
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      fetchUserName(accessToken);
    } else {
      console.error("No access token found");
    }
  }, []);

  const fetchUserName = async (token) => {
    try {
      const response = await fetch("http:///51.21.23.40/api/userinfo", {
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

  const handleSearch = () => {
    searchMedicines(searchText);
  };

  const handleResultClick = (medicine) => {
    console.log("Selected medicine:", medicine);
    setSearchText(medicine.name);
    setSearchResults([]);
    // handleCheckboxChange(medicine);
    // 클릭한 약을 selectedMedicines에 추가하되 중복 방지
    setSelectedMedicines((prev) => {
      const isAlreadySelected = prev.some((item) => item.id === medicine.id);
      if (!isAlreadySelected) {
        return [...prev, medicine];
      }
      return prev;
    });
  };

  // 수정된 handleDelete 함수
  const handleDelete = (medicine) => {
    if (medicine.isNew) {
      // 새로 추가된 약품(단기 복용)은 화면에서만 제거
      setSelectedMedicines((prev) =>
        prev.filter((item) => item.name !== medicine.medicineName)
      );
      setSavedMedicines((prev) =>
        prev.filter((item) => item.medicineName !== medicine.medicineName)
      );
    } else {
      // 기존 저장된 약품은 DB에서 삭제
      const deleteFromDB = async () => {
        try {
          const response = await fetch(
            `${API_BASE_URL}/medbox/delete?medicineName=${encodeURIComponent(
              medicine.medicineName
            )}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ACCESS_TOKEN}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`삭제 실패: ${response.status}`);
          }

          setSavedMedicines((prev) =>
            prev.filter((item) => item.medicineName !== medicine.medicineName)
          );
        } catch (err) {
          console.error("Delete error:", err);
          setError("삭제 중 오류가 발생했습니다");
        }
      };
      deleteFromDB();
    }
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
          isNew: true, // 새로 추가된 약품임을 표시
        };
      });
      console.log("Medicines with dates:", medicinesWithDates);
      console.log("Current saved medicines:", savedMedicines);

      setSavedMedicines((prevMedicines) => [
        ...prevMedicines,
        ...medicinesWithDates,
      ]);
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
      <div className="min-h-screen bg-gray-50 p-4" style={{}}>
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
        onClick={handleSave}
        className="w-full p-3 bg-green-500 text-white rounded-lg rounded-lg"
      >
        저장하기
      </button>
      <br/>
      <br/>

      <div style={{ maxHeight: "300px", overflowY: "auto" }} className="mb-20">
        <MedRefShort savedMedicines={savedMedicines} onDelete={handleDelete} />
      </div>

      <button
        onClick={() =>
          navigate("/short-check-medicines", {
            state: { savedMedicines },
          })
        }
        className="w-full p-3 bg-blue-600 text-white rounded-lg fixed bottom-4 left-0 mx-4 max-w-[calc(100%-32px)]"
      >
        검사하기
      </button>
    </div>
    </div>
  );
}
