"use client"
import { inputFieldEnvironmentColumn, plainText, labelPadding, inputField, button, elementPadding, header } from "../tailwind";
import { Input } from "../../components/ui/input";
import { SelectFieldPortionen, SelectFieldDauer } from "./selectPopUp"
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { SwitchButton } from "./switchh";
import { Upload, Plus } from "lucide-react";
import { FilterWithSearchbar } from "./popupWithSearch";
import { useState } from "react";

export default function rezepterstellung() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [cookBakeTime, setCookBakeTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            const response = await fetch("http://3.79.139.187:8000/recipes/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                    cook_bake_time: cookBakeTime ? parseInt(cookBakeTime, 10) : undefined,
                }),
            });
            if (!response.ok) throw new Error("Fehler beim Erstellen des Rezepts");
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Unbekannter Fehler");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="pb-10">
                <h2 className={header}>Rezept erstellen</h2>
            </div>
            <div>
                <form className={inputFieldEnvironmentColumn} onSubmit={handleSubmit}>
                    <label htmlFor="rezeptname" className={plainText}>Rezeptname:</label>
                    <Input className={inputField} placeholder="Text..." value={title} onChange={e => setTitle(e.target.value)} required />
                </form>
            </div>
            {/* Restliche Felder und Komponenten bleiben erhalten */}
            <div>
                <form className={inputFieldEnvironmentColumn}>
                    <label htmlFor="email" className={`${plainText} ${labelPadding}`}>Uploaden sie ihre Rezeptbilder::</label>
                    <div className="flex flex-row gap-5 items-center">
                        <div className="items-center">
                            <Button className={button}>
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
                    <label htmlFor="cook_bake_time" className={`${plainText} ${labelPadding}`}>Dauer (Minuten) *</label>
                    <div className="flex flex-row gap-4 items-center">
                        
                        <Input
                            id="cook_bake_time"
                            className={inputField + " w-24"}
                            placeholder="z.B. 30"
                            type="number"
                            min="1"
                            required
                            value={cookBakeTime}
                            onChange={e => setCookBakeTime(e.target.value)}
                        />
                    </div>
                </form>
            </div>
            <div className={labelPadding}>
                <label className={plainText}>Arbeitsschritte *</label>
                <Textarea
                    className="w-110 h-30"
                    placeholder="Hier können Sie ihr Rezept beschreiben..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                />
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
                    className={button}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Wird gesendet..." : "Rezept hinzufügen"}
                </Button>
                {error && <div className="text-red-500 pt-2">{error}</div>}
                {success && <div className="text-green-600 pt-2">Rezept erfolgreich erstellt!</div>}
            </div>
        </div>
    );
}