import { useState } from "react";

// --- BRAND COLORS (swap these ~6 lines to reskin) ---
const ACCENT = "#C4956A";   // warm clay
const BG = "#0C0C0B";       // warm near-black
const CARD_BG = "#161514";   // warm dark surface
const BORDER = "#2A2826";    // warm border
const WHITE = "#EAE6E1";     // warm white
const GRAY = "#8A8480";      // warm muted text

const phases = [
  {
    id: "discovery",
    label: "Discovery",
    color: "#8B5CF6",
    description: "Define personas, problem space, hypotheses, and solution bets",
    stageIds: [1, 2],
  },
  {
    id: "prototype",
    label: "Prototype",
    color: "#10B981",
    description: "Build tangible artifacts fast — react to them, don't just read about them",
    stageIds: [3, 4, 5],
  },
  {
    id: "iterate",
    label: "Iterate & Validate",
    color: "#F59E0B",
    description: "Take prototypes back to personas, iterate, build confidence",
    stageIds: [6, 7],
  },
];

const futurePhases = [
  {
    id: "test",
    label: "Test",
    color: "#F472B6",
    description: "Pilot → Alpha → Beta, depending on what we're testing and rollout speed",
    icon: "🧪",
  },
  {
    id: "launch",
    label: "Launch & Scale",
    color: "#FB923C",
    description: "Controlled rollout — canary release, A/B tests, feature flags",
    icon: "🚀",
  },
  {
    id: "measure",
    label: "Measure & Iterate",
    color: "#A78BFA",
    description: "Post-launch measurement, bug fixes, steady-state iteration",
    icon: "📊",
  },
];

const stages = [
  {
    id: 1,
    label: "Research & Synthesis",
    tool: "ChatGPT → Claude",
    toolIcon: "🔬",
    color: "#8B5CF6",
    duration: "~1–3 days",
    outputs: [
      "Deep research report (ChatGPT Thinking + Claude Opus)",
      "PhD-level peer review (Claude Project)",
      "Refined research × 2 focused prompts",
      "Unified comprehensive brief",
    ],
    detail:
      "Start with the latest ChatGPT Thinking model + Deep Research to learn about the space, competitors, etc. Feed that output into a custom Claude project that acts as a PhD-level peer reviewer — tearing apart sources, assumptions, and gaps. Criticisms fed back into refined Claude Opus prompts and an updated research run is conducted. Split into multiple focused research threads when needed, then marry into one comprehensive brief. Incorporate any internal quantitative data (e.g. support tickets, etc.) and generate qualitative through discovery interviews (when possible).",
  },
  {
    id: 2,
    label: "Strategy Artifact",
    tool: "Claude + Manual",
    toolIcon: "🧠",
    color: "#8B5CF6",
    duration: "~1 day",
    outputs: [
      "Strategy artifact covering risks/mitigations",
      "Problem(s) to solve",
      "Hypothesis",
      "Key findings",
    ],
    detail:
      "Synthesize research into a cohesive strategy artifact focusing on key problem(s) to solve, risks/assumptions, and the 'why.' Multiple iterative rounds with Claude refining the narrative. Manual cleanup on positioning and narrative structure. I use the 80/20 framework: 80% completed with AI, reserving the final 20% for human taste and judgment to be applied.",
  },
  {
    id: 3,
    label: "Buy-in",
    tool: "Varies",
    toolIcon: "📋",
    color: "#10B981",
    duration: "~4 hours",
    outputs: [
      "PRFAQs, strategy briefs, videos, storyboards",
      "Stick+box diagrams for data flows/architecture",
      "Internal approvals and peer feedback",
    ],
    detail:
      "Synthesized strategy artifact is converted to whatever artifact(s) best drive buy-in for solving the identified problem(s). This is where internal approvals, manager/peer feedback, etc. is solicited to ensure that time and resourcing are only being spent on critical items.",
  },
  {
    id: 4,
    label: "Prototype Brief",
    tool: "Claude + Manual",
    toolIcon: "🧠",
    color: "#10B981",
    duration: "~2 hours",
    outputs: [
      "Screen-by-screen breakdown",
      "Interaction model",
      "Product reference images",
      "Visual design system",
    ],
    detail:
      "Comprehensive build document is generated: every screen, every data point, every interaction mapped to inform what is initially built. Where applicable, use existing patterns, design system, and other visual materials to mimic the product being worked on.",
  },
  {
    id: 5,
    label: "Functional Prototype",
    tool: "v0 + Cursor",
    toolIcon: "⚡",
    color: "#10B981",
    duration: "~6 hours",
    outputs: [
      "Interactive UX",
      "v0 generation → Cursor refinement",
      "Deploy when needed",
    ],
    detail:
      "Feed the build brief into v0 by Vercel for initial generation. Then move into Cursor for detailed refinements — interaction polish, visual tweaks, edge case handling. Deploy when needed for a live shareable URL.",
  },
  {
    id: 6,
    label: "Rapid Iteration + Validation",
    tool: "Cursor Agent",
    toolIcon: "🔄",
    color: "#F59E0B",
    duration: "~4–8 hours",
    outputs: [
      "Feedback synthesis",
      "Prototype with iterative updates",
      "Session recordings and/or transcripts",
    ],
    detail:
      "Conduct additional discovery using the functional prototype. Collect feedback and refine the product/feature in real-time using Cursor Agent to keep the feedback loop immediate and maximize time with the interviewee(s).",
  },
  {
    id: 7,
    label: "Final Pass & Spec Generation",
    tool: "Claude + Loom",
    toolIcon: "📄",
    color: "#F59E0B",
    duration: "Final pass",
    outputs: [
      "Async and/or live demo",
      "Deep dive conversation (if needed)",
      "Detailed build spec (i.e. PRD)",
    ],
    detail:
      "Generate a spec (typically PRD or similar) that covers the most up-to-date prototype version. Present this + the functional prototype to stakeholders for one more round of feedback. This is essentially a 'last pass' before looping in the broader PDE team to build out for real. Lead with async communication vehicle and provide the option for real-time conversation to deep dive.",
  },
];

