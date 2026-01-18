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
          <button 
            className="btn btn-primary landing-btn" 
            onClick={() => navigate("/pharmacy")}
            style={{color: "#1d4ed8"}}
            onMouseEnter={(e) => e.target.style.color = "white"}
            onMouseLeave={(e) => e.target.style.color = "#1d4ed8"}
          >
            Pharmacy
          </button>

          <button 
            className="btn btn-primary landing-btn" 
            onClick={() => navigate("/patient")}
            style={{color: "#1d4ed8"}}
            onMouseEnter={(e) => e.target.style.color = "white"}
            onMouseLeave={(e) => e.target.style.color = "#1d4ed8"}
          >
            Patient
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
