// test-iot.js
async function runSimulator() {
    console.log("🚀 Starting Pipeline IoT Sensor Simulator (Pinging every 2s)...");
  
    setInterval(async () => {
      const isAnomaly = Math.random() < 0.2; // 20% chance of high pressure spike
      const pressure = isAnomaly ? 1650 : 1200 + Math.floor(Math.random() * 200);
  
      try {
        const res = await fetch("http://localhost:3000/api/telemetry/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            sensorId: "NODE-PIPELINE-01", 
            pressure, 
            temp: 45.2, 
            strain: 0.012 
          })
        });
        const data = await res.json();
        console.log(`[${new Date().toLocaleTimeString()}] Logged IoT Stream:`, data.status);
      } catch (err) {
        console.error("❌ Connection failed. Ensure your Next.js server is running on http://localhost:3000");
      }
    }, 2000);
  }
  
  runSimulator();