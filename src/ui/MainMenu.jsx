export default function MainMenu({ onEnter, onControls }) {
  return (
    <main className="menu">
      <div className="glow glowA" />
      <div className="glow glowB" />
      <div className="grid-glow" />

      <nav>
        <div className="brand">
          <span className="brandMark">CR</span>
          <span>CITY RUSH</span>
        </div>
        <span className="status"><i /> CITY SYSTEM ONLINE</span>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">PHASE 6 • MISSION SYSTEM</p>
          <h1>YOUR CITY.<br /><em>YOUR RIDE.</em><br />YOUR RUN.</h1>
          <p className="lead">
            Chandigarh is now a living driving playground. Traffic moves, pedestrians walk,
            and three timed missions turn the sector grid into a real route challenge.
          </p>

          <div className="actions">
            <button className="primary" onClick={onEnter}>
              ENTER CHANDIGARH <b>→</b>
            </button>
            <button className="secondary" onClick={onControls}>CONTROLS</button>
          </div>

          <div className="stats">
            <div><strong>03</strong><span>DRIVING MISSIONS</span></div>
            <div><strong>14</strong><span>CHECKPOINTS</span></div>
            <div><strong>110s</strong><span>LONGEST TIMER</span></div>
            <div><strong>P6</strong><span>MISSION SYSTEM</span></div>
          </div>
        </div>

        <aside className="mission-preview">
          <div className="preview-top">
            <span>CHANDIGARH // 01</span>
            <span className="live-dot"><i /> LIVE WORLD</span>
          </div>

          <div className="preview-map">
            <span className="road r1" /><span className="road r2" /><span className="road r3" />
            <span className="road r4" /><span className="road r5" />
            <span className="node n1" /><span className="node n2" /><span className="node n3" />
            <span className="node n4" /><span className="node n5" />
            <span className="route-line" />
            <div className="route-car">CR</div>
          </div>

          <div className="preview-title">
            <span>MISSION BOARD</span>
            <strong>FIRST RUN</strong>
            <small>Central boulevard loop • 90 sec</small>
          </div>

          <div className="preview-metrics">
            <div><b>14</b><span>TRAFFIC</span></div>
            <div><b>12</b><span>PEDESTRIANS</span></div>
            <div><b>₹500</b><span>REWARD PREVIEW</span></div>
          </div>
        </aside>
      </section>

      <footer>
        <span>CHANDIGARH • REWARI • GURUGRAM • DELHI</span>
        <span>v0.6.1 • POLISHED BUILD</span>
      </footer>
    </main>
  );
}
