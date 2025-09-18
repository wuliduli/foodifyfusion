"use client"
import { inputFieldEnvironmentColumn, plainText, labelPadding, inputField, button, elementPadding, header } from "../tailwind";
import { Input } from "../../components/ui/input";
import { SelectFieldPortionen, SelectFieldDauer } from "./selectPopUp"
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { SwitchButton } from "./switchh";
import { Upload, Plus } from "lucide-react";
import { FilterWithSearchbar } from "./popupWithSearch";
import { useState, useRef } from "react";

export default function RezeptErstellungPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [cookBakeTime, setCookBakeTime] = useState("");
    const [ingredients, setIngredients] = useState("{}");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if (!token) throw new Error("Kein Token gefunden. Bitte zuerst einloggen.");
            // Zutaten-JSON validieren
            try {
                JSON.parse(ingredients);
            } catch {
                setError("Zutaten ist kein gültiger JSON-String! Beispiel: {\"Mehl\":\"200g\"}");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("cook_bake_time", cookBakeTime ? cookBakeTime.toString() : "");
            formData.append("ingredients", ingredients);
            formData.append("servings", "1");
            // Bilder anhängen
            images.forEach((img) => {
                formData.append("images", img);
            });

            const response = await fetch("http://3.79.139.187:8000/recipes/create", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            });
            if (!response.ok) {
                let msg = "Fehler beim Erstellen des Rezepts";
                try {
                    const data = await response.json();
                    if (data.detail) msg += ": " + JSON.stringify(data.detail);
                } catch {}
                throw new Error(msg);
            }
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
            <form className={inputFieldEnvironmentColumn} onSubmit={handleSubmit}>
                <label htmlFor="rezeptname" className={plainText}>Rezeptname:</label>
                <Input className={inputField} placeholder="Text..." value={title} onChange={e => setTitle(e.target.value)} required />
                <label htmlFor="images" className={`${plainText} ${labelPadding}`}>Uploaden sie ihre Rezeptbilder:</label>
                <div className="flex flex-row gap-5 items-center">
                    <input
                        type="file"
                        id="images"
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={e => {
                            if (e.target.files) {
                                setImages(Array.from(e.target.files));
                            }
                        }}
                    />
                    <Button
                        className={button}
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Upload className="w-6 h-6 inline-block" />
                        {images.length > 0 ? ` ${images.length} Bild(er) ausgewählt` : "Bilder auswählen"}
                    </Button>
                    <div>
                        <p>50 MB Limit</p>
                    </div>
                </div>
                {/* Restliche Felder und Komponenten bleiben erhalten */}
                <label htmlFor="ingredients" className={`${plainText} ${labelPadding}`}>Zutaten (als JSON-String) *</label>
                <FilterWithSearchbar setIngredients={setIngredients} ingredients={ingredients} />
                <Input
                    className={inputField + " mt-2"}
                    value={ingredients}
                    onChange={e => setIngredients(e.target.value)}
                    placeholder='{"zutat": "Anzahl/Gewicht als String"}'
                    required
                />
                <div className={"flex flex-row items-center gap-5 " + labelPadding}>
                    <label className={plainText}>Hinzufügen</label>
                    <Button className={button + " p-2"} type="button">
                        <Plus className="w-6 h-6" />
                    </Button>
                </div>
                <div className={"pt-3"}>
                    <Textarea className="w-110 h-30" placeholder="" />
                </div>
                <label htmlFor="servings" className={`${plainText} ${labelPadding}`}>Portionen:</label>
                <SelectFieldPortionen />
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
                    <label htmlFor="allergene" className={`${plainText} ${labelPadding}`}>Allergene (optional):</label>
                    <FilterWithSearchbar />
                </div>
                <div className="items-center pb-10">
                    <Button
                        className={button}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Wird gesendet..." : "Rezept hinzufügen"}
                    </Button>
                    {error && <div className="text-red-500 pt-2">{error}</div>}
                    {success && <div className="text-green-600 pt-2">Rezept erfolgreich erstellt!</div>}
                </div>
            </form>
        </div>
    );
}