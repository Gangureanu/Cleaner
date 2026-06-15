export default function LocationPage() {
  return (
    <main className="site">
      <section className="hero reveal">
        <p className="kicker">Where We Work</p>
        <h1>Kildare Based, Leinster Wide</h1>
        <p className="summary">
          We operate from Kildare and serve homes and businesses across Leinster,
          including regular routes for one-off and recurring cleaning jobs.
        </p>
      </section>

      <section className="grid twoCol">
        <article className="panelCard reveal">
          <h3>Core Coverage</h3>
          <ul className="cleanList">
            <li>County Kildare</li>
            <li>Dublin</li>
            <li>Wicklow</li>
            <li>Meath</li>
            <li>Louth</li>
            <li>Westmeath</li>
          </ul>
        </article>

        <article className="panelCard reveal">
          <h3>Property Types</h3>
          <ul className="cleanList">
            <li>Domestic homes and apartments</li>
            <li>Commercial units and offices</li>
            <li>Private properties and landlords</li>
            <li>Sports clubs and associations</li>
            <li>Community and local activity spaces</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
