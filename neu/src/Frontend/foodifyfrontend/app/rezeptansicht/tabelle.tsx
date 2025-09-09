import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const zutaten = [
  { name: "Rindfleisch", menge: "300 Gramm" },
  { name: "Rindfond", menge: "1 Glas" },
  { name: "Rotwein", menge: "500 ml" },
  { name: "Tomatenmark", menge: "1,5 EL" },
  { name: "Zwiebeln", menge: "3" },
  { name: "Öl", menge: "3-4 EL" },
  { name: "Walnusskerne", menge: "150 g" },
]

export function ZutatenTabelle() {
  return (
    <Table className="border rounded-2xl w-[800px]">
      <TableHeader>
        <TableRow>
          <TableHead className="text-lg">Zutat:</TableHead>
          <TableHead className="text-lg">Gewicht/Anzahl</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zutaten.map((zutat, idx) => (
          <TableRow key={zutat.name} className={idx % 2 === 0 ? "bg-gray-100" : ""}>
            <TableCell className="font-medium">{zutat.name}</TableCell>
            <TableCell>{zutat.menge}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
