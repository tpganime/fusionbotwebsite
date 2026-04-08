"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ServerConfig({ params }: { params: { guildId: string } }) {
  const router = useRouter();
  const [config, setConfig] = useState<any>(null);
  const [nukeStatus, setNukeStatus] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://th-us1.terohost.com:25626";

  useEffect(() => {
    const sessionId = localStorage.getItem("fusion_session");
    if (!sessionId) return router.push("/");
    fetch(`${API_URL}/dash/api/server/${params.guildId}/config`, { headers: { "x-session-id": sessionId } }).then(res => res.json()).then(data => setConfig(data));
    fetch(`${API_URL}/dash/api/server/${params.guildId}/nuke-backup`, { headers: { "x-session-id": sessionId } }).then(res => res.json()).then(data => setNukeStatus(data));
  }, [params.guildId, router, API_URL]);

  const handleSave = async (e: any) => {
    e.preventDefault(); setSaving(true);
    await fetch(`${API_URL}/dash/api/server/${params.guildId}/config`, { method: "POST", headers: { "Content-Type": "application/json", "x-session-id": localStorage.getItem("fusion_session") || "" }, body: JSON.stringify(config) });
    alert("Settings Saved!"); setSaving(false);
  };

  if (!config) return <div className="min-h-screen text-white flex items-center justify-center">Loading Data...</div>;

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push("/dashboard")} className="mb-6 text-gray-400">← Back</button>
        <h1 className="text-3xl font-bold mb-2">{config.guildName} Settings</h1>
        {nukeStatus?.hasBackup && <div className="bg-green-900/30 border border-green-500 p-4 rounded mb-8">🛡️ <b>Anti-Nuke Active:</b> Last backup stored on {new Date(nukeStatus.backupDate).toLocaleString()}</div>}
        <form onSubmit={handleSave} className="bg-[#2b2d31] p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-[#5865f2]">Welcome Message</h2>
          <label className="block text-sm text-gray-400 mb-1 mt-4">Welcome Channel ID</label>
          <input type="text" className="w-full bg-[#1e1f22] p-3 rounded outline-none" value={config.welcomeChannel || ''} onChange={e => setConfig({...config, welcomeChannel: e.target.value})} />
          <label className="block text-sm text-gray-400 mb-1 mt-4">Welcome Description</label>
          <textarea className="w-full bg-[#1e1f22] p-3 rounded outline-none h-24" value={config.welcomeDesc || ''} onChange={e => setConfig({...config, welcomeDesc: e.target.value})} />
          <h2 className="text-xl font-bold mb-4 text-[#5865f2] mt-8">Moderation</h2>
          <label className="block text-sm text-gray-400 mb-1 mt-4">Banned Words (comma separated)</label>
          <input type="text" className="w-full bg-[#1e1f22] p-3 rounded outline-none" value={(config.banWords || []).join(', ')} onChange={e => setConfig({...config, banWords: e.target.value.split(',')})} />
          <button type="submit" disabled={saving} className="mt-8 w-full bg-[#5865f2] hover:bg-[#4752c4] p-4 rounded font-bold">{saving ? "Saving..." : "Save Settings"}</button>
        </form>
      </div>
    </div>
  );
}
