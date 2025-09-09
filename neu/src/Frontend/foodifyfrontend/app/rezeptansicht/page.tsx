import { header, plainText, subHeader, labelPadding, inputField, button, buttonRed } from "../tailwind";
import { CarouselRezeptBilder } from "./carousel"
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import Image from "next/image";
import Bild1 from "./Italienische-Rinderrouladen.png";
import Bild2 from "./Italienische-Rinderrouladen2.png";
import Bild3 from "./Italienische-Rinderrouladen3.png";
import Bild4 from "./Italienische-Rinderrouladen4.png";
import { Bookmark, Plus, Minus } from "lucide-react";
import { FilterWithSearchbar } from "./popUpWithSearch";
import { ZutatenTabelle } from "./tabelle";

export default function rezeptansicht() {
    return (
        <div>
            <div>
                <h1 className={header}>Rezeptname</h1>
            </div>
            <div>
                <CarouselRezeptBilder />
            </div>
            <div className="flex flex-row gap-7">
                <div>
                    <Image
                        src={Bild2}
                        alt="Bild 1"
                        className="w-[250px] h-[250px] object-cover rounded-xl"
                    />
                </div>
                <div>
                    <Image
                        src={Bild3}
                        alt="Bild 1"
                        className="w-[250px] h-[250px] object-cover rounded-xl"
                    />
                </div>
                <div>
                    <Image
                        src={Bild4}
                        alt="Bild 1"
                        className="w-[250px] h-[250px] object-cover rounded-xl"
                    />
                </div>
            </div>
            <div className="flex flex-row gap-14 pt-5">
                <div className="flex flex row items-center gap-3">
                    <div>
                        <p className={plainText}>Bewertung:</p>
                    </div>
                    <div className="flex flex-row items-center">
                        <Star filled />
                        <Star filled />
                        <Star filled />
                        <Star filled />
                        <Star />
                    </div>
                </div>
                <div className="flex flex-row gap-3 items-center">
                    <div>
                        <p className={plainText}>Favorisiert:</p>
                    </div>
                    <div className="flex flex-row items-center">
                        <Bookmark className="w-6 h-6 text-gray-300" />
                    </div>
                </div>
                <form className="flex flex-row items-center gap-3">
                    <label htmlFor="email" className={"items-center" + plainText + labelPadding}>Allergene (optional):</label>
                    <FilterWithSearchbar />
                </form>
            </div>
            {/* Zutaten */}
            <div>
                <h2 className={subHeader}>Zutaten:</h2>
                <div className="flex flex-row gap-5 items-center">
                    <div className="pr-10">
                        <p>Portionen:</p>
                    </div>
                    <div>
                        <Input type="number" min="1" defaultValue="2" className={"border p-2 rounded w-[40]"} />
                    </div>
                    <div>
                        <Button className={buttonRed + " p-2"}>
                            <Minus className="w-6 h-6" />
                        </Button>
                    </div>
                    <div>
                        <Button className={button + " p-2"}>
                            <Plus className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
                {/* Zutatentabelle */}
                <div className="pt-5">
                    <ZutatenTabelle />
                </div>
            </div>
            {/* Rezeptbeschreibung */}
            <div>
                <h2 className={subHeader}>Rezeptbeschreibung:</h2>
                <p className={"pt-5 " + plainText}>
                    Füllen & Rollen:Die Rouladen auf einer Arbeitsfläche ausbreiten, mit Salz und Pfeffer würzen, dann mit Senf bestreichen. Jede Roulade mit 2 Scheiben Speck, Gurke und etwas Zwiebel belegen. Fest aufrollen und mit Küchengarn oder Zahnstochern fixieren.
                    <br />Anbraten:In einem großen Bräter Butterschmalz erhitzen und die Rouladen rundherum kräftig anbraten. Herausnehmen und beiseitelegen.
                    <br />Ansatz für die Sauce:Im selben Topf Karotten, Sellerie und die grob gewürfelte Zwiebel anbraten, bis sie Röstaromen entwickeln. Tomatenmark zugeben und kurz mitrösten. Mit Rotwein ablöschen und etwas einkochen lassen.
                    <br />Schmoren: Rinderfond zugeben, Lorbeer und Piment einlegen. Die Rouladen zurück in den Topf geben, zudecken und bei mittlerer Hitze ca. 1,5 Stunden schmoren lassen.
                    <br />Vollenden:Rouladen herausnehmen. Die Sauce durch ein Sieb passieren, nochmals aufkochen und ggf. mit etwas kalter Butter oder Speisestärke abbinden. Abschmecken mit Salz, Pfeffer und einem Hauch Zucker.
                </p>
            </div>
            {/* Aktionen */}
            <div className="flex flex-col pt-10">
                <h2 className={subHeader}>
                    Aktionen:
                </h2>
                <div className="flex flex-row gap-5">
                    <div>
                        <p className={plainText}>Favorisieren:</p>
                    </div>
                    <div>
                        <Bookmark className="w-6 h-6 text-gray-300" />
                    </div>
                </div>
                <div className="flex flex-row gap-5 pb-10">
                    <div>
                        <p className={plainText}>Bewerten:</p>
                    </div>
                    <div className="flex flex-row items-center">
                        <Star />
                        <Star />
                        <Star />
                        <Star />
                        <Star />
                    </div>
                </div>                
            </div>
        </div>
    );
}

export function Star({ filled = false }: { filled?: boolean }) {
    return filled ? (
        <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
    ) : (
        <svg className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
        </svg>
    );
}