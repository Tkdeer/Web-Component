import {
  CircleArrowUp,
  CircleArrowUpRight,
  CircleCheck,
  CircleChevronDown,
  CirclePlus,
  CircleProgressQuarter,
  Sparkles,
  SquareStop,
} from "@keyline-icons/react/duotone";

const icons = {
  Sparkle: Sparkles,
  "Arrow up right": CircleArrowUpRight,
  Plus: CirclePlus,
  "Arrow up": CircleArrowUp,
  "Chevron down": CircleChevronDown,
  Square: SquareStop,
  Check: CircleCheck,
  "Loader circle": CircleProgressQuarter,
} as const;

export type KeylineIconName = keyof typeof icons;
export type IconTone = "neutral" | "brand" | "inverse" | "muted" | "inherit";

type KeylineIconProps = {
  name: KeylineIconName;
  tone?: IconTone;
  size?: number;
  className?: string;
};

export function KeylineIcon({
  name,
  tone = "neutral",
  size = 24,
  className = "",
}: KeylineIconProps) {
  const Icon = icons[name];

  return (
    <Icon
      aria-hidden="true"
      className={"keyline-icon keyline-icon--" + tone + " " + className}
      focusable="false"
      size={size}
    />
  );
}
