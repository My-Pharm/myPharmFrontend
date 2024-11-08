// App.jsx
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

        <Route path="/short-select" element={<ShortTermMedicine />} />

        <Route path="/long-select" element={<LongTermMedicine />} />
        <Route path="/long-check-medicines" element={<LongChechkMedicines />} />
        <Route
          path="/short-check-medicines"
          element={<ShortChechkMedicines />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
