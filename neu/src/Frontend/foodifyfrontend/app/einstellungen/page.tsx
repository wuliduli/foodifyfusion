import { header, plainText, inputFieldEnvironmentColumn, inputField, button, buttonRed } from "../tailwind";
import { Input } from "../../components/ui/input";
import { SwitchButton } from "./switch";
import { Button } from "../../components/ui/button";

export default function einstellungen() {
    return (
        <div>
            <div>
                <h1 className={header}>Einstellungen</h1>
            </div>
            <div className="flex flex row items-center gap-3">
                <div>
                    <p className={plainText}>USER-ID:</p>
                </div>
                <div>
                    <p className={plainText}>$Beispiel</p>
                </div>
            </div>
            <div>
                <form className={inputFieldEnvironmentColumn}>
                    <label htmlFor="email" className={plainText}>Email:</label>
                    <Input className={inputField} placeholder="BeispielMail@gmx.com" />
                </form>
            </div>     
            <div>
                <form className={inputFieldEnvironmentColumn}>
                    <label htmlFor="password" className={plainText}>Passwort:</label>
                    <Input className={inputField} placeholder="****************" />
                </form>
            </div> 
            <div className="flex flex row items-center gap-3">
                <div>
                    <p className={plainText}>Öffentliche Rezepte:</p>
                </div>
                <div>
                    <p className={plainText}>$Beispiel</p>
                </div>
            </div>
            <div className="flex flex row items-center gap-3">
                <div>
                    <p className={plainText}>Private Rezepte:</p>
                </div>
                <div>
                    <p className={plainText}>$Beispiel</p>
                </div>
            </div>
            <div className="flex flex row items-center gap-3">
                <div>
                    <p className={plainText}>Öffentlich/ Privat:</p>
                </div>
                <div>
                    <SwitchButton/>
                </div>
            </div>  
            <div className="items-center pb-10">
                <Button
                    className={buttonRed}>
                    Account löschen
                </Button>
            </div>                                                                 
        </div>
    )
}