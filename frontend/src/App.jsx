import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pharmacy from "./pages/Pharmacy";
import Patient from "./pages/Patient";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/patient" element={<Patient />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
