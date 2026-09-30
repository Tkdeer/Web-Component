import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import {
  ActionButton,
  HeroSection,
  IconButton,
  PromptComposer,
  type ActionState,
  type ActionStyle,
  type ComposerState,
  type HeroViewport,
  type IconButtonState,
  type IconIntent,
} from "./components";
import { KeylineIcon, type KeylineIconName } from "./icons";

type PageId = "overview" | "website" | "workspace" | "actions" | "icons";
type PageLink = {
  id: PageId;
  label: string;
  icon: KeylineIconName;
};

const pageGroups: { title: string; links: PageLink[] }[] = [
  {
    title: "LIBRARIES",
    links: [
      { id: "website", label: "Website components", icon: "Arrow up right" },
      { id: "workspace", label: "AI workspace", icon: "Sparkle" },
    ],
  },
  {
    title: "FOUNDATIONS",
    links: [
      { id: "actions", label: "Actions", icon: "Square" },
      { id: "icons", label: "Keyline icons", icon: "Plus" },
    ],
  },
];

const actionStyles: ActionStyle[] = ["Primary", "Secondary", "Tertiary"];
const actionStates: ActionState[] = [
  "Default",
  "Hover",
  "Focused",
  "Disabled",
  "Loading",
];
const iconIntents: IconIntent[] = ["Context", "Send", "Stop"];
const iconStates: IconButtonState[] = [
  "Default",
  "Hover",
  "Focused",
  "Disabled",
];
const composerStates: ComposerState[] = [
  "Empty",
  "Focused",
  "Typing",
  "Generating",
  "Disabled",
];
const iconNames: KeylineIconName[] = [
  "Sparkle",
  "Arrow up right",
  "Plus",
  "Arrow up",
  "Chevron down",
  "Square",
  "Check",
  "Loader circle",
];

const heroUsage =
  "import { HeroSection } from './components';\n\n" +
  "<HeroSection\n" +
  "  onExplore={() => navigate('/components')}\n" +
  "  onDocumentation={() => navigate('/docs')}\n" +
  "/>";

const composerUsage =
  "import { PromptComposer } from './components';\n\n" +
  "<PromptComposer\n" +
  "  state={state}\n" +
  "  value={prompt}\n" +
  "  model=\"Agent · Auto\"\n" +
  "  hasContext={hasContext}\n" +
  "  onValueChange={setPrompt}\n" +
  "  onSend={submitPrompt}\n" +
  "  onStop={stopAgent}\n" +
"/>";

const buttonUsage =
  "import { ActionButton } from './components';\n\n" +
  "<ActionButton\n" +
  "  label=\"Explore components\"\n" +
  "  variant=\"Primary\"\n" +
  "  state=\"Default\"\n" +
  "  showTrailingIcon\n" +
"/>";

function CodePanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <details className="code-panel">
      <summary>
        <span>
          <span className="code-panel__prompt">&lt;/&gt;</span>
          View React usage
        </span>
        <button
          className="copy-button"
          onClick={(event) => {
            event.preventDefault();
            void copy();
          }}
          type="button"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </summary>
      <pre>
        <code>{code}</code>
      </pre>
    </details>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  count,
}: {
  eyebrow: string;
  title: string;
  description: string;
  count?: string;
}) {
  return (
    <header className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {count && <span className="page-count">{count}</span>}
    </header>
  );
}

