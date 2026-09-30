import type {
  ButtonHTMLAttributes,
  FormEvent,
  TextareaHTMLAttributes,
} from "react";
import { KeylineIcon } from "./icons";

export type ActionStyle = "Primary" | "Secondary" | "Tertiary";
export type ActionState = "Default" | "Hover" | "Focused" | "Disabled" | "Loading";
export type IconIntent = "Context" | "Send" | "Stop";
export type IconButtonState = "Default" | "Hover" | "Focused" | "Disabled";
export type ComposerState = "Empty" | "Focused" | "Typing" | "Generating" | "Disabled";
export type HeroViewport = "Desktop" | "Mobile";

type ActionButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> & {
  label: string;
  variant?: ActionStyle;
  state?: ActionState;
  showTrailingIcon?: boolean;
};

export function ActionButton({
  label,
  variant = "Primary",
  state = "Default",
  showTrailingIcon = true,
  className = "",
  disabled,
  ...buttonProps
}: ActionButtonProps) {
  const isBusy = state === "Loading";
  const isDisabled = disabled || state === "Disabled" || isBusy;
  const supportsGlyph = variant !== "Tertiary";
  const showGlyph = supportsGlyph && (isBusy || showTrailingIcon);
  const iconName = isBusy ? "Loader circle" : "Arrow up right";
  const iconTone = isBusy || variant === "Primary" ? "inverse" : "neutral";
  const classes = [
    "action-button",
    "action-button--" + variant.toLowerCase(),
    "action-button--" + state.toLowerCase(),
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...buttonProps}
      aria-busy={isBusy || undefined}
      className={classes}
      disabled={isDisabled}
      type={buttonProps.type ?? "button"}
    >
      <span>{label}</span>
      {showGlyph && (
        <KeylineIcon
          className={isBusy ? "action-button__loader" : ""}
          name={iconName}
          size={24}
          tone={state === "Disabled" ? "muted" : iconTone}
        />
      )}
    </button>
  );
}

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> & {
  intent: IconIntent;
  state?: IconButtonState;
  accessibleLabel: string;
};

const intentIcons = {
  Context: "Plus",
  Send: "Arrow up",
  Stop: "Square",
} as const;

