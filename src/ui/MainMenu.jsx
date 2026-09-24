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
        <p className="eyebrow">PHASE 4 • VEHICLE SYSTEM</p>
        <h1>
          YOUR CITY.<br />
          <em>YOUR RIDE.</em><br />
          YOUR RUN.
        </h1>
        <p className="lead">
          Step into Chandigarh and take the Civic Cruiser onto the boulevard.
          Walk the city, enter your car, steer through the sector grid and build
          toward the larger City Rush world.
        </p>

        <div className="actions">
          <button className="primary" onClick={onEnter}>
            ENTER CHANDIGARH <b>→</b>
          </button>
          <button className="secondary" onClick={onControls}>
            CONTROLS
          </button>
        </div>

        <div className="stats">
          <div><strong>16</strong><span>SECTORS ACTIVE</span></div>
          <div><strong>1</strong><span>DRIVABLE VEHICLE</span></div>
          <div><strong>4</strong><span>DRIVING CONTROLS</span></div>
          <div><strong>P4</strong><span>VEHICLE SYSTEM</span></div>
        </div>
      </section>

      <footer>
        <span>CHANDIGARH • REWARI • GURUGRAM • DELHI</span>
        <span>v0.4 PHASE 4</span>
      </footer>
    </main>
  );
}
