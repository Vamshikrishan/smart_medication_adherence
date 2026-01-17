import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function Patient() {
  const [prescription, setPrescription] = useState(null);
  const [activeReminder, setActiveReminder] = useState(null);

  const qrRef = useRef(null);
  const reminderInterval = useRef(null);
  const voiceInterval = useRef(null);

  /* ============================
     FETCH PRESCRIPTION
     ============================ */
  const fetchPrescription = async (id) => {
    const res = await fetch(
      `https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/api/prescriptions/${id}`
    );
    const data = await res.json();
    setPrescription(data);
    return data;
  };

  /* ============================
     MULTI LANGUAGE VOICE
     ============================ */
  const speak = (medicine, time) => {
    speechSynthesis.cancel();

    const en = new SpeechSynthesisUtterance(
      `It is ${time}. Time to take your medicine ${medicine}`
    );
    en.lang = "en-IN";

    const hi = new SpeechSynthesisUtterance(
      `अब ${time} हो गए हैं। कृपया ${medicine} दवा लें।`
    );
    hi.lang = "hi-IN";

    const te = new SpeechSynthesisUtterance(
      `ఇప్పుడు ${time} అయ్యింది. దయచేసి ${medicine} మందు తీసుకోండి.`
    );
    te.lang = "te-IN";

    speechSynthesis.speak(en);
    speechSynthesis.speak(hi);
    speechSynthesis.speak(te);
  };

  /* ============================
     START ALERT
     ============================ */
  const startAlert = (med) => {
    setActiveReminder(med);

    if (Notification.permission === "granted") {
      new Notification("💊 Medication Reminder", {
        body: `Time to take ${med.name}`,
      });
    }

    speak(med.name, med.time);

    voiceInterval.current = setInterval(() => {
      speak(med.name, med.time);
    }, 20000);
  };

  /* ============================
     STOP ALERT
     ============================ */
  const stopAlert = () => {
    clearInterval(voiceInterval.current);
    speechSynthesis.cancel();
    setActiveReminder(null);
  };

  /* ============================
     TIME MATCH LOGIC
     ============================ */
  const startTimeTracker = (medicines) => {
    reminderInterval.current = setInterval(() => {
      const now = new Date();

      const currentTime = now
        .toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(" ", "");

      medicines.forEach((med) => {
        const startDate = new Date(med.createdAt || prescription.createdAt);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + Number(med.duration));

        if (now > endDate) return;

        if (
          currentTime === med.time.replace(" ", "") &&
          !activeReminder
        ) {
          startAlert(med);
        }
      });
    }, 60000); // check every minute
  };

  /* ============================
     QR SCAN
     ============================ */
  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        await scanner.stop();
        await scanner.clear();

        const data = await fetchPrescription(decodedText);
        startTimeTracker(data.medicines);
      }
    );

    qrRef.current = scanner;

    return () => {
      if (qrRef.current) qrRef.current.stop().catch(() => {});
      clearInterval(reminderInterval.current);
      clearInterval(voiceInterval.current);
    };
  }, []);

  /* ============================
     UI
     ============================ */
  return (
    <div style={{ textAlign: "center", padding: 30 }}>
      <h2>Patient Portal</h2>
      <p>Scan QR provided by pharmacy</p>

      <div id="qr-reader" style={{ width: 300, margin: "auto" }} />

      {prescription && (
        <>
          <h3>Medicines</h3>
          {prescription.medicines.map((m, i) => (
            <p key={i}>
              {m.name} — {m.time} — {m.duration} days
            </p>
          ))}
        </>
      )}

      {activeReminder && (
        <div
          style={{
            marginTop: 30,
            background: "#ffe6e6",
            padding: 25,
            borderRadius: 10,
            border: "2px solid red",
          }}
        >
          <h2>⏰ MEDICATION ALERT</h2>
          <h3>{activeReminder.name}</h3>
          <p>Time: {activeReminder.time}</p>

          <button
            onClick={stopAlert}
            style={{
              background: "red",
              color: "white",
              padding: "12px 30px",
              fontSize: 18,
              border: "none",
              borderRadius: 8,
            }}
          >
            STOP REMINDER
          </button>
        </div>
      )}
    </div>
  );
}

export default Patient;
