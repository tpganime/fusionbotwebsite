"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [guilds, setGuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://th-us1.terohost.com:25626";

  useEffect(() => {
    let sessionId = localStorage.getItem("fusion_session");
    const urlSession = searchParams.get("session");

    if (urlSession) {
      sessionId = urlSession;
      localStorage.setItem("fusion_session", sessionId);
      router.replace("/dashboard"); 
    }
    if (!sessionId) return router.push("/");

    Promise.all([
      fetch(`${API_URL}/dash/api/me`, { headers: { "x-session-id": sessionId } }).then(res => res.json()),
      fetch(`${API_URL}/dash/api/guilds`, { headers: { "x-session-id": sessionId } }).then(res => res.json())
    ]).then(([userData, guildsData]) => {
      if (userData.error) { localStorage.removeItem("fusion_session"); return router.push("/"); }
      setUser(userData); setGuilds(guildsData); setLoading(false);
    });
  }, [searchParams, router, API_URL]);

  const logout = () => { localStorage.removeItem("fusion_session"); router.push("/"); };

  if (loading) return <div className="min-h-screen text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen text-white p-8">
      <div className="flex justify-between items-center mb-10 border-b border-gray-600 pb-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold">Welcome, {user?.username}</h1>
        <button onClick={logout} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded font-bold">Logout</button>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {guilds.map((guild) => (
          <Link href={`/dashboard/${guild.id}`} key={guild.id}>
            <div className="bg-[#2b2d31] p-6 rounded-lg shadow-lg flex items-center gap-4 hover:bg-[#3f4147] transition cursor-pointer">
              {guild.icon ? <img src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} className="w-16 h-16 rounded-full" /> : <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center font-bold text-xl">{guild.name.charAt(0)}</div>}
              <div><h3 className="font-bold text-lg truncate w-48">{guild.name}</h3><p className="text-sm text-[#5865f2] mt-1 font-semibold">Manage Bot</p></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
