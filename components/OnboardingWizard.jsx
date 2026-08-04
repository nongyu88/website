"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingWizard() {
  // Tracks which step of the wizard the user is on (1, 2, or 3)
  const [step, setStep] = useState(1);
  
  // Stores the user's answers
  const [preferences, setPreferences] = useState({
    industry: '',
    region: '',
    alertFocus: []
  });

  // Helper function to toggle checkboxes in Step 3
  const toggleAlert = (alertType) => {
    setPreferences((prev) => {
      const currentAlerts = prev.alertFocus;
      if (currentAlerts.includes(alertType)) {
        // If it's already selected, remove it
        return { ...prev, alertFocus: currentAlerts.filter(a => a !== alertType) };
      } else {
        // If it's not selected, add it
        return { ...prev, alertFocus: [...currentAlerts, alertType] };
      }
    });
  };

  const router = useRouter();

  const handleFinish = async () => {
    try {
      // Get the currently logged-in user from local storage to get their real email
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const userEmail = storedUser.email || "test@test.com";

      const response = await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail, 
          industry: preferences.industry,
          region: preferences.region,
          alertFocus: preferences.alertFocus,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // IMPORTANT: Update local storage with the new user object returned from the API
        const updatedUser = { ...storedUser, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Force a hard reload of the dashboard to re-run the state checks
        window.location.href = '/dashboard';
      } else {
        alert("Failed to save preferences. Please try again.");
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white flex items-center justify-center p-4 font-sans">
      <div className="bg-[#111827] border border-gray-800 rounded-xl p-8 max-w-2xl w-full shadow-2xl">
        
        {/* Progress Indicator */}
        <div className="mb-8 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Step {step} of 3
          </span>
          <div className="flex space-x-2">
            <div className={`h-1 w-8 rounded ${step >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
            <div className={`h-1 w-8 rounded ${step >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
            <div className={`h-1 w-8 rounded ${step >= 3 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
          </div>
        </div>

        {/* STEP 1: INDUSTRY SELECTION */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-2">What infrastructure are you managing?</h2>
            <p className="text-gray-400 mb-8">This will customize your default operational twin.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  setPreferences({ ...preferences, industry: 'grid' });
                  setStep(2);
                }}
                className="p-6 border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/20 rounded-lg text-left transition-all duration-200"
              >
                <div className="text-emerald-400 text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-white mb-2">Power Grids</h3>
                <p className="text-sm text-gray-400">Topology simulation, cascading failures, and weather fusion.</p>
              </button>

              <button 
                onClick={() => {
                  setPreferences({ ...preferences, industry: 'pipeline' });
                  setStep(2);
                }}
                className="p-6 border border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/20 rounded-lg text-left transition-all duration-200"
              >
                <div className="text-blue-400 text-4xl mb-4">💧</div>
                <h3 className="text-xl font-bold text-white mb-2">Oil & Gas Pipelines</h3>
                <p className="text-sm text-gray-400">Fluid dynamics, thermal isolation, and UAV drone ingestion.</p>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: REGION SELECTION */}
        {step === 2 && (
          <div>
            <h2 className="text-3xl font-bold mb-2">Select your primary region</h2>
            <p className="text-gray-400 mb-8">This determines the default camera position in your 3D viewer.</p>
            
            <select 
              value={preferences.region}
              onChange={(e) => setPreferences({ ...preferences, region: e.target.value })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500 mb-8"
            >
              <option value="" disabled>Select a region...</option>
              <option value="north_america">North America</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia-Pacific</option>
              <option value="global">Global (Zoomed out)</option>
            </select>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="px-6 py-2 text-gray-400 hover:text-white">Back</button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!preferences.region}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white font-semibold transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ALERT PREFERENCES */}
        {step === 3 && (
          <div>
            <h2 className="text-3xl font-bold mb-2">What alerts matter most to you?</h2>
            <p className="text-gray-400 mb-8">Select all that apply. We'll highlight these anomalies.</p>
            
            <div className="space-y-3 mb-8">
              {['Severe Weather', 'Thermal / Fire Anomalies', 'Structural Cascades', 'UAV Encroachment'].map((alert) => (
                <label key={alert} className="flex items-center p-4 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={preferences.alertFocus.includes(alert)}
                    onChange={() => toggleAlert(alert)}
                    className="w-5 h-5 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="ml-4 font-medium text-gray-200">{alert}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="px-6 py-2 text-gray-400 hover:text-white">Back</button>
              <button 
                onClick={handleFinish} 
                className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-white font-bold transition-colors shadow-lg shadow-emerald-500/20"
              >
                Launch Portal
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}