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
        <p className="eyebrow">PHASE 5 • TRAFFIC + NPC WORLD</p>
        <h1>
          YOUR CITY.<br />
          <em>YOUR RIDE.</em><br />
          YOUR RUN.
        </h1>
        <p className="lead">
          Chandigarh is no longer empty. Traffic moves through the boulevards,
          pedestrians walk the sidewalks and parks, and your Civic Cruiser can
          cut through a living first city slice.
        </p>

        <div className="actions">
          <button className="primary" onClick={onEnter}>ENTER CHANDIGARH <b>→</b></button>
          <button className="secondary" onClick={onControls}>CONTROLS</button>
        </div>

        <div className="stats">
          <div><strong>14</strong><span>TRAFFIC VEHICLES</span></div>
          <div><strong>12</strong><span>PEDESTRIAN NPCs</span></div>
          <div><strong>5</strong><span>ROAD AXES</span></div>
          <div><strong>P5</strong><span>LIVING CITY</span></div>
        </div>
      </section>

      <footer>
        <span>CHANDIGARH • REWARI • GURUGRAM • DELHI</span>
        <span>v0.5 PHASE 5</span>
      </footer>
    </main>
  );
}
