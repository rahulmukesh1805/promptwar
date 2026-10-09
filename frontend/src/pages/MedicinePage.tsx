import React, { useState, useEffect } from 'react';
import {
  Pill,
  Search,
  ShieldAlert,
  AlertTriangle,
  Info,
  Clock,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { MedicineDetail, MedicineSafetyCheckResponse } from '../types';
import { apiClient } from '../services/api';
import { MedicalSafetyNotice } from '../components/MedicalSafetyNotice';

export const MedicinePage: React.FC = () => {
  const [medicines, setMedicines] = useState<MedicineDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMed, setSelectedMed] = useState<MedicineDetail | null>(null);

  // Combination Safety Checker state
  const [selectedForCheck, setSelectedForCheck] = useState<string[]>(['dolo_650', 'coldact']);
  const [checkResult, setCheckResult] = useState<MedicineSafetyCheckResponse | null>(null);
  const [isCheckingSafety, setIsCheckingSafety] = useState<boolean>(false);

  useEffect(() => {
    loadMedicines();
  }, [searchQuery]);

  useEffect(() => {
    runSafetyCheck();
  }, [selectedForCheck]);

  const loadMedicines = async () => {
    const data = await apiClient.getMedicines(searchQuery);
    setMedicines(data);
    if (!selectedMed && data.length > 0) {
      setSelectedMed(data[0]);
    }
  };

  const runSafetyCheck = async () => {
    if (selectedForCheck.length < 2) {
      setCheckResult(null);
      return;
    }
    setIsCheckingSafety(true);
    const res = await apiClient.checkMedicineSafety(selectedForCheck);
    setCheckResult(res);
    setIsCheckingSafety(false);
  };

  const toggleSelectForCheck = (medId: string) => {
    setSelectedForCheck((prev) => {
      if (prev.includes(medId)) {
        return prev.filter((id) => id !== medId);
      }
      if (prev.length >= 2) {
        return [prev[1], medId];
      }
      return [...prev, medId];
    });
  };

  const categories = [
    'All',
    'Pain Relief & Antipyretic',
    'Multi-Symptom Cold & Congestion',
    'Combination Anti-Inflammatory & Pain Relief',
    'Blood Sugar Management / Biguanide',
    'Antibacterial / Penicillin Class',
    'Lipid Regulator / Statin',
    'Acid Reducer / Proton Pump Inhibitor',
    'Antihistamine / Allergy Relief',
    'Blood Pressure Regulator / Calcium Channel Blocker',
  ];

  const filteredMedicines =
    selectedCategory === 'All'
      ? medicines
      : medicines.filter((m) => m.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 pb-20 pt-4">
      {/* Title */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
          <Pill className="w-3.5 h-3.5 text-emerald-600" />
          Medication Educational Directory
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Medicine Information
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Understand general uses, side effects, and precautions of common medicines.
        </p>
      </div>

      {/* Safety Notice */}
      <MedicalSafetyNotice />

      {/* VALUE ADD FEATURE: DUPLICATE INGREDIENT & INTERACTION CHECKER */}
      <div className="bg-gradient-to-br from-amber-50/80 via-white to-teal-50/50 rounded-3xl border-2 border-amber-300 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200/80 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500 text-white rounded-lg">
                <Zap className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                Duplicate Ingredient & Overdose Safety Checker
              </h3>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Select 2 medications to check if they hide duplicate active ingredients (such as hidden Paracetamol/Acetaminophen in cold syrups).
            </p>
          </div>

          {/* Quick Test Scenario Chips */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedForCheck(['dolo_650', 'coldact'])}
              className="text-[11px] px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold transition-colors cursor-pointer"
            >
              Test: Dolo-650 + Coldact
            </button>
            <button
              onClick={() => setSelectedForCheck(['combiflam', 'paracetamol'])}
              className="text-[11px] px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold transition-colors cursor-pointer"
            >
              Test: Combiflam + Crocin
            </button>
            <button
              onClick={() => setSelectedForCheck(['metformin', 'amoxicillin'])}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Test: Metformin + Amoxicillin
            </button>
          </div>
        </div>

        {/* Selected Checker Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Checking:</span>
          {medicines.map((m) => {
            const isChecked = selectedForCheck.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleSelectForCheck(m.id)}
                className={`px-3 py-1 rounded-xl font-medium transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-amber-600 text-white font-bold shadow-2xs ring-2 ring-amber-300'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isChecked ? '✓ ' : '+ '}
                {m.name.split('(')[0]}
              </button>
            );
          })}
        </div>

        {/* Safety Result Display */}
        {checkResult && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed transition-all ${
              checkResult.has_conflict
                ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-xs'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {checkResult.has_conflict ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              )}
              <span className="text-sm sm:text-base">{checkResult.title}</span>
            </div>
            <p className="mt-1">{checkResult.description}</p>
            <div className="mt-2.5 pt-2 border-t border-current/20 text-xs font-semibold">
              <strong>Recommendation:</strong> {checkResult.safety_recommendation}
            </div>
          </div>
        )}
      </div>

      {/* Search Bar & Category Filters */}
      <div className="space-y-3">
        <div className="relative max-w-2xl mx-auto">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search a medicine... (e.g., Paracetamol, Dolo, Metformin, Amoxicillin)"
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm sm:text-base shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-xl font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-2xs font-bold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: List and Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List Column */}
        <div className="lg:col-span-5 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block px-1">
            Medicines ({filteredMedicines.length})
          </span>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredMedicines.map((med) => {
              const isSelected = selectedMed?.id === med.id;
              return (
                <div
                  key={med.id}
                  onClick={() => setSelectedMed(med)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 shadow-xs ring-1 ring-teal-500/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900">{med.name}</h3>
                    <span className="text-[10px] uppercase font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {med.category.split('/')[0]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{med.generic_name}</p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-1">
                    {med.common_uses[0]}
                  </p>
                </div>
              );
            })}

            {filteredMedicines.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No medicines found matching "{searchQuery}".
              </div>
            )}
          </div>
        </div>

        {/* Right Detail Card */}
        <div className="lg:col-span-7">
          {selectedMed ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {selectedMed.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Educational Reference</span>
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {selectedMed.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Generic Compound: {selectedMed.generic_name}
                </p>
              </div>

              {/* 1. Common Uses */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                  <HeartPulse className="w-4 h-4" /> Common Uses
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc pl-5">
                  {selectedMed.common_uses.map((use, i) => (
                    <li key={i}>{use}</li>
                  ))}
                </ul>
              </div>

              {/* 2. General Precautions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sky-600" /> General Precautions
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc pl-5">
                  {selectedMed.general_precautions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* 3. Common Side Effects */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" /> Common Side Effects
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc pl-5">
                  {selectedMed.common_side_effects.map((se, i) => (
                    <li key={i}>{se}</li>
                  ))}
                </ul>
              </div>

              {/* 4. Important Warnings */}
              <div className="space-y-2 bg-rose-50/70 border border-rose-200 p-4 rounded-2xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> Important Warnings
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-rose-900 list-disc pl-5 font-medium">
                  {selectedMed.important_warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>

              {/* 5. When to Consult a Doctor */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> When to Consult a Healthcare Professional
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc pl-5">
                  {selectedMed.when_to_consult_doctor.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* Required Educational Disclaimer */}
              <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl">
                <strong>Important Policy:</strong> {selectedMed.educational_disclaimer} HealthBridge does not prescribe
                medicines or suggest individualized dosages.
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              Select a medicine to view comprehensive educational guidelines.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