function StatePicker<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div aria-label={label} className="state-picker" role="group">
      {options.map((option) => (
        <button
          aria-pressed={value === option}
          className={value === option ? "is-active" : ""}
          key={option}
          onClick={() => onChange(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (page: PageId) => void }) {
  return (
    <div className="overview-page">
      <section className="overview-hero" data-enter>
        <div className="overview-hero__copy">
          <span className="eyebrow">
            <span className="live-dot" />
            REACT + TYPESCRIPT COMPONENT LIBRARY
          </span>
          <h1>
            Build AI experiences
            <br />
            with confidence.
          </h1>
          <p>
            Two practical component collections for polished product sites and
            focused AI workspaces. Copy a component, adjust its props, and keep
            moving.
          </p>
          <div className="overview-hero__actions">
            <ActionButton
              label="Browse components"
              onClick={() => onNavigate("website")}
            />
            <button
              className="text-link"
              onClick={() => onNavigate("workspace")}
              type="button"
            >
              Explore AI workspace
              <KeylineIcon name="Arrow up right" size={18} tone="neutral" />
            </button>
          </div>
        </div>
        <div aria-hidden="true" className="overview-orbit">
          <div className="orbit-card orbit-card--back">
            <div className="orbit-card__line orbit-card__line--short" />
            <div className="orbit-card__line" />
            <div className="orbit-card__line orbit-card__line--medium" />
          </div>
          <div className="orbit-card orbit-card--front">
            <span className="orbit-card__mark">
              <KeylineIcon name="Sparkle" size={20} tone="brand" />
            </span>
            <div>
              <strong>Nova Research</strong>
              <span>Agent workspace</span>
            </div>
            <span className="status-pill status-pill--warm">94% confidence</span>
          </div>
          <div className="orbit-dot orbit-dot--lime" />
          <div className="orbit-dot orbit-dot--orange" />
        </div>
      </section>

      <div className="section-intro" data-enter>
        <div>
          <div className="eyebrow">TWO COLLECTIONS</div>
          <h2>Start from the right building blocks.</h2>
        </div>
        <p>
          Shared actions, icons and color tokens keep both libraries feeling
          like one system.
        </p>
      </div>

      <div className="collection-grid">
        <button
          className="collection-card"
          data-enter
          onClick={() => onNavigate("website")}
          type="button"
        >
          <div className="collection-card__top">
            <span className="collection-card__number">01</span>
            <span className="collection-card__icon">
              <KeylineIcon name="Arrow up right" size={20} tone="brand" />
            </span>
          </div>
          <span className="eyebrow">WEBSITE COMPONENTS</span>
          <strong>Web Site</strong>
          <p>
            Composable landing-page sections, starting with a responsive
            product hero.
          </p>
          <span className="collection-card__footer">
            Explore HeroSection
            <KeylineIcon name="Arrow up right" size={18} tone="neutral" />
          </span>
        </button>
        <button
          className="collection-card collection-card--warm"
          data-enter
          onClick={() => onNavigate("workspace")}
          type="button"
        >
          <div className="collection-card__top">
            <span className="collection-card__number">02</span>
            <span className="collection-card__icon">
              <KeylineIcon name="Sparkle" size={20} tone="brand" />
            </span>
          </div>
          <span className="eyebrow">AI WORKSPACE COMPONENTS</span>
          <strong>AI Components</strong>
          <p>
            Interaction-ready primitives for prompts, agent controls and
            workspace flows.
          </p>
          <span className="collection-card__footer">
            Explore PromptComposer
            <KeylineIcon name="Arrow up right" size={18} tone="neutral" />
          </span>
        </button>
      </div>

      <footer className="overview-footer">
        <span>Built from atoms: tokens → actions → product sections.</span>
        <span>Keyline Icons · MIT</span>
      </footer>
    </div>
  );
}

function WebsitePage({
  viewport,
  onViewportChange,
  onNavigate,
}: {
  viewport: HeroViewport;
  onViewportChange: (value: HeroViewport) => void;
  onNavigate: (page: PageId) => void;
}) {
  return (
    <div className="library-page">
      <PageHeading
        count="01 / 01"
        description="Responsive sections for introducing a product, showing value and moving visitors into the next step."
        eyebrow="LIBRARY 01 · WEBSITE"
        title="Website components"
      />
      <section className="component-doc" data-enter>
        <div className="component-doc__heading">
          <div>
            <span className="component-index">01</span>
            <h2>HeroSection</h2>
            <p>
              A flexible first section for product websites, with a clear
              message and a live product preview.
            </p>
          </div>
          <span className="component-tag">Responsive</span>
        </div>
        <div className="demo-toolbar">
          <span className="demo-toolbar__label">PREVIEW</span>
          <StatePicker
            label="Hero viewport"
            onChange={onViewportChange}
            options={["Desktop", "Mobile"] as const}
            value={viewport}
          />
        </div>
        <div className={"component-stage component-stage--" + viewport.toLowerCase()}>
          <HeroSection
            onDocumentation={() => onNavigate("actions")}
            onExplore={() => onNavigate("actions")}
            viewport={viewport}
          />
        </div>
        <CodePanel code={heroUsage} />
        <div className="motion-note">
          <KeylineIcon name="Sparkle" size={18} tone="brand" />
          <p>
            <strong>Motion-ready:</strong> sequence the eyebrow, title,
            description, actions and product preview with GSAP on viewport
            entry.
          </p>
        </div>
      </section>
    </div>
  );
}

function WorkspacePage({
  state,
  onStateChange,
  value,
  onValueChange,
  model,
  onModelChange,
  hasContext,
  onContextToggle,
  onExampleStateChange,
  onSend,
  onStop,
}: {
  state: ComposerState;
  onStateChange: (state: ComposerState) => void;
  value: string;
  onValueChange: (value: string) => void;
  model: string;
  onModelChange: () => void;
  hasContext: boolean;
  onContextToggle: () => void;
  onExampleStateChange: (state: ComposerState) => void;
  onSend: () => void;
  onStop: () => void;
}) {
  return (
    <div className="library-page">
      <PageHeading
        count="01 / 01"
        description="A prompt surface for the main loop of an AI workspace: add context, choose a model, send a request, or stop a running agent."
        eyebrow="LIBRARY 02 · AI WORKSPACE"
        title="AI components"
      />
      <section className="component-doc" data-enter>
        <div className="component-doc__heading">
          <div>
            <span className="component-index component-index--warm">01</span>
            <h2>PromptComposer</h2>
            <p>
              Five interaction states and a compact toolbar, ready to connect
              to your own agent runtime.
            </p>
          </div>
          <span className="component-tag">Interactive</span>
        </div>
        <div className="demo-toolbar demo-toolbar--wrap">
          <span className="demo-toolbar__label">STATE</span>
          <StatePicker
            label="PromptComposer state"
            onChange={onExampleStateChange}
            options={composerStates}
            value={state}
          />
        </div>
        <div className="component-stage component-stage--composer">
          <PromptComposer
            hasContext={hasContext}
            model={model}
            onContextToggle={onContextToggle}
            onModelChange={onModelChange}
            onSend={onSend}
            onStateChange={onStateChange}
            onStop={onStop}
            onValueChange={onValueChange}
            state={state}
            value={value}
          />
          <div className="composer-hint">
            <span className="live-dot" />
            {state === "Generating"
              ? "Agent is working · click the stop control to interrupt"
              : "Enter to send · Shift + Enter to add a line"}
          </div>
        </div>
        <CodePanel code={composerUsage} />
        <div className="contract-grid">
          <div>
            <span className="contract-grid__number">01</span>
            <strong>Controlled value</strong>
            <p>Connect prompt text to your own state or form library.</p>
          </div>
          <div>
            <span className="contract-grid__number">02</span>
            <strong>Runtime callbacks</strong>
            <p>Handle send and stop in your agent orchestration layer.</p>
          </div>
          <div>
            <span className="contract-grid__number">03</span>
            <strong>Accessible actions</strong>
            <p>Icon-only controls include descriptive accessible names.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActionsPage() {
  const [style, setStyle] = useState<ActionStyle>("Primary");
  const [state, setState] = useState<ActionState>("Default");

  return (
    <div className="library-page">
      <PageHeading
        count="27 variants"
        description="Shared action primitives used by both component collections. Each state is a first-class option, not a one-off override."
        eyebrow="SHARED FOUNDATIONS"
        title="Actions"
      />
      <section className="component-doc" data-enter>
        <div className="component-doc__heading">
          <div>
            <span className="component-index">01</span>
            <h2>ActionButton</h2>
            <p>Text action with optional Keyline glyph and five states.</p>
          </div>
          <span className="component-tag">15 variants</span>
        </div>
        <div className="variant-controls">
          <div>
            <span className="demo-toolbar__label">STYLE</span>
            <StatePicker
              label="ActionButton style"
              onChange={setStyle}
              options={actionStyles}
              value={style}
            />
          </div>
          <div>
            <span className="demo-toolbar__label">STATE</span>
            <StatePicker
              label="ActionButton state"
              onChange={setState}
              options={actionStates}
              value={state}
            />
          </div>
        </div>
        <div className="action-preview">
          <span>PREVIEW</span>
          <ActionButton
            label="Explore components"
            onClick={() => setState("Loading")}
            showTrailingIcon
            state={state}
            variant={style}
          />
          <span className="action-preview__hint">
            {state === "Loading"
              ? "Loading state"
              : "Click the button to preview its loading state"}
          </span>
        </div>
        <CodePanel code={buttonUsage} />
        <div className="variant-table-wrap">
          <div className="variant-table">
            <div className="variant-table__row variant-table__head">
              <span>STYLE / STATE</span>
              {actionStates.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            {actionStyles.map((item) => (
              <div className="variant-table__row" key={item}>
                <strong>{item}</strong>
                {actionStates.map((itemState) => (
                  <ActionButton
                    key={itemState}
                    label={item === "Primary" ? "Get started" : "Learn more"}
                    showTrailingIcon={item !== "Tertiary"}
                    state={itemState}
                    variant={item}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="component-doc component-doc--secondary" data-enter>
        <div className="component-doc__heading">
          <div>
            <span className="component-index component-index--warm">02</span>
            <h2>IconButton</h2>
            <p>Compact context, send and stop controls with clear focus states.</p>
          </div>
          <span className="component-tag">12 variants</span>
        </div>
        <div className="icon-button-table">
          <div className="icon-button-table__head">
            <span>INTENT</span>
            {iconStates.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          {iconIntents.map((intent) => (
            <div className="icon-button-table__row" key={intent}>
              <strong>
                {intent === "Context"
                  ? "Add context"
                  : intent === "Send"
                    ? "Send prompt"
                    : "Stop generation"}
              </strong>
              {iconStates.map((itemState) => (
                <IconButton
                  accessibleLabel={intent + " " + itemState}
                  intent={intent}
                  key={itemState}
                  state={itemState}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function IconsPage() {
  const tones = ["neutral", "brand", "inverse", "muted"] as const;
  const [selectedTone, setSelectedTone] = useState<(typeof tones)[number]>("brand");

  return (
    <div className="library-page">
      <PageHeading
        count="8 glyphs"
        description="A curated subset from the official Keyline React package, imported from its Duotone entry point."
        eyebrow="SHARED FOUNDATIONS"
        title="Keyline icons"
      />
      <section className="component-doc" data-enter>
        <div className="component-doc__heading">
          <div>
            <span className="component-index">01</span>
            <h2>Icon gallery</h2>
            <p>Keyline Duotone glyphs on a 24 px grid, colored through currentColor.</p>
          </div>
          <span className="component-tag">8 Duotone icons</span>
        </div>
        <div className="demo-toolbar">
          <span className="demo-toolbar__label">TONE</span>
          <StatePicker
            label="Icon tone"
            onChange={setSelectedTone}
            options={tones}
            value={selectedTone}
          />
        </div>
        <div className="icon-gallery">
          {iconNames.map((name) => (
            <div className="icon-gallery__item" key={name}>
              <span className={"icon-gallery__sample icon-gallery__sample--" + selectedTone}>
                <KeylineIcon name={name} size={24} tone={selectedTone} />
              </span>
              <strong>{name}</strong>
              <code>24 × 24</code>
            </div>
          ))}
        </div>
        <div className="icon-license">
          Icons: Keyline Icons · MIT license · curated subset
        </div>
      </section>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState<PageId>("overview");
  const [search, setSearch] = useState("");
  const [heroViewport, setHeroViewport] = useState<HeroViewport>("Desktop");
  const [composerState, setComposerState] = useState<ComposerState>("Empty");
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("Agent · Auto");
  const [hasContext, setHasContext] = useState(false);
  const pageRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const generationTimer = useRef<ReturnType<typeof window.setTimeout> | null>(
    null,
  );

  const filteredGroups = useMemo(
    () =>
      pageGroups
        .map((group) => ({
          ...group,
          links: group.links.filter((link) =>
            link.label.toLowerCase().includes(search.toLowerCase()),
          ),
        }))
        .filter((group) => group.links.length > 0),
    [search],
  );

  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const page = pageRef.current;
      if (!page) return;
      gsap.fromTo(
        page,
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.32,
          ease: "power2.out",
          clearProps: "transform",
        },
      );
      gsap.fromTo(
        page.querySelectorAll("[data-enter]"),
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: "power2.out",
          stagger: 0.055,
          delay: 0.04,
          clearProps: "transform",
        },
      );
    });
    return () => media.revert();
  }, [activePage]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activePage]);

  useEffect(
    () => () => {
      if (generationTimer.current) window.clearTimeout(generationTimer.current);
    },
    [],
  );

  const navigate = (page: PageId) => {
    setSearch("");
    setActivePage(page);
  };

  const selectComposerState = (next: ComposerState) => {
    setComposerState(next);
    if (next === "Typing" || next === "Generating") {
      setPrompt(
        "Find the top churn signals and suggest next actions.",
      );
    } else {
      setPrompt("");
    }
  };

  const startAgent = () => {
    if (generationTimer.current) window.clearTimeout(generationTimer.current);
    setComposerState("Generating");
    generationTimer.current = window.setTimeout(() => {
      setComposerState("Typing");
      generationTimer.current = null;
    }, 1500);
  };

  const stopAgent = () => {
    if (generationTimer.current) window.clearTimeout(generationTimer.current);
    generationTimer.current = null;
    setComposerState("Typing");
  };

  const renderPage = () => {
    if (activePage === "website") {
      return (
        <WebsitePage
          onNavigate={navigate}
          onViewportChange={setHeroViewport}
          viewport={heroViewport}
        />
      );
    }
    if (activePage === "workspace") {
      return (
        <WorkspacePage
          hasContext={hasContext}
          model={model}
          onContextToggle={() => setHasContext((current) => !current)}
          onModelChange={() =>
            setModel((current) =>
              current === "Agent · Auto" ? "Agent · Pro" : "Agent · Auto",
            )
          }
          onExampleStateChange={selectComposerState}
          onSend={startAgent}
          onStateChange={setComposerState}
          onStop={stopAgent}
          onValueChange={(value) => {
            setPrompt(value);
            setComposerState(value.trim() ? "Typing" : "Empty");
          }}
          state={composerState}
          value={prompt}
        />
      );
    }
    if (activePage === "actions") return <ActionsPage />;
    if (activePage === "icons") return <IconsPage />;
    return <Overview onNavigate={navigate} />;
  };

  const activeLabel =
    activePage === "overview"
      ? "Overview"
      : pageGroups.flatMap((group) => group.links).find((link) => link.id === activePage)
          ?.label ?? "Components";

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          aria-label="Go to overview"
          className="brand-lockup"
          onClick={() => navigate("overview")}
          type="button"
        >
          <span className="brand-mark">
            <KeylineIcon name="Sparkle" size={18} tone="brand" />
          </span>
          <span className="brand-name">nova<span>ui</span></span>
        </button>
        <div className="topbar__center">
          <span className="topbar__breadcrumb">Component library</span>
          <KeylineIcon name="Chevron down" size={14} tone="muted" />
          <strong>{activeLabel}</strong>
        </div>
        <div className="topbar__right">
          <span className="stack-badge">React <i /> TypeScript</span>
          <button
            className="topbar__action"
            onClick={() => navigate("actions")}
            type="button"
          >
            <KeylineIcon name="Square" size={16} tone="neutral" />
            Components
          </button>
        </div>
      </header>

      <aside className="sidebar">
        <button
          className={
            "sidebar-link sidebar-link--overview" +
            (activePage === "overview" ? " is-active" : "")
          }
          onClick={() => navigate("overview")}
          type="button"
        >
          <KeylineIcon name="Sparkle" size={18} tone="brand" />
          Overview
        </button>
        <div className="sidebar-search">
          <KeylineIcon name="Plus" size={16} tone="muted" />
          <input
            aria-label="Search components"
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search components"
            value={search}
          />
          <kbd>/</kbd>
        </div>
        <nav aria-label="Component libraries" className="sidebar-nav">
          {filteredGroups.map((group) => (
            <div className="sidebar-group" key={group.title}>
              <div className="sidebar-group__title">{group.title}</div>
              {group.links.map((link) => (
                <button
                  className={
                    "sidebar-link" +
                    (activePage === link.id ? " is-active" : "")
                  }
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  type="button"
                >
                  <KeylineIcon
                    name={link.icon}
                    size={17}
                    tone={activePage === link.id ? "brand" : "muted"}
                  />
                  {link.label}
                  {activePage === link.id && <span className="sidebar-active-dot" />}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-update">
            <span className="sidebar-update__sparkle">
              <KeylineIcon name="Sparkle" size={16} tone="brand" />
            </span>
            <div>
              <strong>Design tokens</strong>
              <span>Lime + warm orange</span>
            </div>
            <KeylineIcon name="Arrow up right" size={15} tone="muted" />
          </div>
          <div className="sidebar-user">
            <span className="avatar">N</span>
            <div>
              <strong>Nova UI</strong>
              <span>Component workspace</span>
            </div>
            <span className="sidebar-user__dots">···</span>
          </div>
        </div>
      </aside>

      <main className="main-area" ref={scrollRef}>
        <section
          aria-label={activeLabel}
          className="page-content"
          key={activePage}
          ref={pageRef}
        >
          {renderPage()}
        </section>
        <footer className="page-footer">
          <span>Nova UI · foundations for AI-native products</span>
          <span>Made to compose</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
