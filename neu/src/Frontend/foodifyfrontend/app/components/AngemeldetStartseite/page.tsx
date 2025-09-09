import { generalPadding, header, subHeader, button, elementPadding } from "../../tailwind";
import RezeptSchnellAnsicht from "../rezeptSchnellAnsicht/rezeptSchnellAnsicht";
import { Button } from "../../../components/ui/button";
import { RotateCw, Settings } from "lucide-react"
import { PaginationRezepte } from "./pagination";

export default function AngemeldetStartseite() {

    return (
        <div>
            <div><p className={header}>Rezeptempfehlungen</p></div>
            <div><p className={subHeader}>Rezepte ausgewählt nach ihrem Geschmack</p></div>
            <div className={elementPadding}>
                <div className="flex flex-row items-center justify-between gap-5">
                <div>
                    <RotateCw></RotateCw>
                </div>
                <div>
                    <a href="/einstellungen">
                    <button><Settings></Settings></button>
                    </a>
                </div>
                </div>
            </div>
            <div className={`flex flex-row items-center justify-between ${elementPadding}`}>
                <RezeptSchnellAnsicht />
                <RezeptSchnellAnsicht />
                <RezeptSchnellAnsicht />
            </div>
            <div className={elementPadding}>
                <a href="/rezepterstellung">
                    <Button className={button}>Rezept erstellen</Button>
                </a>
            </div>
            <div><p className={header}>Rezeptbuch</p></div>
            <div className={`flex flex-row items-center justify-between gap-5 ${elementPadding}`}>
                <RezeptSchnellAnsicht />
                <RezeptSchnellAnsicht />
                <RezeptSchnellAnsicht />
            </div>
            <div className={`flex flex-row items-center justify-between gap-5 ${elementPadding}`}>
                <RezeptSchnellAnsicht />
                <RezeptSchnellAnsicht />
                <RezeptSchnellAnsicht />
            </div>
            <div className={`flex flex-row items-center justify-between gap-5 ${elementPadding}`}>
                <RezeptSchnellAnsicht />
                <RezeptSchnellAnsicht />
                <RezeptSchnellAnsicht />
            </div>
            <div className={elementPadding}>
                <PaginationRezepte />
            </div>
        </div>
    );
}