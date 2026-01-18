import { useNavigate } from "react-router-dom";
import "/workspaces/smart_medication_adherence/frontend/src/styles/main.css";

function Home() {
  const navigate = useNavigate();
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">
          QR-Based Smart Medication <br /> Adherence System
        </h1>

        <div className="landing-buttons">
          <button className="btn btn-primary landing-btn" onClick={() => navigate("/pharmacy")}>
            Pharmacy
          </button>

          <button className="btn btn-primary landing-btn" onClick={() => navigate("/patient")}>
            Patient
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
