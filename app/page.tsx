"use client";

import { useState, useEffect, useRef, type ReactNode, type ReactElement } from "react";

/* ─── Design tokens ─────────────────────────────────────────── */
interface Token {
  primaryContainer: string;
  onPrimary: string;
  surface: string;
  surfaceContainerLowest: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  onSurface: string;
  secondary: string;
  outline: string;
  outlineVariant: string;
  surfaceVariant: string;
}

const token: Token = {
  primaryContainer: "#00f0ff",
  onPrimary: "#00363a",
  surface: "#10141a",
  surfaceContainerLowest: "#0a0e14",
  surfaceContainer: "#1c2026",
  surfaceContainerHigh: "#262a31",
  onSurface: "#dfe2eb",
  secondary: "#c1c7d0",
  outline: "#849495",
  outlineVariant: "#3b494b",
  surfaceVariant: "#31353c",
};

/* ─── Global styles injected once ───────────────────────────── */
const GlobalStyles = (): ReactElement => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background-color: #0d1117;
      background-image: radial-gradient(circle, #30363d 1px, transparent 1px);
      background-size: 24px 24px;
      color: #dfe2eb;
      font-family: 'Outfit', sans-serif;
    }

    .font-display  { font-family: 'Syne', sans-serif; }
    .font-headline { font-family: 'Syne', sans-serif; }
    .font-mono     { font-family: 'JetBrains Mono', monospace; }
    .font-body     { font-family: 'Outfit', sans-serif; }

    .scan-line {
      width: 100%; height: 2px;
      background: #00f0ff;
      position: absolute; bottom: 0; left: 0;
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.4s ease;
    }
    .project-card:hover .scan-line { transform: scaleX(1); }

    .glow-hover:hover {
      box-shadow: 0 0 15px rgba(0,240,255,0.3);
      border-color: #00f0ff !important;
    }

    .nav-link {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px; letter-spacing: 0.1em; font-weight: 500;
      text-decoration: none; padding-bottom: 4px;
      color: #c1c7d0; transition: color 0.3s;
    }
    .nav-link:hover, .nav-link.active { color: #00f0ff; border-bottom: 2px solid #00f0ff; }

    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center;
      padding: 16px 32px;
      background: #00f0ff; color: #00363a;
      font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
      text-decoration: none; text-transform: uppercase;
      border: 2px solid transparent; cursor: pointer;
      transition: box-shadow 0.3s, border-color 0.3s;
    }
    .btn-primary:hover { box-shadow: 0 0 15px rgba(0,240,255,0.3); border-color: #00f0ff; }

    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 16px 32px;
      border: 1px solid #00f0ff; color: #00f0ff;
      font-family: 'JetBrains Mono', monospace; font-size: 12px;
      letter-spacing: 0.1em; text-decoration: none; text-transform: uppercase;
      transition: background 0.3s, color 0.3s;
    }
    .btn-outline:hover { background: #00f0ff; color: #00363a; }

    .btn-outline-dim {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 16px 32px;
      border: 1px solid #3b494b; color: #c1c7d0;
      font-family: 'JetBrains Mono', monospace; font-size: 12px;
      letter-spacing: 0.1em; text-decoration: none; text-transform: uppercase;
      transition: border-color 0.3s, color 0.3s;
    }
    .btn-outline-dim:hover { border-color: #00f0ff; color: #00f0ff; }

    .tag {
      padding: 4px 12px;
      border: 1px solid #3b494b;
      font-family: 'JetBrains Mono', monospace; font-size: 14px;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #00f0ff; flex-shrink: 0; }

    .timeline-dot-active {
      position: absolute; left: -4px; top: 8px;
      width: 8px; height: 8px; border-radius: 50%;
      background: #00f0ff;
      box-shadow: 0 0 8px #00f0ff;
    }
    .timeline-dot {
      position: absolute; left: -4px; top: 8px;
      width: 8px; height: 8px; border-radius: 50%;
      background: #3b494b;
    }

    .ms { font-family: 'Material Symbols Outlined'; font-size: 36px; color: #00f0ff; }

    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .animate-pulse { animation: pulse 2s cubic-bezier(0.4,0,0.6,1) infinite; }

    @keyframes dash {
      to { stroke-dashoffset: -24; }
    }

    @media (max-width: 768px) {
      .hide-mobile { display: none !important; }
      .col-full { grid-column: 1 / -1 !important; }
    }
  `}</style>
);

/* ─── Project Card (video, with placeholder support) ─────────── */
interface ProjectCardVideoProps {
  src: string;
  poster?: string;
  version: string;
  title: string;
  desc: string;
  tags: string[];
  colSpan: number;
  offsetTop?: number;
  isActive: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

const VideoPlaceholder = (): ReactElement => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 12,
      background: `repeating-linear-gradient(135deg, ${token.surfaceContainerLowest}, ${token.surfaceContainerLowest} 10px, #0d1117 10px, #0d1117 20px)`,
    }}
  >
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6 }}>
      <rect x="2" y="2" width="20" height="20" rx="1" stroke={token.outline} strokeWidth="1.5" strokeDasharray="4 3">
        <animate attributeName="stroke-dashoffset" from="0" to="-14" dur="1.4s" repeatCount="indefinite" />
      </rect>
      <path d="M9 8l6 4-6 4V8z" fill={token.outline} />
    </svg>
    <span
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.15em",
        color: token.outline,
        textTransform: "uppercase",
      }}
    >
      Footage pending
    </span>
  </div>
);

