import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"

export function SwitchButton() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="Privat/Öffentlich" />
      <Label htmlFor="Privat/Öffentlich">Privat/Öffentlich</Label>
    </div>
  );
}