export default function MainMenu({ onEnter, onControls }) {
  return (
    <main className="menu">
      <div className="glow glowA" />
      <div className="glow glowB" />

      <nav>
        <div className="brand">
          <span className="brandMark">CR</span>
          <span>CITY RUSH</span>
        </div>
        <span className="status"><i /> CITY SYSTEM ONLINE</span>
      </nav>

      <section className="hero">
        <p className="eyebrow">PHASE 6 • MISSION SYSTEM</p>
        <h1>
          YOUR CITY.<br />
          <em>YOUR RIDE.</em><br />
          YOUR RUN.
        </h1>
        <p className="lead">
          Chandigarh is now a proper playground. Traffic moves, pedestrians walk,
          and three timed driving missions turn the first city slice into a real challenge.
          Hit every glowing checkpoint and finish the route before the clock reaches zero.
        </p>

        <div className="actions">
          <button className="primary" onClick={onEnter}>ENTER CHANDIGARH <b>→</b></button>
          <button className="secondary" onClick={onControls}>CONTROLS</button>
        </div>

        <div className="stats">
          <div><strong>03</strong><span>DRIVING MISSIONS</span></div>
          <div><strong>14</strong><span>CHECKPOINTS</span></div>
          <div><strong>110s</strong><span>LONGEST TIMER</span></div>
          <div><strong>P6</strong><span>MISSION SYSTEM</span></div>
        </div>
      </section>

      <footer>
        <span>CHANDIGARH • REWARI • GURUGRAM • DELHI</span>
        <span>v0.6 PHASE 6</span>
      </footer>
    </main>
  );
}
