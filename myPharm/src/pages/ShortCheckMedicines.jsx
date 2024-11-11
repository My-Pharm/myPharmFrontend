import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert } from 'react-bootstrap';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "../components/Header";

export default function ShortCheckMedicines({ medicines }) {
  const [alerts, setAlerts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = 'http:///51.21.23.40/api';
  const ACCESS_TOKEN = localStorage.getItem("accessToken");

  useEffect(() => {
    // Google Font 로드
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
      const response = await fetch("http:///51.21.23.40/apiuserinfo", {
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
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          fetch(`${API_BASE_URL}/alert-once`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            body: JSON.stringify(medicines),
          }),
          fetch(`${API_BASE_URL}/interaction/check-once`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            body: JSON.stringify(medicines),
          }),
        ]);

        if (response1.ok && response2.ok) {
          const data1 = await response1.json();
          const data2 = await response2.json();
          const combinedData = [...data1, ...data2];

          const groupedAlerts = combinedData.reduce((acc, item) => {
            const { typeName, medicineName, contents } = item;
            const key = `${medicineName}-${typeName}`;

            if (!acc[key] || acc[key].contents.length < contents.length) {
              acc[key] = item;
            }
            return acc;
          }, {});

          const formattedAlerts = Object.values(groupedAlerts).reduce((acc, item) => {
            const { typeName } = item;
            if (!acc[typeName]) {
              acc[typeName] = [];
            }
            acc[typeName].push(item);
            return acc;
          }, {});

          setAlerts(formattedAlerts);
        } else {
          setError('Failed to fetch alerts. Please try again later.');
        }
      } catch (error) {
        setError('An error occurred while fetching alerts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [medicines]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

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
          {userName ? `${userName}님의 주의사항입니다!` : "사용자님"}
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
      <Header/>

      <div
        style={{
          flexGrow: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          {Object.keys(alerts).map((type) => (
            <div key={type} style={{ marginBottom: "20px" }}>
              <h4 style={{ fontWeight: "bold", color: "#1F2937", marginBottom: "10px" }}>{type}</h4>
              <div style={{ overflowX: "auto" }}>
                {alerts[type].map((alert, index) => (
                  <div key={index} style={{ padding: "10px", borderBottom: "1px solid #e5e7eb" }}>
                    <p style={{ fontWeight: "bold", color: "#1F2937", marginBottom: "5px" }}>
                      {alert.medicineName}
                    </p>
                    <p style={{ color: "#374151", marginBottom: "0" }}>{alert.contents}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
