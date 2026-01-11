import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>QR-Based Smart Medication Adherence System</h1>

      <div style={{ marginTop: "40px" }}>
        <button onClick={() => navigate("/pharmacy")} style={{ marginRight: "20px" }}>
          Pharmacy
        </button>

        <button onClick={() => navigate("/patient")}>
          Patient
        </button>
      </div>
    </div>
  );
}

export default Home;
