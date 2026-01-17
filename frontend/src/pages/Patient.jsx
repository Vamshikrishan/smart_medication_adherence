import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function Patient() {
  const [prescription, setPrescription] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null);

  const qrRef = useRef(null);
  const scanOnce = useRef(false);
  const alarmInterval = useRef(null);
  const engineInterval = useRef(null);

  /* ===============================
     LOAD AVAILABLE VOICES
  =============================== */
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

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
     VOICE ENGINE (FIXED)
  =============================== */
  const speak = (text, langCode) => {
    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();

    const selectedVoice = voices.find(
      (v) =>
        v.lang === langCode ||
        v.lang.startsWith(langCode.split("-")[0])
    );

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.lang = langCode;
    utterance.rate = 0.9;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
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
    window.speechSynthesis.cancel();
    setActiveAlert(null);
  };

  /* ===============================
     REMINDER ENGINE
  =============================== */
  const startReminderEngine = (medicines) => {
    engineInterval.current = setInterval(() => {
      const now = new Date();

      const currentDate = now.toISOString().split("T")[0];
      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      medicines.forEach((med) => {
        if (
          currentDate >= med.startDate &&
          currentDate <= med.endDate &&
          currentTime === med.reminderTime
        ) {
          startAlarm(med.name, med.reminderTime);
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
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        await qr.stop();
        await qr.clear();

        const data = await fetchPrescription(decodedText);
        startReminderEngine(data.medicines);
      }
    );

    return () => {
      if (engineInterval.current)
        clearInterval(engineInterval.current);
    };
  }, []);

  /* ===============================
     UI
  =============================== */
  return (
    <div style={{ padding: 30, textAlign: "center" }}>
      <h2>Patient Portal</h2>
      <p>Scan QR provided by pharmacy</p>

      <div id="qr-reader" style={{ width: 300, margin: "auto" }} />

      {prescription && (
        <>
          <h3>Medicines</h3>
          {prescription.medicines.map((m, i) => (
            <p key={i}>
              <b>{m.name}</b> — {m.reminderTime} — {m.duration} days
            </p>
          ))}
        </>
      )}

      {/* 🔔 ALERT PANEL */}
      {activeAlert && (
        <div
          style={{
            background: "#ffcccc",
            padding: 25,
            marginTop: 30,
            borderRadius: 12,
          }}
        >
          <h2>💊 MEDICATION ALERT</h2>

          <h3>
            Take <b>{activeAlert.medicine}</b>
          </h3>

          <h3>Time: {activeAlert.time}</h3>

          <button
            onClick={stopAlarm}
            style={{
              padding: 12,
              fontSize: 18,
              background: "red",
              color: "white",
              border: "none",
              borderRadius: 6,
              marginTop: 15,
            }}
          >
            STOP ALARM
          </button>
        </div>
      )}
    </div>
  );
}

export default Patient;
