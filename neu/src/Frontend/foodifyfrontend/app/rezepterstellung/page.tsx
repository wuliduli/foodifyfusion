import { inputFieldEnvironmentColumn, plainText, labelPadding, inputField, button, elementPadding, header } from "../tailwind";
import { Input } from "../../components/ui/input";
import { SelectFieldPortionen, SelectFieldDauer } from "./selectPopUp"
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { SwitchButton } from "./switchh";
import { Upload, Plus } from "lucide-react";
import { FilterWithSearchbar } from "./popupWithSearch";

export default function rezepterstellung() {
    return (
        <div>
            <div className="pb-10">
                <h2 className={header}>Rezept erstellen</h2>
            </div>
            <div>
                <form className={inputFieldEnvironmentColumn}>
                    <label htmlFor="email" className={plainText}>Rezeptname:</label>
                    <Input className={inputField} placeholder="Text..." />
                </form>
            </div>
            <div>
                <form className={inputFieldEnvironmentColumn}>

                    <label htmlFor="email" className={`${plainText} ${labelPadding}`}>Uploaden sie ihre Rezeptbilder::</label>
                    <div className="flex flex-row gap-5 items-center">
                        <div className="items-center">
                            <Button
                                className={button}>
                                <div>
                                    <Upload className="w-6 h-6 inline-block" />
                                </div>
                            </Button>
                            
                        </div>
                        <div>
                            <p>50 MB Limit</p>
                        </div>
                    </div>
                </form>
            </div>
            <div className="flex flex-row gap-10">
                <div>
                    <form className={inputFieldEnvironmentColumn}>
                        <label htmlFor="email" className={`${plainText} ${labelPadding}`}>Zutaten:</label>
                        <FilterWithSearchbar />
                    </form>
                </div>
                <div>
                    <form className={inputFieldEnvironmentColumn}>
                        <label htmlFor="email" className={`${plainText} ${labelPadding}`}>Gewicht:</label>
                        <FilterWithSearchbar />
                    </form>
                </div>
            </div>
            <div className={"flex flex-row items-center gap-5 " + labelPadding}>
                <label className={plainText}>Hinzufügen</label>
                <Button className={button + " p-2"}>
                    <Plus className="w-6 h-6" />
                </Button>
            </div>
            <div className={"pt-3"}>
                <Textarea className="w-110 h-30" placeholder="" />
            </div>
            <div>
                <form className={inputFieldEnvironmentColumn}>
                    <label htmlFor="email" className={`${plainText} ${labelPadding}`}>Portionen:</label>
                    <SelectFieldPortionen />
                </form>
            </div>
            <div>
                <form className={inputFieldEnvironmentColumn}>
                    <label htmlFor="email" className={`${plainText} ${labelPadding}`}>Dauer:</label>
                    <SelectFieldDauer />
                </form>
            </div>
            <div className={labelPadding}>
                <label className={plainText}>Arbeitsschritte</label>
                <Textarea className="w-110 h-30" placeholder="Hier können Sie ihr Rezept beschreiben..." />
            </div>
            <div className={labelPadding}>
                <SwitchButton />
            </div>
            <div className="pb-10">
                <form className={inputFieldEnvironmentColumn}>
                    <label htmlFor="email" className={`${plainText} ${labelPadding}`}>Allergene (optional):</label>
                    <FilterWithSearchbar />
                </form>
            </div>
            <div className="items-center pb-10">
                <Button
                    className={button}>
                    Rezept hinzufügen
                </Button>
            </div>
        </div>
    );
}