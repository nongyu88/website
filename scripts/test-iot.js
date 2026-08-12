// test-iot.js
async function runDualSimulator() {
  console.log("🚀 Starting Kraftgene Dual Telemetry Streamer (Grid + Pipeline)...");

  setInterval(async () => {
    // Randomly switch between Power Grid & Pipeline Telemetry
    const isGrid = Math.random() < 0.5;

    let payload = {};

    if (isGrid) {
      const isSag = Math.random() < 0.2; // 20% chance of voltage sag
      payload = {
        sensorId: "SUBSTATION-ALPHA-9",
        domain: "grid",
        voltage: isSag ? 102.4 : 120.1, // kV
        frequency: isSag ? 58.8 : 60.0, // Hz
        temp: 42.1
      };
    } else {
      const isSurge = Math.random() < 0.2; // 20% chance of pressure surge
      payload = {
        sensorId: "VALVE-NODE-47",
        domain: "pipeline",
        pressure: isSurge ? 1680 : 1240, // PSI
        temp: 38.5,
        strain: 0.014
      };
    }

    try {
      const res = await fetch("http://localhost:3000/api/telemetry/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log(`[${new Date().toLocaleTimeString()}] Logged ${payload.domain.toUpperCase()} Stream (${payload.sensorId}):`, data.status);
    } catch (err) {
      console.error("❌ Ingestion ping failed. Ensure Next.js is running.");
    }
  }, 2500);
}

runDualSimulator();