import React from "react";
import { useNavigate } from "react-router-dom";

export default function SelectType() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div
        className="flex flex-col items-center gap-4"
        style={{ marginTop: "30vh" }}
      >
        <h2 className="text-2xl font-bold mb-6">내약 조회</h2>
        <button
          onClick={() =>
            navigate("/short-select", { state: { type: "short" } })
          }
          className="w-48 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          style={{ marginRight: "20px" }}
        >
          이거 같이 먹어도 되나요(단발)
        </button>
        <button
          onClick={() => navigate("/long-select", { state: { type: "long" } })}
          className="w-48 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          장기
        </button>
      </div>
    </div>
  );
}
