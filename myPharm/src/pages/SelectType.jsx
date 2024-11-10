import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SelectType() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#BFDBFE",
        fontFamily: "'Gowun Batang', serif",
      }}
    >
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
          {userName ? `${userName}님` : "사용자님"}
        </span>
        <button
          style={{
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
          }}
        >
          ≡
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
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <button
            onClick={() => navigate("/select-type")}
            style={{
              width: "100%",
              height: "70px",
              marginBottom: "20px",
              borderRadius: "8px",
              backgroundColor: "#3B82F6",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              border: "none",
              transition: "background-color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563EB")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
          >
            내약 조회
          </button>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => navigate("/short-select")}
              style={{
                flex: "1",
                height: "120px",
                borderRadius: "8px",
                backgroundColor: "#3B82F6",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                border: "none",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2563EB")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
            >
              이거 같이 먹어도 되나요(단발)
            </button>
            <button
              onClick={() => navigate("/long-select")}
              style={{
                flex: "1",
                height: "120px",
                borderRadius: "8px",
                backgroundColor: "#3B82F6",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                border: "none",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2563EB")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
            >
              장기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
