import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header
      className="bg-[#BFDBFE] h-14 flex justify-between items-center px-4 border-b"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "16px",
        width: "100%",
        backgroundColor: "#dbdbdb",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        className="text-2xl font-bold bg-transparent border-none outline-none"
        style={{
          color: "#000080",
          backgroundColor: "transparent",
          border: "none",
          outline: "none",
          transform: "translateX(-20px)", // 왼쪽으로 이동
        }}
      >
        &lt;
      </button>
      <h1
        style={{
          fontSize: "25px",
          transform: "translate(65px, 3px)", // 오른쪽으로 약간 이동
        }}
        className="font-semibold flex-1 text-right"
      >
        검사하기
      </h1>
      <div className="w-8"></div>
    </header>
  );
}
