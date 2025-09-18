"use client"
import { generalPadding, header, subHeader, button, elementPadding } from "../../tailwind";
import RezeptSchnellAnsicht from "../rezeptSchnellAnsicht/rezeptSchnellAnsicht";
import { Button } from "../../../components/ui/button";
import { RotateCw, Settings } from "lucide-react"
import { PaginationRezepte } from "./pagination";
import React, { useEffect, useState } from "react";

export default function AngemeldetStartseite() {
    const [rezepte, setRezepte] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRezepte = async () => {
            setLoading(true);
            setError("");
            try {
                const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
                if (!token) throw new Error("Kein Token gefunden. Bitte zuerst einloggen.");
                const res = await fetch("http://3.79.139.187:8000/recipes/my_recipes", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json"
                    }
                });
                if (!res.ok) throw new Error("Fehler beim Laden der Rezepte");
                const data = await res.json();
                setRezepte(data);
            } catch (err: any) {
                setError(err.message || "Unbekannter Fehler");
            } finally {
                setLoading(false);
            }
        };
        fetchRezepte();
    }, []);

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
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 ${elementPadding}`}>
                {rezepte.length === 0 && <div className="text-gray-400">Keine eigenen Rezepte gefunden.</div>}
                {rezepte.slice(0, 9).map((r) => {
                    const limitWords = (text: string, maxWords: number) => {
                        if (!text) return "";
                        const words = text.split(/\s+/);
                        if (words.length <= maxWords) return text;
                        return words.slice(0, maxWords).join(" ") + "...";
                    };
                    return (
                        <RezeptSchnellAnsicht
                            key={r.id}
                            title={r.title}
                            description={limitWords(r.description, 10)}
                            cookBakeTime={r.cook_bake_time}
                            imageUrl={
                                Array.isArray(r.image_urls) && r.image_urls.length > 0
                                    ? (r.image_urls[0].startsWith('http')
                                        ? r.image_urls[0]
                                        : `http://3.79.139.187:8000${r.image_urls[0].startsWith('/') ? '' : '/'}${r.image_urls[0]}`)
                                    : undefined
                            }
                            averageRating={r.average_rating}
                        />
                    );
                })}
            </div>
            <div className={elementPadding}>
                <PaginationRezepte />
            </div>
        </div>
    );
}