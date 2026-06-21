import { ShieldAlert } from "lucide-react";

export function SafetyBadge() {
  return (
    <div className="safety-badge">
      <ShieldAlert size={16} aria-hidden />
      <div>
        <strong>PUBLIC-SOURCE STRATEGIC DATA ONLY</strong>
        <span>No classified data. No operational tactics. No weapon-construction details.</span>
      </div>
    </div>
  );
}
