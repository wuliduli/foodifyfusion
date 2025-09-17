
"use client"
import { Input } from "../../components/ui/input";

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "1",
    label: "Alle Zutaten",
  },
  {
    value: "2",
    label: "Eier",
  },
  {
    value: "3",
    label: "Kartoffeln",
  },
  {
    value: "4",
    label: "Fleisch",
  },
  {
    value: "5",
    label: "Gemüse",
  },
  {
    value: "6",
    label: "Mehl",
  },
  {
    value: "7",
    label: "Zucker",
  },
  {
    value: "8",
    label: "Salz",
  },
  {
    value: "9",
    label: "Milch",
  },
  {
    value: "10",
    label: "Eier",
  },
  {
    value: "11",
    label: "Butter",
  },
  {
    value: "12",
    label: "Öl",
  },
  {
    value: "13",
    label: "Wasser",
  },
  {
    value: "14",
    label: "Hefe",
  },
]

export function FilterWithSearchbar({ setIngredients, ingredients }: { setIngredients?: (val: string) => void, ingredients?: string }) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<{ [key: string]: string }>(() => {
    try {
      return ingredients ? JSON.parse(ingredients) : {};
    } catch {
      return {};
    }
  });
  const [zutat, setZutat] = React.useState("");
  const [menge, setMenge] = React.useState("");

  const handleAdd = () => {
    if (!zutat || !menge) return;
    const newSelected = { ...selected, [zutat]: menge };
    setSelected(newSelected);
    setZutat("");
    setMenge("");
    setIngredients && setIngredients(JSON.stringify(newSelected));
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            Zutaten hinzufügen
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-4">
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Zutat"
              value={zutat}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setZutat(e.target.value)}
            />
            <Input
              placeholder="Menge/Gewicht"
              value={menge}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMenge(e.target.value)}
            />
            <Button type="button" onClick={handleAdd}>
              Hinzufügen
            </Button>
          </div>
          <div className="pt-2">
            <div className="text-xs text-gray-500">Aktuelle Zutaten:</div>
            <ul className="text-xs">
              {Object.entries(selected).map(([k, v]) => (
                <li key={k}>{k}: {v}</li>
              ))}
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}