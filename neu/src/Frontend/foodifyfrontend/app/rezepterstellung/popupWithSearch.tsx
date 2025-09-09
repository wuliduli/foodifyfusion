"use client"

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

export function FilterWithSearchbar() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Zutaten / Gewicht"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] h-[13rem] p-0">
        <Command>
          <CommandInput placeholder="Zutaten / Gewicht" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}