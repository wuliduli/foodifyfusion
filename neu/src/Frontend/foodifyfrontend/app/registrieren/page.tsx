import { header, plainText, inputField, inputFieldEnvironmentColumn, hintText, generalPadding, subHeader, button } from "../tailwind";
import { Button } from "../../components/ui/button";
import Link from 'next/link'
import { Input } from "../../components/ui/input";

export default function registrieren() {
  return (
    <div>
      <div>
        <p className={header}>
          Registrieren
        </p>
      </div>
      <div>
        <p className={plainText}>Legen sie sich hier in Ihren Account an, um die Funktionen unserer Platform im vollen zu genießen.</p>
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
      <div className="items-center">
        <Button
          className={`${button} mt-10`}>
          jetzt registrieren
        </Button>
      </div>
      <div>
        <p className={`${subHeader} pt-10` }>Bereits einen Account?</p>
      </div>
      <div>
        <Link href="/anmelden"className={plainText}>Kein Problem! Hier gelangen sie zur Anmeldung..</Link>
      </div>
    </div>
  );
}