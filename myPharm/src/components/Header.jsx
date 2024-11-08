import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header
      className="bg-white h-14 flex justify-between items-center px-4 border-b"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "16px",
        width: "100%",
      }}
    >
      <button onClick={() => navigate(-1)} className="text-2xl font-bold">
        &lt;
      </button>
      <h1 className="text-lg font-semibold flex-1 text-center">검사하기</h1>
      <div className="w-8"></div>
    </header>
  );
}
