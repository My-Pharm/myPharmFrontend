import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main";
import SelectType from "./pages/SelectType";
import LongTermMedicine from "./pages/LongSelect";
import { useEffect } from "react";
import ChechkMedicines from "./pages/LongChechkMedicines";
import ShortTermMedicine from "./pages/ShortSelect";
import LongChechkMedicines from "./pages/LongChechkMedicines";
import ShortChechkMedicines from "./pages/ShortCheckMedicines";
import Header from "./components/Header";
import { useLocation } from "react-router-dom";
import KakaoLoginSuccess from "./pages/KakaoLoginSuccess"; 

// Wrapper 컴포넌트 추가
function ShortCheckMedicinesWrapper() {
  const location = useLocation();
  const savedMedicines = location.state?.savedMedicines || [];

  return <ShortChechkMedicines medicines={savedMedicines} />;
}

function App() {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });

  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/select-type" element={<SelectType />} />
        <Route path="/short-select" element={<ShortTermMedicine />} />
        <Route path="/long-select" element={<LongTermMedicine />} />
        <Route path="/long-check-medicines" element={<LongChechkMedicines />} />
        <Route
          path="/short-check-medicines"
          element={<ShortCheckMedicinesWrapper />}
        />
         <Route path="/login/success" element={<KakaoLoginSuccess />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
