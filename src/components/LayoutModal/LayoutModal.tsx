import { useWorkflowStore } from '../../hooks/useWorkflowStore';

// Inline SVG icons — no external dependency needed
function IconLayoutTemplate() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="rgba(139,92,246,0.9)" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="rgba(139,92,246,0.5)" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="rgba(139,92,246,0.5)" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="rgba(139,92,246,0.3)" />
    </svg>
  );
}

function IconVertical() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="6" y="1" width="10" height="6" rx="2" fill="rgba(139,92,246,0.9)" />
      <rect x="6" y="9.5" width="10" height="5" rx="2" fill="rgba(139,92,246,0.55)" />
      <rect x="6" y="16.5" width="10" height="4" rx="2" fill="rgba(139,92,246,0.3)" />
      <line x1="11" y1="7" x2="11" y2="9.5" stroke="rgba(139,92,246,0.6)" strokeWidth="1.2" strokeDasharray="1.5 1" />
      <line x1="11" y1="14.5" x2="11" y2="16.5" stroke="rgba(139,92,246,0.45)" strokeWidth="1.2" strokeDasharray="1.5 1" />
    </svg>
  );
}

function IconHorizontal() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="1" y="6" width="6" height="10" rx="2" fill="rgba(52,211,153,0.9)" />
      <rect x="9.5" y="6" width="5" height="10" rx="2" fill="rgba(52,211,153,0.55)" />
      <rect x="16.5" y="6" width="4" height="10" rx="2" fill="rgba(52,211,153,0.3)" />
      <line x1="7" y1="11" x2="9.5" y2="11" stroke="rgba(52,211,153,0.6)" strokeWidth="1.2" strokeDasharray="1.5 1" />
      <line x1="14.5" y1="11" x2="16.5" y2="11" stroke="rgba(52,211,153,0.45)" strokeWidth="1.2" strokeDasharray="1.5 1" />
    </svg>
  );
}

