
import React, { useEffect, useState } from "react";
const TAGS = ["KYC", "VPN", "Faucet", "Survey", "US", "Non-US"];
export default function App() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({ title: "", url: "", tags: [] });

  const loadPromos = async () => {
    const res = await fetch("/api/promos");
    const data = await res.json();
    setPromos(data);
  };

  const submitPromo = async () => {
    await fetch("/api/promos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", url: "", tags: [] });
    loadPromos();
  };

  useEffect(() => { loadPromos(); }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">🎯 GambleCodez Promos</h1>
      <input className="border p-2 w-full mb-2" placeholder="Promo Title" value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <input className="border p-2 w-full mb-2" placeholder="Promo Link" value={form.url}
        onChange={(e) => setForm({ ...form, url: e.target.value })} />
      <div className="flex flex-wrap gap-2 mb-2">
        {TAGS.map(tag => (
          <label key={tag}><input type="checkbox" checked={form.tags.includes(tag)}
            onChange={() => {
              const tags = form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag];
              setForm({ ...form, tags });
            }} /> {tag}
          </label>
        ))}
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={submitPromo}>Add Promo</button>
      <div className="mt-6 grid gap-4">
        {promos.map((p, i) => (
          <div key={i} className="border p-4 bg-white rounded shadow">
            <a href={p.url} target="_blank" className="text-blue-600 font-semibold">{p.title}</a>
            <div className="mt-2 flex flex-wrap gap-2">{(p.tags || []).map((tag, i) => (
              <span key={i} className="bg-gray-200 text-xs px-2 py-1 rounded">{tag}</span>
            ))}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