const ProjectCardVideo = ({
  src,
  poster,
  version,
  title,
  desc,
  tags,
  colSpan,
  offsetTop,
  isActive,
  onHoverStart,
  onHoverEnd,
}: ProjectCardVideoProps): ReactElement => {
  const [hovered, setHovered] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = Boolean(src);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !hasVideo) return;
    if (isActive) {
      el.play().catch(() => {});
    } else {
      el.pause();
      el.currentTime = 0;
    }
  }, [isActive, hasVideo]);

  return (
    <div
      style={{ gridColumn: `span ${colSpan}`, marginTop: offsetTop || 0 }}
      onMouseEnter={() => {
        setHovered(true);
        onHoverStart();
      }}
      onMouseLeave={() => {
        setHovered(false);
        onHoverEnd();
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "16/9",
          overflow: "hidden",
          background: token.surfaceContainerLowest,
          cursor: "pointer",
          border: `1px solid ${hovered ? token.primaryContainer + "88" : token.outlineVariant + "55"}`,
          transition: "border-color 0.3s",
        }}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.5,
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.7s ease",
            }}
          />
        ) : (
          <VideoPlaceholder />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, #10141a 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            color: token.primaryContainer,
          }}
        >
          {version}
        </div>
        <div style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
          <h3
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 32,
              fontWeight: 600,
              color: token.primaryContainer,
              marginBottom: 8,
            }}
          >
            {title}
          </h3>
          {hovered && desc && (
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 16,
                lineHeight: 1.6,
                color: token.secondary,
                marginBottom: 16,
              }}
            >
              {desc}
            </p>
          )}
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: token.outline,
            }}
          >
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Reusable section label ─────────────────────────────────── */
interface SectionLabelProps {
  children: ReactNode;
}

const SectionLabel = ({ children }: SectionLabelProps): ReactElement => (
  <div
    style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      letterSpacing: "0.1em",
      fontWeight: 500,
      color: token.primaryContainer,
      marginBottom: 32,
    }}
  >
    {children}
  </div>
);

/* ─── Nav ────────────────────────────────────────────────────── */
type NavLinkId = "experience" | "projects" | "stack" | "contact";

const Nav = (): ReactElement => {
  const [active, setActive] = useState<NavLinkId>("experience");
  const links: NavLinkId[] = ["experience", "projects", "stack", "contact"];

  const scrollTo = (id: NavLinkId): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActive(id);
  };

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 50,
        background: "rgba(16,20,26,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${token.outlineVariant}44`,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "16px 64px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 20,
            fontWeight: 700,
            color: token.primaryContainer,
            letterSpacing: "-0.02em",
          }}
        >
          ROOT / DEV / ARCHITECT
        </span>

        <nav style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className={`nav-link${active === l ? " active" : ""}`}
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {l.toUpperCase()}
            </button>
          ))}
          <a
            href="/Odude_Adeife_Oluwadamilola_FlowCV_Resume.pdf"
            download
            style={{
              marginLeft: 16,
              padding: "8px 16px",
              border: `1px solid ${token.primaryContainer}`,
              color: token.primaryContainer,
              background: "none",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.1em",
              cursor: "pointer",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            DOWNLOAD_CV
          </a>
        </nav>
      </div>
    </header>
  );
};