export function LayoutModal() {
  const isLayoutChosen = useWorkflowStore((s) => s.isLayoutChosen);
  const setLayoutDirection = useWorkflowStore((s) => s.setLayoutDirection);
  const theme = useWorkflowStore((s) => s.theme);

  if (isLayoutChosen) return null;

  const isDark = theme !== 'light';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
      style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark ? 'rgba(5,7,20,0.82)' : 'rgba(241,245,249,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      />

      {/* Ambient orbs */}
      <div
        className="absolute pointer-events-none animate-pulse"
        style={{
          top: '10%', left: '15%',
          width: '42%', height: '42%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
          animationDuration: '5s',
        }}
      />
      <div
        className="absolute pointer-events-none animate-pulse"
        style={{
          bottom: '12%', right: '12%',
          width: '38%', height: '38%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
          animationDuration: '6s',
          animationDelay: '1.5s',
        }}
      />

      {/* ── Modal Card ───────────────────────────────────────── */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{ animation: 'trd-fade-up 0.45s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
          @keyframes trd-fade-up {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
          @keyframes trd-badge-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          .trd-layout-btn {
            transition: border-color 0.2s, background 0.2s, transform 0.15s;
          }
          .trd-layout-btn:hover {
            transform: translateY(-2px);
          }
          .trd-layout-btn:active {
            transform: translateY(0) scale(0.98);
          }
          .trd-layout-btn .trd-btn-icon {
            transition: box-shadow 0.3s, transform 0.2s;
          }
          .trd-layout-btn:hover .trd-btn-icon {
            transform: scale(1.07);
          }
          .trd-layout-btn.trd-purple:hover .trd-btn-icon {
            box-shadow: 0 0 24px 0 rgba(139,92,246,0.35);
          }
          .trd-layout-btn.trd-green:hover .trd-btn-icon {
            box-shadow: 0 0 24px 0 rgba(52,211,153,0.30);
          }
          .trd-layout-btn .trd-hover-glow {
            opacity: 0;
            transition: opacity 0.3s;
          }
          .trd-layout-btn:hover .trd-hover-glow {
            opacity: 1;
          }
        `}</style>

        <div
          style={{
            background: isDark ? 'rgba(14,17,35,0.92)' : 'rgba(255,255,255,0.95)',
            border: isDark ? '1px solid rgba(99,102,241,0.18)' : '1px solid rgba(99,102,241,0.2)',
            borderRadius: '28px',
            padding: '44px 40px 40px',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          {/* Header icon */}
          <div className="flex justify-center mb-5">
            <div
              style={{
                width: 52, height: 52,
                borderRadius: 16,
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <IconLayoutTemplate />
            </div>
          </div>

          {/* Title */}
          <h2
            className="text-center mb-2"
            style={{
              fontSize: 22, fontWeight: 600,
              color: isDark ? '#e8eaf6' : '#1e1b4b',
              letterSpacing: '-0.4px', margin: '0 0 8px',
            }}
          >
            Configure Canvas Layout
          </h2>
          <p
            className="text-center"
            style={{
              fontSize: 13, fontWeight: 400,
              color: isDark ? 'rgba(148,155,196,0.75)' : 'rgba(100,116,139,0.85)',
              margin: '0 0 28px',
            }}
          >
            Choose how nodes flow across your workflow canvas
          </p>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: isDark
                ? 'linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)',
              margin: '0 0 28px',
            }}
          />

          {/* Choice grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

            {/* Vertical */}
            <button
              onClick={() => setLayoutDirection('TB')}
              className="trd-layout-btn trd-purple"
              style={{
                background: isDark ? 'rgba(20,23,46,0.7)' : 'rgba(245,243,255,0.8)',
                border: isDark ? '1px solid rgba(99,102,241,0.2)' : '1px solid rgba(139,92,246,0.2)',
                borderRadius: 20,
                padding: '28px 16px 24px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                position: 'relative', overflow: 'hidden',
                fontFamily: 'inherit',
              }}
            >
              {/* Hover glow */}
              <div
                className="trd-hover-glow"
                style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  borderRadius: 20,
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 70%)',
                }}
              />
              <div
                className="trd-btn-icon"
                style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(139,92,246,0.15)',
                  border: '1px solid rgba(139,92,246,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <IconVertical />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: isDark ? '#c7cae8' : '#4c1d95', letterSpacing: '0.1px' }}>
                  Vertical
                </div>
                <div style={{ fontSize: 11, color: isDark ? 'rgba(120,126,168,0.65)' : 'rgba(109,40,217,0.5)', marginTop: 2 }}>
                  Top → Bottom
                </div>
              </div>
            </button>

            {/* Horizontal */}
            <button
              onClick={() => setLayoutDirection('LR')}
              className="trd-layout-btn trd-green"
              style={{
                background: isDark ? 'rgba(20,23,46,0.7)' : 'rgba(240,253,249,0.8)',
                border: isDark ? '1px solid rgba(52,211,153,0.15)' : '1px solid rgba(52,211,153,0.25)',
                borderRadius: 20,
                padding: '28px 16px 24px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
                position: 'relative', overflow: 'hidden',
                fontFamily: 'inherit',
              }}
            >
              {/* Hover glow */}
              <div
                className="trd-hover-glow"
                style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  borderRadius: 20,
                  background: 'radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.06) 0%, transparent 70%)',
                }}
              />
              <div
                className="trd-btn-icon"
                style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(52,211,153,0.12)',
                  border: '1px solid rgba(52,211,153,0.28)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <IconHorizontal />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: isDark ? '#c7cae8' : '#065f46', letterSpacing: '0.1px' }}>
                  Horizontal
                </div>
                <div style={{ fontSize: 11, color: isDark ? 'rgba(120,126,168,0.65)' : 'rgba(6,95,70,0.5)', marginTop: 2 }}>
                  Left → Right
                </div>
              </div>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}