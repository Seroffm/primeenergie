import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_WIEDERVORLAGE_TIME } from "@/lib/mock-tasks";

interface FollowUpFieldsProps {
  idPrefix: string;
  date: string;
  time: string;
  note: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  dateOptional?: boolean;
}

export function FollowUpFields({
  idPrefix,
  date,
  time,
  note,
  onDateChange,
  onTimeChange,
  onNoteChange,
  dateOptional = false,
}: FollowUpFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-date`}>Datum{dateOptional ? " (optional)" : ""}</Label>
          <Input
            id={`${idPrefix}-date`}
            type="date"
            value={date}
            onChange={(event) => onDateChange(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={`${idPrefix}-time`}>Uhrzeit (optional)</Label>
          <Input
            id={`${idPrefix}-time`}
            type="time"
            value={time}
            onChange={(event) => onTimeChange(event.target.value)}
            disabled={!date}
          />
          <p className="text-xs text-muted-foreground">
            Ohne Angabe: {DEFAULT_WIEDERVORLAGE_TIME} Uhr
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`${idPrefix}-note`}>Hinweis oder Grund (optional)</Label>
        <Textarea
          id={`${idPrefix}-note`}
          placeholder="z. B. Unterlagen mit dem Kunden prüfen"
          value={note}
          onChange={(event) => onNoteChange(event.target.value)}
          disabled={!date}
        />
      </div>
    </div>
  );
}
