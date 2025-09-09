import { header, plainText, inputField, inputFieldEnvironmentColumn, hintText, generalPadding, subHeader, button } from "./tailwind";
import RezeptSchnellAnsicht from "./components/rezeptSchnellAnsicht/rezeptSchnellAnsicht";
export default function Homepage() {
    return (
        <div>
            
            <div className="flex flex-row items-center justify-between gap-5">
                <RezeptSchnellAnsicht />
                <RezeptSchnellAnsicht />
                <RezeptSchnellAnsicht />
            </div>
        </div>

    );
}