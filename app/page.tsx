const coreRates = [
  ["Standard Cleaning", "EUR 25 - EUR 30 per hour"],
  ["Deep / Spring Cleaning", "EUR 200 - EUR 400 per visit"],
  ["End of Tenancy / Move-In-Out", "EUR 250 - EUR 450 flat rate"],
];

const bedroomFlatRates = [
  ["1-Bed Apartment", "EUR 200 - EUR 320"],
  ["2-Bedroom Home", "EUR 250 - EUR 400"],
  ["3-Bedroom Home", "EUR 350 - EUR 500"],
  ["4-Bedroom Home", "EUR 450 - EUR 650"],
];

const specializedAddOns = [
  ["Oven Cleaning", "EUR 40 - EUR 80"],
  ["Carpet Steam Cleaning", "EUR 1 - EUR 1.50 per sq. meter"],
  ["Internal/External Window Cleaning", "EUR 50 - EUR 100"],
  ["Mattress Cleaning", "EUR 30 - EUR 40 per mattress"],
];

const weeklyPlanRates = [
  ["Weekly", "EUR 30 - EUR 60 per hour"],
  ["Bi-weekly", "EUR 35 - EUR 65 per hour"],
  ["Monthly", "EUR 40 - EUR 70 per hour"],
];

const alternativeServiceRates = [
  ["Standard Cleaning", "EUR 15 - EUR 25 per hour"],
  ["Deep Cleaning", "EUR 25 - EUR 40 per hour"],
  ["Move-Out Cleaning", "EUR 200 - EUR 400 flat rate"],
  ["Weekly Cleaning", "EUR 50 - EUR 100 per visit"],
];

const alternativeAddOnRates = [
  ["Cleaning Carpets", "EUR 20 - EUR 60 per room"],
  ["Shiny Windows", "EUR 40 - EUR 90 for the whole house"],
  ["Couch Sprucing", "EUR 50 - EUR 100 per item"],
  ["Oven Scrubbing", "EUR 30 - EUR 50"],
  ["Fridge Defrosting", "EUR 20 - EUR 35"],
  ["Wall Washing", "EUR 50 - EUR 200"],
];

const propertyPackageRates = [
  ["Standard 2-Bedroom Home Cleaning", "EUR 70 - EUR 100"],
  ["Standard 3-Bedroom Home Cleaning", "EUR 90 - EUR 150"],
  ["Deep Cleaning for 2-Bedroom Home", "EUR 120 - EUR 200"],
  ["Deep Cleaning for 3-Bedroom Home", "EUR 150 - EUR 300"],
];

function PriceTable({
  title,
  rows,
  note,
}: {
  title: string;
  rows: string[][];
  note?: string;
}) {
  return (
    <article className="tableCard reveal">
      <h3>{title}</h3>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Estimated Cost (EUR)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([service, price]) => (
              <tr key={`${service}-${price}`}>
                <td>{service}</td>
                <td>{price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className="note">{note}</p> : null}
    </article>
  );
}

export default function Page() {
  return (
    <main className="site">
      <section className="hero reveal">
        <img src="/logo.jpeg" alt="Emerald Spotless logo" className="logo" />
        <p className="kicker">Domestic and Commercial Cleaning</p>
        <h1>Cleaning Price Guide</h1>
        <p className="summary">
          Market-rate estimates for Kildare and Leinster, covering standard cleans,
          deep cleans, move-out jobs, recurring visits, and specialist add-ons.
        </p>
      </section>

      <section className="grid">
        <PriceTable
          title="Core Domestic Rates"
          rows={coreRates}
          note="Typical rates vary by home size, condition, and level of detailing requested."
        />
        <PriceTable
          title="Flat-Rate Estimates By Property Size"
          rows={bedroomFlatRates}
          note="One-time deep cleans are often flat-rated from floor area and bedroom count."
        />
        <PriceTable
          title="Specialized Add-Ons"
          rows={specializedAddOns}
          note="Add-ons can be booked separately or bundled with a standard or spring clean."
        />
        <PriceTable
          title="Recurring Cleaning Frequency"
          rows={weeklyPlanRates}
          note="Regular bookings can reduce per-visit rates compared with one-off cleans."
        />
        <PriceTable
          title="Alternative Service Price Snapshot"
          rows={alternativeServiceRates}
          note="Additional market examples for comparing hourly and flat-rate offers."
        />
        <PriceTable
          title="Alternative Add-On Snapshot"
          rows={alternativeAddOnRates}
        />
        <PriceTable
          title="Package Price Examples"
          rows={propertyPackageRates}
          note="Flat-rate packages are useful when you want clear pricing before booking."
        />
      </section>

      <section className="footer reveal">
        <p>
          Clean spaces, brighter places. Request a tailored quote for an exact price
          based on your property and checklist.
        </p>
      </section>
    </main>
  );
}
