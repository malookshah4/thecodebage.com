import {
  Banknote,
  Cake,
  Cpu,
  Files,
  Film,
  IdCard,
  ImagePlus,
  KeyRound,
  Landmark,
  MessageCircle,
  Minimize,
  Music,
  Package,
  Percent,
  QrCode,
  Receipt,
  Repeat,
  Ruler,
  Scaling,
  ScanText,
  Scissors,
  ShoppingBag,
  Type,
  type LucideIcon,
} from "lucide-react";
import type { ToolIcon as ToolIconName } from "@/lib/tools";

const ICONS: Record<ToolIconName, LucideIcon> = {
  "scan-text": ScanText,
  minimize: Minimize,
  scaling: Scaling,
  repeat: Repeat,
  "id-card": IdCard,
  film: Film,
  music: Music,
  files: Files,
  scissors: Scissors,
  "image-plus": ImagePlus,
  "qr-code": QrCode,
  "message-circle": MessageCircle,
  type: Type,
  cpu: Cpu,
  banknote: Banknote,
  landmark: Landmark,
  percent: Percent,
  cake: Cake,
  ruler: Ruler,
  package: Package,
  "shopping-bag": ShoppingBag,
  "key-round": KeyRound,
  receipt: Receipt,
};

export function ToolIcon({ name, size = 22 }: { name: ToolIconName; size?: number }) {
  const Icon = ICONS[name];
  return (
    <span
      aria-hidden
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size + 22,
        height: size + 22,
        borderRadius: 12,
        background: "var(--hub-accent-soft)",
        color: "var(--hub-accent)",
        flexShrink: 0,
      }}
    >
      <Icon size={size} />
    </span>
  );
}
