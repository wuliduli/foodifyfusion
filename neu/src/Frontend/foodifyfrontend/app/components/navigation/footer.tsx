import { footerColumn } from "../../tailwind";
import Link from 'next/link'
import "../../globals.css"

export default function Footer() {
    return (
        <>
        <footer className="w-full bg-[#678164] p-5 text-center bottom-0 left-0 text-white">
            <div className="flex flex-row w-full items-start justify-center gap-25">
                <div className={footerColumn}>
                    <p className="font-bold mt-0">&copy; {new Date().getFullYear()} Foodify</p>
                    <p>Am Schwimmbad 3</p>
                    <p>63322 Rödermark</p>
                </div>
                <div className={footerColumn}>
                    <p className="font-bold mt-0">Kontakt</p>
                    <p>Tel. : 1234567890</p>
                    <p>Fax : 1234567890</p>
                    <p>E-Mail: office@foodify.de</p>
                </div>
                <div className={footerColumn}>
                    <p className="font-bold mt-0">Foodify</p>
                    <p>Über uns</p>
                    <p>Tutorial</p>
                </div>
                <div className={footerColumn}>
                    <p className="font-bold mt-0">Rechtlich</p>
                    <Link href="/rechtliches/impressum">Impressum</Link>
                    <p>Datenschutz</p>
                    <p>AGB</p>                    
                </div>                
            </div>
        </footer>
        
        </>
    );
}