const toolLegend = [
  { name: "Latest ChatGPT Thinking Model", color: "#22C55E", icon: "🔬", desc: "Deep research & initial synthesis" },
  { name: "Latest Claude Opus Model", color: "#8B5CF6", icon: "🧠", desc: "Peer review, strategy, writing, code gen" },
  { name: "Gamma", color: "#F59E0B", icon: "🎨", desc: "AI-powered presentation design" },
  { name: "v0 by Vercel", color: "#10B981", icon: "⚡", desc: "Functional React prototype generation" },
  { name: "Cursor", color: "#38BDF8", icon: "✏️", desc: "AI-powered code refinement & polish" },
  { name: "Loom", color: "#EC4899", icon: "🎬", desc: "Async video presentation & delivery" },
  { name: "WisprFlow", color: "#6B8E7B", icon: "🎙️", desc: "Voice-to-text used across all stages" },
];

export default function WorkflowDiagram() {
  const [activeStage, setActiveStage] = useState(null);
  const [hoveredStage, setHoveredStage] = useState(null);

  return (
    <div
      style={{
        fontFamily: "'Söhne', 'Helvetica Neue', Arial, sans-serif",
        background: BG,
        color: WHITE,
        minHeight: "100vh",
        padding: "40px 24px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ color: ACCENT, fontWeight: 900, fontSize: 14, letterSpacing: 3 }}>HOW I BUILD</span>
        </div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.2 }}>
          AI-Enabled Product Development Workflow
        </h1>
        <p style={{ margin: "8px 0 0", color: GRAY, fontSize: 14, lineHeight: 1.5 }}>
          The tools are plug-and-play. The process is the discipline.
          <br />
          Click any stage to explore.
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Phase labels row */}
        <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
          {phases.map((phase) => (
            <div
              key={phase.id}
              style={{
                flex: phase.stageIds.length,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                background: `${phase.color}10`,
                borderTop: `2px solid ${phase.color}`,
                borderLeft: `1px solid ${phase.color}22`,
                borderRight: `1px solid ${phase.color}22`,
                borderRadius: "8px 8px 0 0",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 2,
                  color: phase.color,
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                {phase.label}
              </span>
              <span style={{ fontSize: 10, color: GRAY, flex: 1 }}>
                {phase.description}
              </span>
            </div>
          ))}
        </div>

        {/* Main Pipeline */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 0,
            overflowX: "auto",
            paddingBottom: 8,
          }}
        >
          {stages.map((stage, i) => {
            const isActive = activeStage === stage.id;
            const isHovered = hoveredStage === stage.id;
            const highlighted = isActive || isHovered;
            const phase = phases.find((p) => p.stageIds.includes(stage.id));

            return (
              <div key={stage.id} style={{ display: "flex", alignItems: "stretch", flex: "1 1 0" }}>
                <button
                  onClick={() => setActiveStage(isActive ? null : stage.id)}
                  onMouseEnter={() => setHoveredStage(stage.id)}
                  onMouseLeave={() => setHoveredStage(null)}
                  style={{
                    flex: 1,
                    background: highlighted ? `${phase.color}12` : CARD_BG,
                    border: `1px solid ${highlighted ? phase.color : BORDER}`,
                    borderRadius: 8,
                    padding: "14px 10px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 115,
                    transition: "all 0.2s ease",
                    transform: highlighted ? "translateY(-4px)" : "none",
                    boxShadow: highlighted ? `0 8px 24px ${phase.color}22` : "none",
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: highlighted ? phase.color : "#222",
                      color: highlighted ? "#fff" : GRAY,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {stage.id}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: phase.color,
                      fontWeight: 600,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    {stage.toolIcon} {stage.tool}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: WHITE,
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {stage.label}
                  </div>
                  <div style={{ fontSize: 10, color: GRAY }}>{stage.duration}</div>
                </button>
                {i < stages.length - 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0 2px",
                      color: GRAY,
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        {activeStage &&
          (() => {
            const stage = stages.find((s) => s.id === activeStage);
            const phase = phases.find((p) => p.stageIds.includes(activeStage));
            return (
              <div
                style={{
                  marginTop: 16,
                  background: CARD_BG,
                  border: `1px solid ${phase.color}44`,
                  borderRadius: 12,
                  padding: "20px 24px",
                }}
              >
                <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 400px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span
                        style={{
                          background: phase.color,
                          color: "#fff",
                          padding: "3px 10px",
                          borderRadius: 4,
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        {phase.label.toUpperCase()} · STAGE {stage.id}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 700 }}>{stage.label}</span>
                    </div>
                    <p style={{ color: "#bbb", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{stage.detail}</p>
                  </div>
                  <div style={{ flex: "0 0 240px" }}>
                    <div
                      style={{ fontSize: 10, color: GRAY, letterSpacing: 2, fontWeight: 600, marginBottom: 8 }}
                    >
                      OUTPUTS
                    </div>
                    {stage.outputs.map((output, j) => (
                      <div
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "5px 0",
                          borderBottom: j < stage.outputs.length - 1 ? `1px solid ${BORDER}` : "none",
                        }}
                      >
                        <span style={{ color: phase.color, fontSize: 7 }}>●</span>
                        <span style={{ fontSize: 12, color: "#ccc" }}>{output}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}

        {/* PDE Insertion Point + Future Phases */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ height: 1, flex: 1, background: BORDER }} />
            <span style={{ fontSize: 10, color: GRAY, letterSpacing: 2, fontWeight: 600, whiteSpace: "nowrap" }}>
              WHAT COMES NEXT IN THE PRODUCT LIFECYCLE
            </span>
            <div style={{ height: 1, flex: 1, background: BORDER }} />
          </div>

          {/* PDE Trifecta callout */}
          <div
            style={{
              padding: "16px 20px",
              background: "#38BDF808",
              border: "1px solid #38BDF822",
              borderRadius: 8,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#38BDF815",
                border: "1px solid #38BDF833",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              🔧
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#38BDF8", marginBottom: 2 }}>
                PDE Insertion Point — Design & Engineering Join Here
              </div>
              <div style={{ fontSize: 12, color: "#999", lineHeight: 1.6 }}>
                Once prototyping validates the solution direction, the full Product–Design–Engineering trifecta builds
                production infrastructure, ensures design-system adherence, and handles edge cases at scale. Note that
                the broader PDE team can be looped in at any point upstream — this is essentially the latest milestone
                they should be added, depending on what is being built.
              </div>
            </div>
          </div>

          {/* Future phases row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {futurePhases.map((fp) => (
              <div
                key={fp.id}
                style={{
                  flex: "1 1 180px",
                  padding: "14px 16px",
                  background: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  borderTop: `2px solid ${fp.color}44`,
                  borderRadius: 8,
                  opacity: 0.7,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{fp.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: fp.color }}>{fp.label}</span>
                </div>
                <div style={{ fontSize: 11, color: GRAY, lineHeight: 1.5 }}>{fp.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Claude Project Flywheel */}
        <div
          style={{
            marginTop: 24,
            padding: "18px 22px",
            background: "#8B5CF618",
            border: "1px solid #8B5CF633",
            borderRadius: 10,
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#8B5CF622",
              border: "1px solid #8B5CF644",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            🔄
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#A78BFA", marginBottom: 3 }}>
              The Flywheel: Custom Claude Project
            </div>
            <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.7 }}>
              A dedicated Claude project serves as connective tissue across every stage. As each artifact is
              completed — research, strategy, presentation, prototype spec, reference images — it gets fed back into
              the project context. Every subsequent stage has richer context, so the build{" "}
              <span style={{ color: WHITE, fontWeight: 600 }}>accelerates over time</span>.
            </div>
          </div>
        </div>

        {/* Tool Legend */}
        <div
          style={{
            marginTop: 20,
            padding: "16px 20px",
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
          }}
        >
          <div style={{ fontSize: 10, color: GRAY, letterSpacing: 2, fontWeight: 600, marginBottom: 12 }}>
            TOOL STACK
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {toolLegend.map((tool) => (
              <div key={tool.name} style={{ display: "flex", alignItems: "center", gap: 8, flex: "1 1 160px" }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: `${tool.color}18`,
                    border: `1px solid ${tool.color}33`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {tool.icon}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: WHITE }}>{tool.name}</div>
                  <div style={{ fontSize: 10, color: GRAY }}>{tool.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div style={{ marginTop: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Total Calendar Time", value: "~1–2 Weeks", accent: ACCENT },
            { label: "Deliverables", value: "5+", accent: "#8B5CF6" },
            { label: "AI Tools Used", value: "7", accent: "#10B981" },
            { label: "Net-New Code Written", value: "Minimal", accent: "#EC4899" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                flex: "1 1 180px",
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                padding: "14px 16px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 800, color: stat.accent, marginBottom: 2 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 10, color: GRAY, letterSpacing: 1 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Philosophy footer */}
        <div
          style={{
            marginTop: 20,
            padding: "18px 22px",
            background: `${ACCENT}08`,
            border: `1px solid ${ACCENT}22`,
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 13, color: ACCENT, fontWeight: 700, marginBottom: 4 }}>
            The Philosophy
          </div>
          <div style={{ fontSize: 12, color: "#bbb", lineHeight: 1.7 }}>
            Start with a functional prototype, not a 40-page spec. Use AI to collapse the discovery-to-prototype
            cycle from weeks to days. The tools are plug-and-play — they'll change year to year. The process is the
            discipline: define the problem, form hypotheses, prototype solutions, iterate on feedback, bring in the
            PDE trifecta, test, launch, measure.
          </div>
        </div>
      </div>
    </div>
  );
}
