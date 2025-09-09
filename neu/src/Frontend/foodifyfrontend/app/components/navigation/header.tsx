import { Input } from "../../../components/ui/input";
import Link from 'next/link'
import { User } from "lucide-react"

export default function Header() {
    return (
        <header className="w-full bg-white p-5 text-center text-black fixed top-0 left-0 shadow-lg z-50">
            <div className="flex flex-row w-full items-center justify-center gap-20">
                <div className="text-3xl font-semibold">
                    <Link className="text-[#678164]" href="/">Foodify</Link>
                </div>
                {/* Gruppe: Suche + Filtern */}
                <div className="flex flex-row items-center gap-2">
                    <div className="w-[300px]">
                        <Input placeholder="Suche..." />
                    </div>
                    <div>
                        <Link href="/">Filtern</Link>
                    </div>
                </div>
                {/* Gruppe: Anmelden + User-Icon */}
                <div className="flex flex-row items-center gap-2">
                    <div>
                        <Link href="/anmelden">Anmelden</Link>
                    </div>
                    <div>
                        <User className="w-6 h-6 inline-block" />
                    </div>
                </div>
            </div>
        </header>
    );
}