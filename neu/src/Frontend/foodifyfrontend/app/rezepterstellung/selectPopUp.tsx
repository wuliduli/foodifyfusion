import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectFieldPortionen() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Portion" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Anzahl</SelectLabel>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="4">4</SelectItem>
          <SelectItem value="5">5</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
export function SelectFieldDauer() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Dauer" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Minuten</SelectLabel>
          <SelectItem value="1">10</SelectItem>
          <SelectItem value="2">30</SelectItem>
          <SelectItem value="3">60</SelectItem>
          <SelectItem value="4">90</SelectItem>
          <SelectItem value="5">120+</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
