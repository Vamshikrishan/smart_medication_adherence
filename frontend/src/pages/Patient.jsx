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
    msg.volume = 1;
    speechSynthesis.speak(msg);
  };

  const speakAllLanguages = (medicines, time) => {
    const medList = medicines.join(", ");

    // English
    speak(
      `It is time to take your medicines. ${medList}. Time ${time}`,
      "en-IN"
    );

    // Hindi
    speak(
      `दवा लेने का समय हो गया है। दवाइयाँ हैं ${medList}`,
      "hi-IN"
    );

    // Telugu (works if voice exists in browser)
    speak(
      `ఇప్పుడు మందులు తీసుకునే సమయం వచ్చింది. మందులు: ${medList}`,
      "te-IN"
    );
  };

  /* ===============================
     START ALARM (REPEAT)
  =============================== */
  const startAlarm = (medicineNames, time) => {
    if (alarmInterval.current) return;

    setActiveAlert({
      medicines: medicineNames,
      time,
    });

    speakAllLanguages(medicineNames, time);

    alarmInterval.current = setInterval(() => {
      speakAllLanguages(medicineNames, time);
    }, 15000); // every 15 sec
  };

  const stopAlarm = () => {
    clearInterval(alarmInterval.current);
    alarmInterval.current = null;
    speechSynthesis.cancel();
    setActiveAlert(null);
  };

  /* ===============================
     SMART REMINDER ENGINE
  =============================== */
  const startReminderEngine = (medicines, createdAt) => {
    engineInterval.current = setInterval(() => {
      const now = new Date();

      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const daysPassed = Math.floor(
        (now - new Date(createdAt)) / (1000 * 60 * 60 * 24)
      );

      const medicinesNow = medicines.filter((med) => {
        const [time, ampm] = med.time.split(" ");
        let [hour, minute] = time.split(":");

        hour = parseInt(hour);
        minute = parseInt(minute);

        if (ampm === "PM" && hour !== 12) hour += 12;
        if (ampm === "AM" && hour === 12) hour = 0;

        return (
          daysPassed < med.duration &&
          hour === currentHour &&
          minute === currentMinute
        );
      });

      if (medicinesNow.length > 0) {
        startAlarm(
          medicinesNow.map((m) => m.name),
          medicinesNow[0].time
        );
      }
    }, 30000); // check every 30 sec
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

        startReminderEngine(
          data.medicines,
          data.createdAt
        );
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
              <b>{m.name}</b> — {m.time} — {m.duration} days
            </p>
          ))}
        </>
      )}

      {/* 🔔 ALERT PANEL */}
      {activeAlert && (
        <div
          style={{
            background: "#ffd6d6",
            padding: 30,
            marginTop: 40,
            borderRadius: 15,
          }}
        >
          <h2>💊 MEDICATION ALERT</h2>

          <p><b>Time:</b> {activeAlert.time}</p>

          <ul style={{ fontSize: 20 }}>
            {activeAlert.medicines.map((med, i) => (
              <li key={i}>{med}</li>
            ))}
          </ul>

          <button
            onClick={stopAlarm}
            style={{
              padding: 14,
              fontSize: 18,
              background: "red",
              color: "white",
              border: "none",
              borderRadius: 8,
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
