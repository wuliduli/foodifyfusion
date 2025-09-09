'use client'
import { header, plainText, inputField, inputFieldEnvironmentColumn, hintText, generalPadding, subHeader, button } from "../tailwind";
import { Button } from "../../components/ui/button";
import Link from 'next/link'
import { Input } from "../../components/ui/input";
import { useRouter } from "next/navigation";


export default function anmelden() {
  const router = useRouter();
  return (
    <div>
      <div>
        <p className={header}>
          Anmelden
        </p>
      </div>
      <div>
        <p className={plainText}>Loggen sie sich hier in Ihren Account an, um Zugriff auf weitere Funktionen zu erhalten.</p>
      </div>
      <div>
        <div>
          <form className={inputFieldEnvironmentColumn}>
            <label htmlFor="email" className={plainText}>E-Mail:</label>
            <Input className={inputField} placeholder="email..." />
          </form>
        </div>
      </div>
      <div>
        <div>
          <form className={inputFieldEnvironmentColumn}>
            <label htmlFor="password" className={plainText}>Passwort:</label>
            <Input className={inputField} placeholder="passwort..." />
          </form>
        </div>
      </div>
      <div>
        <p className={`${hintText} text-blue-600 hover:underline cursor-pointer`}>passwort vergessen?</p>
      </div>
      <div className="items-center">
        <Button
          className={button}
          onClick={() => router.push("/components/AngemeldetStartseite")}>
          Anmelden
        </Button>
      </div>
      <div>
        <p className={`${subHeader} pt-10` }>Noch keinen Account?</p>
      </div>
      <div>
        <Link href="/registrieren"className={plainText}>Kein Problem! Hier gelangen sie zur registrierung..</Link>
      </div>
    </div>
  );
}