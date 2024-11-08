// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Main from "./pages/Main";
import SelectType from "./pages/SelectType";
import MedicineList from "./pages/MedicineList";
import { useEffect } from "react";
import ChechkMedicines from "./pages/ChechkMedicines";
import MobileLayout from "./pages/ShortSelect";
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
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/select-type" element={<SelectType />} />
        {/* 단발 */}
        <Route path="/short-select" element={<MobileLayout />} />

        <Route path="/medicine-list" element={<MedicineList />} />
        <Route path="/check-medicines" element={<ChechkMedicines />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
