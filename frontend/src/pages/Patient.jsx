import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function Patient() {
  const [prescription, setPrescription] = useState(null);
  const [activeReminder, setActiveReminder] = useState(null);

  const qrRef = useRef(null);
  const voiceLoopRef = useRef(null);

  /* ===========================
     FETCH PRESCRIPTION
     =========================== */
  const fetchPrescription = async (id) => {
    const res = await fetch(
      `https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/api/prescriptions/${id}`
    );
    const data = await res.json();
    setPrescription(data);
    return data;
  };

  /* ===========================
     MULTI LANGUAGE SPEECH
     =========================== */
  const speakAllLanguages = (medicine, time) => {
    speechSynthesis.cancel();

    const en = new SpeechSynthesisUtterance(
      `It is time to take your medicine ${medicine}`
    );
    en.lang = "en-IN";

    const hi = new SpeechSynthesisUtterance(
      `अब दवा लेने का समय हो गया है। कृपया ${medicine} लें।`
    );
    hi.lang = "hi-IN";

    const te = new SpeechSynthesisUtterance(
      `ఇప్పుడు మందు తీసుకునే సమయం అయ్యింది. దయచేసి ${medicine} తీసుకోండి.`
    );
    te.lang = "te-IN";

    speechSynthesis.speak(en);
    speechSynthesis.speak(hi);
    speechSynthesis.speak(te);
  };

  /* ===========================
     START REMINDER
     =========================== */
  const startReminder = (med) => {
    setActiveReminder(med);

    // Browser notification
    if (Notification.permission === "granted") {
      new Notification("💊 Medication Reminder", {
        body: `Time to take ${med.name}`,
      });
    }

    speakAllLanguages(med.name, med.time);

    voiceLoopRef.current = setInterval(() => {
      speakAllLanguages(med.name, med.time);
    }, 20000);
  };

  /* ===========================
     STOP REMINDER
     =========================== */
  const stopReminder = () => {
    clearInterval(voiceLoopRef.current);
    speechSynthesis.cancel();
    setActiveReminder(null);
  };

  /* ===========================
     SCHEDULE BY EXACT TIME
     =========================== */
  const scheduleReminders = (medicines) => {
    medicines.forEach((med) => {
      const [hour, minute] = med.time.split(":").map(Number);

      const now = new Date();
      const target = new Date();

      target.setHours(hour, minute, 0, 0);

      if (target < now) {
        target.setDate(target.getDate() + 1);
      }

      const delay = target - now;

      setTimeout(() => {
        startReminder(med);
      }, delay);
    });
  };

  /* ===========================
     QR SCANNER
     =========================== */
  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        await scanner.stop();
        await scanner.clear();

        const data = await fetchPrescription(decodedText);
        scheduleReminders(data.medicines);
      }
    );

    qrRef.current = scanner;

    return () => {
      if (qrRef.current) {
        qrRef.current.stop().catch(() => {});
      }
    };
  }, []);

  /* ===========================
     UI
     =========================== */
  return (
    <div style={{ textAlign: "center", padding: "30px" }}>
      <h2>Patient Portal</h2>
      <p>Scan QR code from pharmacy</p>

      <div id="qr-reader" style={{ width: "300px", margin: "auto" }} />

      {prescription && (
        <>
          <h3>Medicines</h3>
          {prescription.medicines.map((m, i) => (
            <p key={i}>
              {m.name} — {m.time}
            </p>
          ))}
        </>
      )}

      {activeReminder && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            background: "#ffe5e5",
            border: "2px solid red",
            borderRadius: 10,
          }}
        >
          <h2>⏰ Medication Alert</h2>
          <p>
            Time: <strong>{activeReminder.time}</strong>
          </p>
          <p>
            Medicine: <strong>{activeReminder.name}</strong>
          </p>

          <button
            onClick={stopReminder}
            style={{
              padding: "10px 25px",
              fontSize: 16,
              background: "red",
              color: "white",
              border: "none",
              borderRadius: 6,
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
