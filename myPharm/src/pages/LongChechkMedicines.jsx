import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Card, Table, Alert } from 'react-bootstrap'; // react-bootstrap 컴포넌트 import
export default function LongCheckMedicines() {
  const [alerts, setAlerts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = "http://localhost:8080";
  //const ACCESS_TOKEN = "eyJ0eXBlIjoiYWNjZXNzIiwiYWxnIjoiSFMyNTYifQ.eyJ1c2VySWQiOjM3ODUyNTY0NjksImlhdCI6MTczMTE3MTY1OSwiZXhwIjoxNzMxNzc2NDU5fQ.HjXkr1XHjQbMgc2Sqjv1m6J94NjUO88vPlOJGkrYXDM";
  const ACCESS_TOKEN = localStorage.getItem('accessToken');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          fetch(`${API_BASE_URL}/alert-check`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }),
          fetch(`${API_BASE_URL}/interaction/check-all`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
          }),
        ]);

        if (response1.ok && response2.ok) {
          const data1 = await response1.json();
          const data2 = await response2.json();
          const combinedData = [...data1, ...data2];

          // Group data by typeName, and keep the entry with the longest contents if medicine_name and type_name are the same
          const groupedAlerts = combinedData.reduce((acc, item) => {
            const { typeName, medicineName, contents } = item;
            const key = `${medicineName}-${typeName}`;

            // Check if the medicine and typeName combination already exists
            if (!acc[key] || acc[key].contents.length < contents.length) {
              acc[key] = item; // Keep the entry with the longest contents
            }
            return acc;
          }, {});

          // Transform groupedAlerts back into the desired format, grouped by typeName
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
          console.error("Failed to fetch alerts:", response1.status, response2.status);
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때
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