/* ─── Hero ───────────────────────────────────────────────────── */
const Hero = (): ReactElement => (
  <section
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      paddingTop: 96,
    }}
  >
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 24 }}>
      <div style={{ gridColumn: "1 / 9" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14,
            color: token.primaryContainer,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: token.primaryContainer,
            }}
            className="animate-pulse"
          />
          2+ YEARS_EXPERIENCE // STATUS: OPEN_TO_WORK
        </div>

        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: token.primaryContainer,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Odude Adeife Oluwadamilola
        </h1>

        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.2,
            color: token.onSurface,
            marginBottom: 32,
          }}
        >
          Full-Stack Developer
        </div>

        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 18,
            lineHeight: 1.6,
            color: token.secondary,
            maxWidth: 520,
            marginBottom: 48,
          }}
        >
          Skilled across two ecosystems — JavaScript (React, Next.js, Node.js, Express,
          NestJS) and Java (Spring Boot, Vaadin) — building scalable, production-ready
          applications for fintech, governance, and enterprise platforms across Nigeria.
        </p>

        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <button
            className="btn-primary"
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Projects
          </button>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              letterSpacing: "0.1em",
              color: token.secondary,
              transition: "color 0.3s",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) =>
              (e.currentTarget.style.color = token.primaryContainer)
            }
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) =>
              (e.currentTarget.style.color = token.secondary)
            }
          >
            <span>CONTACT ME</span>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "inherit" }}>
              terminal
            </span>
          </button>
        </div>
      </div>

      {/* Terminal decoration */}
      <div
        style={{
          gridColumn: "9 / 13",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.4,
        }}
      >
        <div
          style={{
            width: "100%",
            aspectRatio: "1/1",
            border: `1px solid ${token.outlineVariant}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg,rgba(0,240,255,0.05),transparent)",
            }}
          />
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              padding: 32,
              lineHeight: 2,
              color: token.outline,
            }}
          >
            {(
              [
                ["$ sudo systemctl status portfolio", token.outline],
                ["● architect.service - Portfolio Daemon", token.primaryContainer],
                ["  Loaded: loaded (/lib/systemd/…)", token.outline],
                ["  Active: active (running)", "#4ade80"],
                ["  Main PID: 1024 (node)", token.outline],
                ["  Tasks: 12 (limit: 4915)", token.outline],
                ["  Memory: 45.2M", token.outline],
              ] as [string, string][]
            ).map(([text, color], i) => (
              <div key={i} style={{ color }}>
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ─── About ──────────────────────────────────────────────────── */
const About = (): ReactElement => (
  <section
    id="about"
    style={{
      padding: "120px 0",
      borderTop: `1px solid ${token.outlineVariant}33`,
    }}
  >
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 24 }}>
      <div style={{ gridColumn: "1 / 5" }}>
        <SectionLabel>// 01_BIOGRAPHY</SectionLabel>
      </div>
      <div style={{ gridColumn: "5 / 13" }}>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 48,
            fontWeight: 700,
            color: token.onSurface,
            marginBottom: 32,
          }}
        >
          Engineering with Precision
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            fontFamily: "'Outfit', sans-serif",
            fontSize: 18,
            lineHeight: 1.6,
            color: token.secondary,
          }}
        >
          <p>
            A Covenant University Computer Science graduate and former NYSC lecturer turned
            full-stack developer. I architect RESTful APIs, server-side logic, and
            component-driven UIs with technical ownership and clean code discipline at
            every stage of delivery.
          </p>
          <p>
            Based in Lagos, I've built fintech, governance, and enterprise platforms for
            organizations including <span style={{ color: token.primaryContainer }}>Stanbic IBTC</span>,{" "}
            <span style={{ color: token.primaryContainer }}>Dangote Group</span>,{" "}
            <span style={{ color: token.primaryContainer }}>CSCS</span>, and{" "}
            <span style={{ color: token.primaryContainer }}>RiskTech &amp; Advisory</span>,
            currently as a full-stack developer at{" "}
            <span style={{ color: token.primaryContainer }}>Purplegate Technologies</span> and{" "}
            <span style={{ color: token.primaryContainer }}>Integrated Software Services</span>.
          </p>
        </div>
      </div>
    </div>
  </section>
);

/* ─── Stack ──────────────────────────────────────────────────── */
interface StackGroup {
  label: string;
  items: string[];
}

const stackGroups: StackGroup[] = [
  { label: "Back-end", items: ["Spring Boot", "Node.js", "Next.js", "Django", "MySQL", "MSSQL", "MongoDB", "MariaDB", "Maven", "Liferay"] },
  { label: "Front-end", items: ["React", "Next.js", "Vaadin", "HTML", "CSS", "JavaScript"] },
];

const Stack = (): ReactElement => (
  <section
    id="stack"
    style={{
      padding: "120px 0",
      borderTop: `1px solid ${token.outlineVariant}33`,
    }}
  >
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 24 }}>
      <div style={{ gridColumn: "1 / 5" }}>
        <SectionLabel>// 02_TECH_STACK</SectionLabel>
      </div>
      <div
        style={{
          gridColumn: "5 / 13",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
        }}
      >
        {stackGroups.map(({ label, items }) => (
          <div key={label}>
            <h3
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: token.primaryContainer,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: 500,
                borderBottom: `1px solid ${token.outlineVariant}`,
                paddingBottom: 8,
                marginBottom: 24,
              }}
            >
              {label}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {items.map((t) => (
                <span key={t} className="tag">
                  <span className="tag-dot" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Projects data ──────────────────────────────────────────── */
// NOTE: every project below is wired up as a video card. Drop an .mp4 into
// /videos and set `src` to switch a card from the "Footage pending" placeholder
// to an autoplaying hover-preview.
interface ProjectItem {
  id: string;
  colSpan: number;
  offsetTop?: number;
  src: string; // leave empty to show the placeholder
  poster?: string;
  version: string;
  title: string;
  desc: string;
  tags: string[];
}

const projectItems: ProjectItem[] = [
  {
    id: "herconomy",
    colSpan: 7,
    src: "/videos/herconomy.mp4",
    version: "02/2026 — PRESENT",
    title: "Herconomy Admin Dashboard",
    desc: "Frontend for a savings and investment platform, built with Next.js and Tailwind CSS.",
    tags: ["Next.js", "Tailwind CSS"],
  },
  {
    id: "monsera",
    colSpan: 5,
    src: "/videos/monsera.mp4",
    version: "01/2026 — PRESENT",
    title: "Monsera Admin Dashboard",
    desc: "Role-based credit dashboard for electricity-bill financing across Admin, Aggregator, DisCo, and Finance House roles.",
    tags: ["Next.js", "Tailwind CSS", "PostgreSQL"],
  },
  {
    id: "cscs",
    colSpan: 5,
    src: "",
    version: "07/2026 — PRESENT",
    title: "CSCS Digital Platform",
    desc: "Back-office interfaces for Nigeria's premier Financial Market Infrastructure, handling depository and settlement operations.",
    tags: ["Next.js", "React", "TypeScript"],
  },
  {
    id: "phc-fms",
    colSpan: 7,
    src: "/videos/phc.mp4",
    version: "10/2026 — PRESENT",
    title: "PHC-FMS",
    desc: "Financial management platform for healthcare institutions across Nigeria, frontend and backend.",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
  },
  {
    id: "mbari-kola",
    colSpan: 7,
    src: "",
    version: "05/2026 — PRESENT",
    title: "Mbari Kola Admin Dashboard",
    desc: "Full-stack platform for a Pan-African cultural club — event management, member invitations, and inventory tracking.",
    tags: ["React", "PostgreSQL"],
  },
  {
    id: "expense-mgmt",
    colSpan: 5,
    src: "",
    version: "06/2026 — PRESENT",
    title: "Business Expense Management",
    desc: "Interfaces for businesses to manage expenses, monitor cash flow, and oversee finances end to end.",
    tags: ["Next.js", "React"],
  },
  {
    id: "dara",
    colSpan: 5,
    src: "/videos/dara.mp4",
    version: "06/2025 — PRESENT",
    title: "Dara",
    desc: "Backend for a platform bridging discerning customers with skilled service providers.",
    tags: ["Node.js", "REST APIs"],
  },
  {
    id: "boardmeet",
    colSpan: 7,
    src: "",
    version: "01/2025 — PRESENT",
    title: "Boardmeet",
    desc: "Authentication, database integration, and RESTful APIs for a board-meeting facilitation platform.",
    tags: ["Spring Boot", "Keycloak"],
  },
  {
    id: "boardseats",
    colSpan: 5,
    src: "/videos/boardseats.mp4",
    version: "06/2024 — PRESENT",
    title: "Boardseats",
    desc: "Platform connecting eligible candidates with organizations — MySQL access layer, stored procedures, optimized document retrieval.",
    tags: ["Liferay", "Spring Boot", "Vaadin", "MySQL"],
  },
  {
    id: "stanbic-grc",
    colSpan: 7,
    src: "/videos/stanbic-grc.mp4",
    version: "09/2024 — PRESENT",
    title: "Governance, Risk & Compliance Portal",
    desc: "Incident entry module for Stanbic IBTC's enterprise governance, risk, and compliance portal.",
    tags: ["Java EE", "PostgreSQL"],
  },
  {
    id: "plant-entry",
    colSpan: 5,
    src: "/videos/plant.mp4",
    version: "06/2024 — 10/2024",
    title: "Plant Entry",
    desc: "Plant-performance monitoring and reporting system for Dangote Fertilizers, with JPA/Hibernate data access.",
    tags: ["Spring Boot", "Vaadin", "MySQL"],
  },
  {
    id: "poc-projects",
    colSpan: 12,
    src: "",
    version: "11/2024 — 01/2025",
    title: "Proof of Concept Projects",
    desc: "Smart Home automation, a Stock Trading platform with predictive recommendations, and a Traffic Simulation engine — built solo as lead developer.",
    tags: ["Spring Boot", "Vaadin", "MySQL"],
  },
];

/* ─── Projects ───────────────────────────────────────────────── */
const Projects = (): ReactElement => {
  // id of the video that should currently be playing.
  // Defaults to the first project so the row autoplays on load once footage exists.
  const firstVideoId = projectItems[0]?.id ?? null;
  const [activeVideoId, setActiveVideoId] = useState<string | null>(firstVideoId);

  return (
    <section id="projects" style={{ padding: "120px 0", borderTop: `1px solid ${token.outlineVariant}33` }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 64,
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <SectionLabel>// 03_RELEVANT_WORKS</SectionLabel>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 700, color: token.onSurface }}>
            Architectural Catalog
          </h2>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: token.secondary }}>
          Total Projects Released: [{String(projectItems.length).padStart(2, "0")}]
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 24 }}>
        {projectItems.map((item) => (
          <ProjectCardVideo
            key={item.id}
            colSpan={item.colSpan}
            offsetTop={item.offsetTop}
            src={item.src}
            poster={item.poster}
            version={item.version}
            title={item.title}
            desc={item.desc}
            tags={item.tags}
            isActive={activeVideoId === item.id}
            onHoverStart={() => setActiveVideoId(item.id)}
            onHoverEnd={() => setActiveVideoId(firstVideoId)}
          />
        ))}
      </div>
    </section>
  );
};

/* ─── Experience ─────────────────────────────────────────────── */
interface ExperienceEntry {
  period: string;
  active: boolean;
  company: string;
  role: string;
  location: string;
  bullets?: string[];
  body?: string;
}

const experiences: ExperienceEntry[] = [
  {
    period: "10/2025 — PRESENT",
    active: true,
    company: "Purplegate Technologies",
    role: "Full-Stack Web Developer",
    location: "Remote",
    bullets: [
      "Collaborate with remote teams building scalable web apps with React, Next.js, Node.js, and NestJS.",
      "Build RESTful APIs, responsive UIs, and optimize application performance.",
    ],
  },
  {
    period: "04/2024 — PRESENT",
    active: true,
    company: "Integrated Software Services Limited",
    role: "Full-Stack Web Developer",
    location: "Surulere, Lagos State, Nigeria",
    bullets: [
      "Develop and maintain applications primarily with Spring Boot and Vaadin.",
      "Design and optimize MySQL schemas, configure JPA/Hibernate data access, and tune slow queries.",
      "Implement backup strategies and handle data migrations across environments.",
    ],
  },
  {
    period: "05/2023 — 04/2024",
    active: false,
    company: "Mater Dei Polytechnic",
    role: "Lecturer (National Youth Service)",
    location: "Ugwuoba, Enugu State, Nigeria",
    body: "Taught ND1 and ND2 students System Analysis and Design, Introduction to Programming with C, and Data Analysis and Design, plus extracurricular Java lessons.",
  },
  {
    period: "04/2021 — 10/2021",
    active: false,
    company: "Center for Information and Technical Support",
    role: "IT Support Intern",
    location: "Canaanland, Sango-Ota, Ogun State, Nigeria",
    body: "Gained hands-on experience across networking, technical support, and software development at Living Faith Church Headquarters, focusing on front-end skills with HTML, CSS, and JavaScript.",
  },
];

const Experience = (): ReactElement => (
  <section id="experience" style={{ padding: "120px 0", borderTop: `1px solid ${token.outlineVariant}33` }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", gap: 24 }}>
      <div style={{ gridColumn: "1 / 5" }}>
        <SectionLabel>// 04_CHRONOLOGY</SectionLabel>
      </div>
      <div style={{ gridColumn: "5 / 13", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 1,
            background: `${token.outlineVariant}55`,
          }}
        />
        {experiences.map((e, i) => (
          <div
            key={i}
            style={{
              paddingLeft: 40,
              marginBottom: i < experiences.length - 1 ? 64 : 0,
              position: "relative",
            }}
          >
            <div className={e.active ? "timeline-dot-active" : "timeline-dot"} />
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: e.active ? token.primaryContainer : token.secondary,
                marginBottom: 8,
              }}
            >
              {e.period}
            </div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 32,
                fontWeight: 600,
                color: token.onSurface,
              }}
            >
              {e.company}
            </h3>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 16,
                color: token.outline,
                marginBottom: 4,
              }}
            >
              {e.role}
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: token.outline,
                opacity: 0.7,
                marginBottom: 16,
              }}
            >
              {e.location}
            </div>
            {e.bullets ? (
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {e.bullets.map((b, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 16,
                      lineHeight: 1.6,
                      color: token.secondary,
                    }}
                  >
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", color: token.primaryContainer, flexShrink: 0 }}>
                      $
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.6, color: token.secondary }}>
                {e.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Contact ────────────────────────────────────────────────── */
const Contact = (): ReactElement => (
  <section
    id="contact"
    style={{
      padding: "120px 0 128px",
      borderTop: `1px solid ${token.outlineVariant}33`,
    }}
  >
    <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
      <SectionLabel>// 05_ESTABLISH_CONNECTION</SectionLabel>
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 48,
          fontWeight: 700,
          color: token.onSurface,
          marginBottom: 32,
        }}
      >
        Ready for Production?
      </h2>
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 18,
          lineHeight: 1.6,
          color: token.secondary,
          marginBottom: 48,
        }}
      >
        Let's discuss how we can build your next enterprise ecosystem.
        I am currently open to new architectural challenges and strategic partnerships.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        <a href="mailto:adeife.odude@stu.cu.edu.ng" className="btn-outline">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            mail
          </span>
          EMAIL_ADEIFE
        </a>
        <a href="https://wa.me/2347010701231" target="_blank" rel="noopener noreferrer" className="btn-outline-dim">
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            chat
          </span>
          WHATSAPP_SECURE
        </a>
      </div>
    </div>
  </section>
);

/* ─── Footer ─────────────────────────────────────────────────── */
const Footer = (): ReactElement => (
  <footer
    style={{
      background: token.surface,
      borderTop: `1px solid ${token.outlineVariant}33`,
    }}
  >
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "24px 64px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        opacity: 0.8,
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          letterSpacing: "0.1em",
          color: token.secondary,
        }}
      >
        ROOT / DEV / ARCHITECT
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: token.primaryContainer }}>
        © 2026 SYSTEM_ARCHITECT // BUILT_FOR_PERFORMANCE
      </span>
      <div style={{ display: "flex", gap: 32 }}>
        {(["GitHub", "LinkedIn", "Source"] as const).map((l) => (
          <a
            key={l}
            href="#"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              color: "#849495",
              textDecoration: "none",
              transition: "color 0.3s",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
              (e.currentTarget.style.color = token.primaryContainer)
            }
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#849495")}
          >
            {l}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

/* ─── Cursor glow ────────────────────────────────────────────── */
const CursorGlow = (): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent): void => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      style={{
        pointerEvents: "none",
        position: "fixed",
        zIndex: -1,
        width: 400,
        height: 400,
        background: "rgba(0,240,255,0.05)",
        borderRadius: "50%",
        filter: "blur(100px)",
        transform: "translate(-50%,-50%)",
      }}
    />
  );
};

/* ─── App ────────────────────────────────────────────────────── */
export default function App(): ReactElement {
  return (
    <>
      <GlobalStyles />
      <CursorGlow />
      <Nav />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 64px" }}>
        <Hero />
        <About />
        <Stack />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}