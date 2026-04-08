"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://th-us1.terohost.com:25626";

  useEffect(() => {
    if (localStorage.getItem("fusion_session")) router.push("/dashboard");
    else setLoading(false);
  }, [router]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold mb-4 text-[#5865f2]">Fusion Hub</h1>
      <p className="text-gray-400 mb-8">Manage your server, backups, and bot settings instantly.</p>
      <button onClick={() => window.location.href = `${API_URL}/dash/login`} className="px-8 py-4 bg-[#5865f2] hover:bg-[#4752c4] rounded-lg font-bold text-lg transition-all">
        Login with Discord
      </button>
    </div>
  );
}
