'use-client';
'use client';
import { useState } from "react";
import { header, plainText, inputField, inputFieldEnvironmentColumn, hintText, generalPadding, subHeader, button } from "../tailwind";
import { Button } from "../../components/ui/button";
import Link from 'next/link';
import { Input } from "../../components/ui/input";

export default function Registrieren() {
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
      const res = await fetch("http://3.79.139.187:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        setSuccess("Registrierung erfolgreich!");
        setEmail("");
        setPassword("");
      } else {
        const data = await res.json();
        setError(data.detail || "Fehler bei der Registrierung.");
      }
    } catch (err) {
      setError("Netzwerkfehler oder Server nicht erreichbar.");
    }
    setLoading(false);
  };

  return (
    <div>
      <div>
        <p className={header}>Registrieren</p>
      </div>
      <div>
        <p className={plainText}>Legen sie sich hier in Ihren Account an, um die Funktionen unserer Platform im vollen zu genießen.</p>
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
        <Button className={`${button} mt-10`} type="submit" disabled={loading}>
          {loading ? "Registriere..." : "jetzt registrieren"}
        </Button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
      <div>
        <p className={`${subHeader} pt-10`}>Bereits einen Account?</p>
      </div>
      <div>
        <Link href="/anmelden" className={plainText}>Kein Problem! Hier gelangen sie zur Anmeldung..</Link>
      </div>
    </div>
  );
}