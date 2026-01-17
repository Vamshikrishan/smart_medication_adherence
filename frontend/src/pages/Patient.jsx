import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

function Patient() {
  const [prescriptionId, setPrescriptionId] = useState("");
  const [prescription, setPrescription] = useState(null);
  const [activeReminder, setActiveReminder] = useState(null);

  const qrCodeRef = useRef(null);
  const isScanningRef = useRef(false);
  const voiceIntervalRef = useRef(null);

  /* ===============================
     FETCH PRESCRIPTION
     =============================== */
  const fetchPrescription = async (id) => {
    const response = await fetch(
      `https://super-fishstick-7vp6w55xjrx3r6r9-5000.app.github.dev/api/prescriptions/${id}`
    );

    const data = await response.json();
    setPrescription(data);
    return data;
  };

  /* ===============================
     MULTI LANGUAGE VOICE
     =============================== */
  const speakReminder = (medicine, time) => {
    speechSynthesis.cancel();

    const english = `It is time to take your ${time} medicine ${medicine}`;
    const hindi =
      `अब ${time === "Morning" ? "सुबह" : time === "Afternoon" ? "दोपहर" : "रात"} की दवा लेने का समय हो गया है। कृपया ${medicine} लें।`;
    const telugu =
      `ఇప్పుడు మీ ${time} మందు తీసుకునే సమయం అయ్యింది. దయచేసి ${medicine} తీసుకోండి.`;

    const messages = [
      new SpeechSynthesisUtterance(english),
      new SpeechSynthesisUtterance(hindi),
      new SpeechSynthesisUtterance(telugu),
    ];

    messages.forEach((msg) => {
      msg.rate = 0.9;
      speechSynthesis.speak(msg);
    });
  };

  /* ===============================
     START REMINDER
     =============================== */
  const startReminder = (med) => {
    setActiveReminder(med);

    // 🔔 Browser notification
    if (Notification.permission === "granted") {
      new Notification("💊 Medication Reminder", {
        body: `Time to take your ${med.time} medicine: ${med.name}`,
      });
    }

    // 🔊 Repeat voice every 15 seconds
    speakReminder(med.name, med.time);

    voiceIntervalRef.current = setInterval(() => {
      speakReminder(med.name, med.time);
    }, 15000);
  };

  /* ===============================
     STOP REMINDER
     =============================== */
  const stopReminder = () => {
    clearInterval(voiceIntervalRef.current);
    speechSynthesis.cancel();
    setActiveReminder(null);
  };

  /* ===============================
     SCHEDULE REMINDERS
     =============================== */
  const scheduleReminders = (medicines) => {
    medicines.forEach((med, index) => {
      const delay = 5000 + index * 3000; // test delay

      setTimeout(() => {
        startReminder(med);
      }, delay);
    });
  };

  /* ===============================
     NOTIFICATION PERMISSION
     =============================== */
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  /* ===============================
     QR SCANNER
     =============================== */
  useEffect(() => {
    if (isScanningRef.current) return;
    isScanningRef.current = true;

    const html5QrCode = new Html5Qrcode("qr-reader");
    qrCodeRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decodedText) => {
        await html5QrCode.stop();
        await html5QrCode.clear();

        setPrescriptionId(decodedText);

        const data = await fetchPrescription(decodedText);
        scheduleReminders(data.medicines);
      }
    );

    return () => {
      if (qrCodeRef.current) {
        qrCodeRef.current.stop().catch(() => {});
        qrCodeRef.current.clear().catch(() => {});
      }
    };
  }, []);

  /* ===============================
     UI
     =============================== */
  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h2>Patient Portal</h2>
      <p>Scan the QR code provided by the pharmacy</p>

      <div id="qr-reader" style={{ width: "300px", margin: "0 auto" }} />

      {prescriptionId && (
        <p>
          <strong>Prescription ID:</strong> {prescriptionId}
        </p>
      )}

      {prescription && (
        <>
          <h3>Medicines</h3>
          {prescription.medicines.map((med, i) => (
            <p key={i}>
              <strong>{med.name}</strong> — {med.time} —{" "}
              {med.timesPerDay} times/day for {med.duration} days
            </p>
          ))}
        </>
      )}

      {/* 🔴 ALERT BOX */}
      {activeReminder && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#ffe6e6",
            border: "2px solid red",
            borderRadius: "10px",
          }}
        >
          <h2>⏰ Medication Alert</h2>

          <p>
            <strong>{activeReminder.time} Medicine Time</strong>
          </p>

          <p>
            Medicine: <strong>{activeReminder.name}</strong>
          </p>

          <button
            onClick={stopReminder}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
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