export function IconButton({
  intent,
  state = "Default",
  accessibleLabel,
  className = "",
  disabled,
  ...buttonProps
}: IconButtonProps) {
  const isDisabled = disabled || state === "Disabled";
  const classes = [
    "icon-button",
    "icon-button--" + intent.toLowerCase(),
    "icon-button--" + state.toLowerCase(),
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const tone =
    state === "Disabled" ? "muted" : intent === "Send" ? "inverse" : "neutral";

  return (
    <button
      {...buttonProps}
      aria-label={accessibleLabel}
      className={classes}
      disabled={isDisabled}
      type={buttonProps.type ?? "button"}
    >
      <KeylineIcon name={intentIcons[intent]} size={24} tone={tone} />
    </button>
  );
}

type HeroSectionProps = {
  viewport?: HeroViewport;
  onExplore?: () => void;
  onDocumentation?: () => void;
};

export function HeroSection({
  viewport = "Desktop",
  onExplore,
  onDocumentation,
}: HeroSectionProps) {
  return (
    <section
      aria-label="AI component library hero"
      className={"hero-component hero-component--" + viewport.toLowerCase()}
    >
      <div className="hero-component__content">
        <div className="hero-eyebrow" data-enter>
          <span className="hero-eyebrow__dot" />
          AI-native component library
        </div>
        <h1 data-enter>
          Build AI experiences
          <br />
          with confidence.
        </h1>
        <p className="hero-component__description" data-enter>
          Composable React + TypeScript foundations for polished AI workspaces
          and modern product sites.
        </p>
        <div className="hero-component__actions" data-enter>
          <ActionButton label="Explore components" onClick={onExplore} />
          <ActionButton
            label="View documentation"
            onClick={onDocumentation}
            variant="Secondary"
          />
        </div>
      </div>

      <article className="agent-preview" data-enter>
        <header className="agent-preview__header">
          <div className="agent-preview__mark">
            <KeylineIcon name="Sparkle" size={24} tone="brand" />
          </div>
          <div className="agent-preview__identity">
            <strong>Nova Research</strong>
            <span>Web research agent</span>
          </div>
          <span className="status-pill status-pill--success">Completed</span>
        </header>
        <div className="agent-preview__divider" />
        <div className="agent-preview__prompt">
          <span>YOUR REQUEST</span>
          <p>Compare launch signals and recommend the best week to announce.</p>
        </div>
        <div className="agent-preview__answer">
          <span>RECOMMENDATION</span>
          <p>
            Announce in the second week of May. Search interest is rising while
            competitor launches remain quiet.
          </p>
        </div>
        <div className="agent-preview__evidence">
          <span className="status-pill status-pill--neutral">3 sources</span>
          <span className="status-pill status-pill--warm">94% confidence</span>
        </div>
      </article>
    </section>
  );
}

type PromptComposerProps = {
  state: ComposerState;
  value: string;
  model: string;
  hasContext: boolean;
  onValueChange: (value: string) => void;
  onStateChange: (state: ComposerState) => void;
  onModelChange: () => void;
  onContextToggle: () => void;
  onSend: () => void;
  onStop: () => void;
  textareaProps?: TextareaHTMLAttributes<HTMLTextAreaElement>;
};

export function PromptComposer({
  state,
  value,
  model,
  hasContext,
  onValueChange,
  onStateChange,
  onModelChange,
  onContextToggle,
  onSend,
  onStop,
  textareaProps,
}: PromptComposerProps) {
  const isDisabled = state === "Disabled";
  const isGenerating = state === "Generating";
  const sendDisabled =
    isDisabled || state === "Empty" || state === "Focused" || !value.trim();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isGenerating) {
      onStop();
    } else if (!sendDisabled) {
      onSend();
    }
  };

  return (
    <form
      className={"prompt-composer prompt-composer--" + state.toLowerCase()}
      onSubmit={handleSubmit}
    >
      <textarea
        {...textareaProps}
        aria-label="Prompt"
        className="prompt-composer__input"
        disabled={isDisabled}
        onBlur={() => {
          if (!value.trim() && state === "Focused") onStateChange("Empty");
        }}
        onChange={(event) => {
          onValueChange(event.currentTarget.value);
          onStateChange(event.currentTarget.value.trim() ? "Typing" : "Empty");
        }}
        onFocus={() => {
          if (!isDisabled && state === "Empty") onStateChange("Focused");
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (!sendDisabled) onSend();
          }
        }}
        placeholder="Ask anything about your workspace…"
        readOnly={isGenerating}
        value={value}
      />
      <div className="prompt-composer__toolbar">
        <div className="prompt-composer__context">
          <span className={"context-chip" + (hasContext ? " context-chip--active" : "")}>
            {hasContext ? "Workspace brief" : "Add context"}
          </span>
          <IconButton
            accessibleLabel={hasContext ? "Remove context" : "Add context"}
            disabled={isDisabled}
            intent="Context"
            onClick={onContextToggle}
            state={isDisabled ? "Disabled" : "Default"}
          />
        </div>
        <div className="prompt-composer__submit">
          <button
            aria-label="Change model"
            className="model-selector"
            disabled={isDisabled}
            onClick={onModelChange}
            type="button"
          >
            <span>{model}</span>
            <KeylineIcon
              name="Chevron down"
              size={16}
              tone={isDisabled ? "muted" : "neutral"}
            />
          </button>
          <IconButton
            accessibleLabel={isGenerating ? "Stop generation" : "Send prompt"}
            disabled={sendDisabled && !isGenerating}
            intent={isGenerating ? "Stop" : "Send"}
            state={
              sendDisabled && !isGenerating
                ? "Disabled"
                : isGenerating
                  ? "Default"
                  : "Default"
            }
            type="submit"
          />
        </div>
      </div>
    </form>
  );
}
