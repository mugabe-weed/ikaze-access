import React, { useState } from "react";
import { AccessiblePlace } from "../types";
import { MOCK_PLACES } from "../mockData";
import { MapPin, Star, Sparkles, Navigation, Plus, Check, CheckCircle2, ShieldAlert } from "lucide-react";

export function AccessibleMap() {
  const [places, setPlaces] = useState<AccessiblePlace[]>(MOCK_PLACES);
  const [selectedPlace, setSelectedPlace] = useState<AccessiblePlace>(MOCK_PLACES[0]);

  // Form states for creating a new Kigali location review
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<AccessiblePlace["category"]>("Restaurant");
  const [newLocation, setNewLocation] = useState("");
  const [newScore, setNewScore] = useState(5);
  const [hasRamps, setHasRamps] = useState(false);
  const [hasToilets, setHasToilets] = useState(false);
  const [hasPaving, setHasPaving] = useState(false);
  const [hasElevator, setHasElevator] = useState(false);
  const [hasStaff, setHasStaff] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newLocation.trim() || !reviewMessage.trim()) {
      alert("Please specify the building name, address, and write a helpful verification review.");
      return;
    }

    const newPlaceItem: AccessiblePlace = {
      id: "place-" + Date.now().toString(),
      name: newName,
      category: newCategory,
      locationDescription: newLocation,
      lat: -1.94 + Math.random() * 0.05, // simulated Kigali coordinates
      lng: 30.05 + Math.random() * 0.05,
      accessibilityScore: newScore,
      hasRamps,
      hasAccessibleToilets: hasToilets,
      hasTactilePaving: hasPaving,
      hasElevator,
      hasSignLanguageStaff: hasStaff,
      reviews: [
        {
          user: "Anonymous Seeker",
          rating: newScore,
          text: reviewMessage,
          date: new Date().toISOString().split("T")[0]
        }
      ]
    };

    setPlaces(prev => [...prev, newPlaceItem]);
    setSelectedPlace(newPlaceItem);

    // Reset fields
    setNewName("");
    setNewLocation("");
    setReviewMessage("");
    setHasRamps(false);
    setHasToilets(false);
    setHasPaving(false);
    setHasElevator(false);
    setHasStaff(false);

    setSuccessInfo("Mined Location Successfully! Verification checklist uploaded to regional directory map.");
    setTimeout(() => {
      setSuccessInfo(null);
    }, 4000);
  };

  const getScoreStars = (score: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`w-3.5 h-3.5 ${i < score ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
        <h3 className="text-base font-bold text-white tracking-tight mb-2 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-cyan-400" />
          Kigali Accessibility Crowdsourced Map Portal
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Like a decentralised Google Maps specifically auditing barrier-free access. Local wheelchair users, blind individuals and caretakers verify physical buildings, hospitals, and transit hubs across Rwanda. Submitting verified scorecards helps keep Kigali physically inclusive.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Physical records list */}
        <div className="lg:col-span-4 flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-1">Registered Locations ({places.length})</span>
          {places.map((p) => {
            const isSelected = selectedPlace.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlace(p)}
                className={`p-4.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-slate-800 border-cyan-500/60 text-white" 
                    : "bg-slate-900/50 border-slate-805 text-slate-400 hover:bg-slate-800/30"
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <p className="font-bold text-sm tracking-tight">{p.name}</p>
                  <MapPin className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? "text-cyan-400" : "text-slate-600"}`} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase bg-slate-950 px-2 py-0.5 rounded text-cyan-400">
                    {p.category}
                  </span>
                  <div className="flex items-center">
                    {getScoreStars(p.accessibilityScore)}
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 font-mono italic flex items-center gap-1">
                  Coords: {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Building Details Display */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-400 px-2.5 py-1 rounded-full">
                {selectedPlace.category}
              </span>
              <h4 className="text-lg font-bold text-white mt-2 leading-snug">{selectedPlace.name}</h4>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {selectedPlace.locationDescription}
              </p>
            </div>

            {/* Accessibility Checklist features */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Accessibility Scorecard</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Wheelchair Ramps", key: "hasRamps" as keyof AccessiblePlace, desc: "Accessible doors" },
                  { label: "Accessible Toilets", key: "hasAccessibleToilets" as keyof AccessiblePlace, desc: "Sinks & Rails" },
                  { label: "Tactile Blind Lanes", key: "hasTactilePaving" as keyof AccessiblePlace, desc: "Floor beacons" },
                  { label: "Elevators fitted", key: "hasElevator" as keyof AccessiblePlace, desc: "With Braille audio" },
                  { label: "Sign Staff Duty", key: "hasSignLanguageStaff" as keyof AccessiblePlace, desc: "Trained interpreters" }
                ].map((feat) => {
                  const status = selectedPlace[feat.key] as boolean;
                  return (
                    <div 
                      key={feat.label}
                      className={`p-2 rounded-lg border flex flex-col justify-between ${
                        status 
                          ? "bg-teal-950/25 border-teal-800/40 text-teal-300" 
                          : "bg-slate-950/45 border-slate-805 text-slate-500"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${status ? "bg-teal-400 animate-pulse" : "bg-slate-700"}`} />
                        <span className="text-[11px] font-medium">{feat.label}</span>
                      </div>
                      <span className="text-[9px] font-mono opacity-65 leading-none mt-1">{feat.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews list */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block">User Verification Reviews</span>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {selectedPlace.reviews.map((r, i) => (
                  <div key={i} className="p-3 bg-slate-950/60 border border-slate-805 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold text-slate-300">{r.user}</p>
                      <p className="text-[9px] font-mono text-slate-500">{r.date}</p>
                    </div>
                    <p className="text-xs text-slate-450 leading-relaxed italic">"{r.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between text-xs text-slate-500">
            <span className="font-mono text-[10px]">VERIFIED RATINGS: {selectedPlace.accessibilityScore}/5</span>
            <span className="flex items-center gap-1 font-semibold text-cyan-400">
              <Navigation className="w-3.5 h-3.5 fill-current" /> Kigali, RW
            </span>
          </div>
        </div>

        {/* Crowdsource Submission Form */}
        <div className="lg:col-span-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="border-b border-slate-800 pb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white">Mine New Kigali Verification</h4>
            </div>

            {successInfo && (
              <div className="p-3 bg-teal-950/80 border border-teal-850 text-teal-300 rounded-xl text-xs flex gap-1.5 items-center">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{successInfo}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="bul-name" className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Building/Shop Name</label>
              <input
                id="bul-name"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Kigali Convention Centre"
                className="bg-slate-950 border border-slate-800 focus:border-cyan-500 px-3 py-1.5 rounded-lg text-white text-xs outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="cat-place" className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                <select
                  id="cat-place"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-white text-xs outline-none"
                >
                  <option>Restaurant</option>
                  <option>Hospital</option>
                  <option>School</option>
                  <option>Government Building</option>
                  <option>Bank</option>
                  <option>Public Transit Hub</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="add-place" className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Address Location</label>
                <input
                  id="add-place"
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. KG 5 Ave, Gishushu"
                  className="bg-slate-950 border border-slate-800 focus:border-cyan-500 px-3 py-1.5 rounded-lg text-white text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Audit Features Present</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "♿ Ramps", active: hasRamps, set: setHasRamps },
                  { label: "🚽 Disabled Toilets", active: hasToilets, set: setHasToilets },
                  { label: "🚶 Tactile floor pave", active: hasPaving, set: setHasPaving },
                  { label: "🛗 Braille Elevators", active: hasElevator, set: setHasElevator },
                  { label: "💬 Sign Interpreters", active: hasStaff, set: setHasStaff }
                ].map((cb, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => cb.set(!cb.active)}
                    className={`p-1.5 px-2.5 rounded-lg border text-left text-[11px] font-medium transition-colors flex items-center justify-between cursor-pointer ${
                      cb.active 
                        ? "bg-teal-950/40 border-teal-500/50 text-teal-300" 
                        : "bg-slate-950/70 border-slate-805 text-slate-500 hover:bg-slate-950"
                    }`}
                  >
                    <span>{cb.label}</span>
                    {cb.active && <Check className="w-3 h-3 text-teal-400" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="score-place" className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Overall Accessibility Score (1-5)</label>
              <input
                id="score-place"
                type="number"
                min="1"
                max="5"
                value={newScore}
                onChange={(e) => setNewScore(parseInt(e.target.value) || 5)}
                className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-white text-xs outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="desc-place" className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Verification Review Write-up</label>
              <textarea
                id="desc-place"
                value={reviewMessage}
                onChange={(e) => setReviewMessage(e.target.value)}
                placeholder="Describe your lived experience here. Were the doors wide? Are checkout pathways flat?..."
                rows={3}
                className="bg-slate-950 border border-slate-800 focus:border-cyan-500 px-3 py-1.5 rounded-lg text-white text-xs outline-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-555 hover:to-cyan-555 text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer"
            >
              Submit crowdsourced verification
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
