import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "/workspaces/smart_medication_adherence/frontend/src/styles/Patient.css";

function Patient() {
  const [prescription, setPrescription] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);

  const qrRef = useRef(null);
  const scanOnce = useRef(false);
  const alarmInterval = useRef(null);

  /* ===============================
     TIME CONVERTER (24 → 12)
  =============================== */
  const convertTo12Hour = (time24) => {
    let [hour, minute] = time24.split(":");
    hour = parseInt(hour);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  };

  /* ===============================
     FETCH PRESCRIPTION
  =============================== */
  const fetchPrescription = async (id) => {
    const res = await fetch(
      `https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/api/prescriptions/${id}`
    );

    const data = await res.json();
    setPrescription(data);
    return data;
  };

  /* ===============================
     VOICE ENGINE
  =============================== */
  const speak = (text, lang) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = lang;
    msg.rate = 0.9;
    speechSynthesis.speak(msg);
  };

  const speakAllLanguages = (medicine, time) => {
    speak(
      `It is time to take your medicine ${medicine} at ${time}`,
      "en-IN"
    );

    speak(
      `अब ${medicine} दवा लेने का समय हो गया है ${time}`,
      "hi-IN"
    );

    speak(
      `Ippudu mee mandu teesukune samayam ${time} vachindi.Dayachesi ${medicine} mandu teesukondi.`,
      "en-IN"
    );
  };

  /* ===============================
     START ALARM
  =============================== */
  const startAlarm = (medicine, time) => {
    if (alarmInterval.current) return;

    setActiveAlert({ medicine, time });

    speakAllLanguages(medicine, time);

    alarmInterval.current = setInterval(() => {
      speakAllLanguages(medicine, time);
    }, 15000);
  };

  const stopAlarm = () => {
    clearInterval(alarmInterval.current);
    alarmInterval.current = null;
    speechSynthesis.cancel();
    setActiveAlert(null);
  };

  /* ===============================
     REMINDER ENGINE
  =============================== */
  const startReminderEngine = (medicines) => {
    setInterval(() => {
      const now = new Date();
      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      medicines.forEach((med) => {
        if (currentTime === med.reminderTime) {
          startAlarm(med.name, convertTo12Hour(med.reminderTime));
        }
      });
    }, 30000);
  };

  /* ===============================
     QR SCANNER
  =============================== */
  useEffect(() => {
    if (scanOnce.current) return;
    scanOnce.current = true;

    const qr = new Html5Qrcode("qr-reader");
    qrRef.current = qr;

    qr.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 260 },
      async (decodedText) => {
        await qr.stop();
        await qr.clear();

        const data = await fetchPrescription(decodedText);
        startReminderEngine(data.medicines);
      }
    );
  }, []);

  /* ===============================
     UI
  =============================== */
  return (
    <div className="patient-wrapper">
      <div className="patient-card">

        <h1 className="title">🙍‍♂️ Patient Portal</h1>
        <p className="subtitle">Scan QR provided by pharmacy</p>

        <div id="qr-reader" className="scanner-box" />

        {prescription && (
          <>
            <h2 className="section">Medicines</h2>

            <div className="medicine-list">
              {prescription.medicines.map((m, i) => (
                <div className="medicine-card" key={i}>
                  <h3>{m.name}</h3>
                  <p>
                    ⏰ {convertTo12Hour(m.reminderTime)} <br />
                    📅 {m.duration} days
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ALERT */}
        {activeAlert && (
          <div className="alert-box">
            <h2>💊 MEDICATION ALERT</h2>
            <h3>{activeAlert.medicine}</h3>
            <p>Time: {activeAlert.time}</p>

            <button onClick={stopAlarm}>STOP ALARM</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Patient;
