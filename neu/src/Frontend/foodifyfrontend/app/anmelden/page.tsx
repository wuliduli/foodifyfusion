'use client'
import { useState } from "react";
import { header, plainText, inputField, inputFieldEnvironmentColumn, hintText, generalPadding, subHeader, button } from "../tailwind";
import { Button } from "../../components/ui/button";
import Link from 'next/link'
import { Input } from "../../components/ui/input";
import { useRouter } from "next/navigation";


export default function Anmelden() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://3.79.139.187:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuccess("Login erfolgreich!");
        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
        }
        setEmail("");
        setPassword("");
        router.push("/components/AngemeldetStartseite"); // Nach Login weiterleiten
      } else {
        const data = await res.json();
        setError(data.detail || "Fehler beim Login.");
      }
    } catch (err) {
      setError("Netzwerkfehler oder Server nicht erreichbar.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div>
        <p className={header}>Anmelden</p>
      </div>
      <div>
        <p className={plainText}>Loggen sie sich hier in Ihren Account an, um Zugriff auf weitere Funktionen zu erhalten.</p>
      </div>
      <form className={inputFieldEnvironmentColumn} onSubmit={handleSubmit}>
        <label htmlFor="email" className={plainText}>E-Mail:</label>
        <Input
          id="email"
          className={inputField}
          placeholder="email..."
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password" className={plainText}>Passwort:</label>
        <Input
          id="password"
          className={inputField}
          type="password"
          placeholder="passwort..."
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button className={`${button} mt-10 w-50`} type="submit" disabled={loading}>
          {loading ? "Anmelden..." : "Jetzt anmelden"}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
      <div>
        <p className={`${hintText} text-blue-600 hover:underline cursor-pointer`}>passwort vergessen?</p>
      </div>
  {/* Der separate Weiterleitungs-Button wurde entfernt, Weiterleitung erfolgt nur bei erfolgreichem Login im handleSubmit */}
      <div>
        <p className={`${subHeader} pt-10` }>Noch keinen Account?</p>
      </div>
      <div>
        <Link href="/registrieren"className={plainText}>Kein Problem! Hier gelangen sie zur registrierung..</Link>
      </div>
    </div>
  );
}