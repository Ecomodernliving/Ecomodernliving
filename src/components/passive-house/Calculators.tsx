"use client";

import { useState } from "react";

type CalcResult = { label: string; value: string; detail?: string };

function ResultCard({ results }: { results: CalcResult[] }) {
  if (!results.length) return null;
  return (
    <div className="mt-4 space-y-2 rounded-xl border border-forest-200 bg-forest-50/50 p-4">
      {results.map((r) => (
        <div key={r.label} className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
          <span className="text-sm font-medium text-forest-800">{r.label}</span>
          <span className="text-sm text-forest-700">{r.value}</span>
          {r.detail && <span className="text-xs text-forest-500 sm:col-span-2">{r.detail}</span>}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  unit,
  step = "any",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  unit?: string;
  step?: string;
}) {
  return (
    <label htmlFor={id} className="block text-sm">
      <span className="font-medium text-forest-800">{label}</span>
      <div className="mt-1 flex items-center gap-2">
        <input
          id={id}
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-forest-200 px-3 py-2 text-sm focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
        />
        {unit && <span className="shrink-0 text-xs text-forest-500">{unit}</span>}
      </div>
    </label>
  );
}

export function HeatLossCalculator() {
  const [area, setArea] = useState("2000");
  const [uValue, setUValue] = useState("0.025");
  const [deltaT, setDeltaT] = useState("38");
  const [results, setResults] = useState<CalcResult[]>([]);

  function calculate() {
    const a = parseFloat(area);
    const u = parseFloat(uValue);
    const dt = parseFloat(deltaT);
    if (!a || !u || !dt) return;
    const peakBtu = a * u * dt;
    setResults([
      { label: "Peak transmission loss", value: `${peakBtu.toLocaleString(undefined, { maximumFractionDigits: 0 })} Btu/hr` },
      { label: "Per square foot", value: `${(peakBtu / a).toFixed(2)} Btu/(hr·ft²)` },
      { label: "Passive House load target", value: "≤ 3.17 Btu/(hr·ft²)", detail: "Compare your per-ft² result to the certification peak heat load limit." },
    ]);
  }

  return (
    <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-forest-900">Heat Loss Estimator</h3>
      <p className="mt-1 text-sm text-forest-600">Simplified peak transmission: P = A × U × ΔT</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Envelope area" id="hl-area" value={area} onChange={setArea} unit="ft²" />
        <Field label="U-value" id="hl-u" value={uValue} onChange={setUValue} unit="Btu/(hr·ft²·°F)" step="0.001" />
        <Field label="Temperature difference" id="hl-dt" value={deltaT} onChange={setDeltaT} unit="°F" />
      </div>
      <button type="button" onClick={calculate} className="mt-4 min-h-11 rounded-lg bg-forest-700 px-5 py-3 text-sm font-medium text-white hover:bg-forest-800">
        Calculate
      </button>
      <ResultCard results={results} />
    </div>
  );
}

export function InsulationCalculator() {
  const [rPerInch, setRPerInch] = useState("3.5");
  const [thickness, setThickness] = useState("12");
  const [results, setResults] = useState<CalcResult[]>([]);

  function calculate() {
    const r = parseFloat(rPerInch) * parseFloat(thickness);
    if (!r) return;
    setResults([
      { label: "Total R-value", value: `${r.toFixed(1)} hr·ft²·°F/Btu` },
      { label: "U-value", value: `${(1 / r).toFixed(4)} Btu/(hr·ft²·°F)` },
    ]);
  }

  return (
    <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-forest-900">Insulation R-Value</h3>
      <p className="mt-1 text-sm text-forest-600">R = thickness × R-per-inch (simplified, excludes films)</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="R per inch" id="ins-r" value={rPerInch} onChange={setRPerInch} unit="hr·ft²·°F/Btu·in" step="0.1" />
        <Field label="Thickness" id="ins-t" value={thickness} onChange={setThickness} unit="inches" />
      </div>
      <button type="button" onClick={calculate} className="mt-4 min-h-11 rounded-lg bg-forest-700 px-5 py-3 text-sm font-medium text-white hover:bg-forest-800">
        Calculate
      </button>
      <ResultCard results={results} />
    </div>
  );
}

export function AirtightnessCalculator() {
  const [cfm, setCfm] = useState("400");
  const [volume, setVolume] = useState("16000");
  const [results, setResults] = useState<CalcResult[]>([]);

  function calculate() {
    const v50 = parseFloat(cfm);
    const vn50 = parseFloat(volume);
    if (!v50 || !vn50) return;
    const n50 = (v50 * 60) / vn50;
    const pass = n50 <= 0.6;
    setResults([
      { label: "n50 (ACH @ 50 Pa)", value: `${n50.toFixed(2)} 1/h` },
      { label: "Passive House target", value: "≤ 0.6 1/h" },
      { label: "Status", value: pass ? "✓ Meets target" : "✗ Above target — improve air sealing", detail: "Formula: n50 = (CFM × 60) / Vn50" },
    ]);
  }

  return (
    <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-forest-900">ACH50 (n50) Calculator</h3>
      <p className="mt-1 text-sm text-forest-600">From blower door test results at 50 Pascals</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Fan flow at 50 Pa" id="ach-cfm" value={cfm} onChange={setCfm} unit="CFM" />
        <Field label="Test volume (Vn50)" id="ach-vol" value={volume} onChange={setVolume} unit="ft³" />
      </div>
      <button type="button" onClick={calculate} className="mt-4 min-h-11 rounded-lg bg-forest-700 px-5 py-3 text-sm font-medium text-white hover:bg-forest-800">
        Calculate
      </button>
      <ResultCard results={results} />
    </div>
  );
}

export function EnergySavingsCalculator() {
  const [tfa, setTfa] = useState("2000");
  const [currentEui, setCurrentEui] = useState("50");
  const [phEui, setPhEui] = useState("4.75");
  const [rate, setRate] = useState("0.12");
  const [results, setResults] = useState<CalcResult[]>([]);

  function calculate() {
    const area = parseFloat(tfa);
    const cur = parseFloat(currentEui);
    const ph = parseFloat(phEui);
    const price = parseFloat(rate);
    if (!area || !cur || !ph || !price) return;
    const savedKbtu = area * (cur - ph);
    const savedKwh = savedKbtu / 3.412;
    const annual = savedKwh * price;
    setResults([
      { label: "Annual energy saved", value: `${savedKbtu.toLocaleString()} kBtu/yr` },
      { label: "Estimated cost savings", value: `$${annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr` },
      { label: "10-year savings", value: `$${(annual * 10).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, detail: "Simplified estimate at constant energy rates." },
    ]);
  }

  return (
    <div className="rounded-2xl border border-forest-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-forest-900">Energy Savings vs Passive House</h3>
      <p className="mt-1 text-sm text-forest-600">Compare current heating intensity to Passive House target</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Floor area" id="es-area" value={tfa} onChange={setTfa} unit="ft²" />
        <Field label="Current heating EUI" id="es-cur" value={currentEui} onChange={setCurrentEui} unit="kBtu/(ft²·yr)" />
        <Field label="Target EUI" id="es-ph" value={phEui} onChange={setPhEui} unit="kBtu/(ft²·yr)" />
        <Field label="Energy rate" id="es-rate" value={rate} onChange={setRate} unit="$/kWh" step="0.01" />
      </div>
      <button type="button" onClick={calculate} className="mt-4 min-h-11 rounded-lg bg-forest-700 px-5 py-3 text-sm font-medium text-white hover:bg-forest-800">
        Calculate
      </button>
      <ResultCard results={results} />
    </div>
  );
}

export function PassiveHouseCalculators() {
  return (
    <div className="space-y-8">
      <HeatLossCalculator />
      <InsulationCalculator />
      <AirtightnessCalculator />
      <EnergySavingsCalculator />
    </div>
  );
}
