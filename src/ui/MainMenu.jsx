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
        <p className="eyebrow">PHASE 3 • FIRST REAL CITY</p>
        <h1>
          YOUR CITY.<br />
          <em>YOUR RIDE.</em><br />
          YOUR RUN.
        </h1>
        <p className="lead">
          Welcome to the first City Rush district. Explore a Chandigarh-inspired
          sector grid with wide boulevards, green parks, roundabouts and a growing
          city skyline.
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
          <div><strong>36</strong><span>SECTORS PLANNED</span></div>
          <div><strong>3D</strong><span>REAL-TIME CITY</span></div>
          <div><strong>P3</strong><span>FIRST CITY ONLINE</span></div>
        </div>
      </section>

      <footer>
        <span>CHANDIGARH • REWARI • GURUGRAM • DELHI</span>
        <span>v0.3 PHASE 3</span>
      </footer>
    </main>
  );
}
