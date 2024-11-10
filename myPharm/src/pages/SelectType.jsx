import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function SelectType() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
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
      const response = await fetch("http://localhost:8080/userinfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserName(userData.userName); // Set the username from response
      } else if (response.status === 401) {
        console.error("권한거부");
        alert("로그인이 만료되었습니다");
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
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
          {userName ? `안녕하세요 ${userName}님!` : "사용자님"}
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

      <div
        style={{
          flexGrow: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            margin: "0 16px",
            padding: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <i className="fas fa-shield-alt" style={{ color: "#4CAF50", marginRight: "10px", fontSize: "24px" }}></i>
            <p style={{ fontSize: "16px", color: "#374151", fontWeight: "bold", margin: 0 }}>
              복용중인 약이 안전한지 확인할 수 있어요!
            </p>
          </div>
          <button
            onClick={() => navigate("/select-type")}
            style={{
              width: "100%",
              padding: "30px 20px", // 세로 길이 증가
              marginBottom: "20px",
              borderRadius: "8px",
              backgroundColor: "#E0F2FF",
              color: "#374151",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
              transition: "background-color 0.3s ease",
              display: "flex", // 아이콘과 텍스트를 가로로 정렬
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "left", // 텍스트 왼쪽 정렬
            }}
          >
            마이팜
            <i className="fas fa-chevron-right" style={{ color: "#374151" }}></i> {/* 오른쪽 화살표 아이콘 */}
          </button>
          <button
            onClick={() => navigate("/short-select")}
            style={{
              width: "100%",
              padding: "30px 20px",
              marginBottom: "20px",
              borderRadius: "8px",
              backgroundColor: "#E0F2FF",
              color: "#374151",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
              transition: "background-color 0.3s ease",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "left",
            }}
          >
            이 약 먹어도되나요?
            <i className="fas fa-chevron-right" style={{ color: "#374151" }}></i>
          </button>
          <button
            onClick={() => navigate("/long-select")}
            style={{
              width: "100%",
              padding: "30px 20px",
              borderRadius: "8px",
              backgroundColor: "#E0F2FF",
              color: "#374151",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
              transition: "background-color 0.3s ease",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              textAlign: "left",
            }}
          >
            새로운 장기복용약을 처방받았어요!
            <i className="fas fa-chevron-right" style={{ color: "#374151" }}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
