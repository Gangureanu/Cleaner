export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        display: "grid",
        placeItems: "center",
        padding: "32px 20px",
        background: "linear-gradient(160deg, #eef6ff 0%, #f6fbf7 100%)",
        color: "#163249",
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <section
        style={{
          width: "min(980px, 100%)",
          background: "#ffffff",
          border: "1px solid #d8e6f1",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 14px 40px rgba(27, 63, 89, 0.12)",
          textAlign: "center",
        }}
      >
        <img
          src="/cleaning-maintenance.svg"
          alt="Cleaning company under construction"
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "14px",
            marginBottom: "20px",
          }}
        />
        <pre
          style={{
            margin: 0,
            whiteSpace: "pre-wrap",
            fontSize: "clamp(1.4rem, 2.8vw, 2.1rem)",
            lineHeight: 1.45,
            fontWeight: 700,
          }}
        >
{`Kildare based
All Leinster in operation
Contractors cleaning :

Commercial
Domestic
Private Property’s
Sport Clubs Associations
Local Community’s Activities

Coming soon
Work in progress`}
        </pre>
      </section>
    </main>
  );
}
