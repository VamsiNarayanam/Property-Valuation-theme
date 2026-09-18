window.SPV = {
  site: {
    name: "Stackly Property Valuation",
    city: "Bengaluru",
    phone: "+91 80 4123 9080",
    whatsapp: "918041239080",
    desk: "desk@stacklyvaluation.demo",
    survey: "survey@stacklyvaluation.demo",
    gstin: "29AABCS1234A1ZX",
    ibbi: "IBBI/RV-E/02/2020/999",
    rera: "PRM/KA/RERA/1251/309/AG/2021/000999",
  },

  ticker: [
    ["SPV-214", "Residential", "Bengaluru", "On site"],
    ["SPV-211", "Bank panel", "Hyderabad", "Working papers"],
    ["SPV-209", "Industrial", "Pune", "Report issue"],
    ["SPV-205", "Commercial", "Mumbai", "Inspection booked"],
    ["SPV-201", "Portfolio", "Chennai", "Desktop review"],
    ["SPV-198", "Residential", "Bengaluru", "Invoice (GST)"],
    ["SPV-193", "Plant", "Ahmedabad", "On site"],
    ["SPV-188", "Agricultural", "Mysuru", "Archive"],
  ],

  lantern: [
    { img: "img/lantern-01.webp", w: 1100, h: 733, kicker: "Homeowner", count: 1860, label: "files filed since 2019", limit: "Opinion limited to stated purpose and inspection date." },
    { img: "img/lantern-02.webp", w: 1100, h: 733, kicker: "Bank panel", count: 42, label: "active lender panels", limit: "Panel work follows the bank’s format and timeline, not a listing brief." },
    { img: "img/lantern-03.webp", w: 1100, h: 733, kicker: "Developer", count: 128, label: "inventory / phase files", limit: "Phase opinions do not certify construction quality." },
    { img: "img/lantern-04.webp", w: 1100, h: 733, kicker: "Institution", count: 64, label: "trust, fund & campus files", limit: "Desktop reviews are labelled as such on the cover." },
  ],

  rail: [
    { img: "img/rail-01.webp", id: "SPV-074", year: "2026", title: "Whitefield row house", result: "Market value aligned to 2025 sale comps within 4%.", scope: "Residential · sale" },
    { img: "img/rail-02.webp", id: "SPV-081", year: "2026", title: "MG Road office floor", result: "Income approach held after vacancy adjustment.", scope: "Commercial · mortgage" },
    { img: "img/rail-03.webp", id: "SPV-066", year: "2025", title: "Peenya shed 2,400 sq.m", result: "Depreciated replacement cost filed for insurance.", scope: "Industrial · insurance" },
    { img: "img/rail-04.webp", id: "SPV-059", year: "2025", title: "Koramangala duplex", result: "Force-sale value set 12% below market.", scope: "Residential · bank panel" },
    { img: "img/rail-05.webp", id: "SPV-052", year: "2025", title: "Indiranagar bungalow", result: "Land residual tested against two FSI scenarios.", scope: "Residential · litigation" },
    { img: "img/rail-06.webp", id: "SPV-047", year: "2024", title: "Electronic City block", result: "Portfolio strip of 18 units, desktop plus sample inspect.", scope: "Portfolio · fund" },
    { img: "img/rail-07.webp", id: "SPV-041", year: "2024", title: "Roof drone — HSR", result: "Roof condition noted; not a structural certificate.", scope: "Residential · insurance" },
    { img: "img/rail-08.webp", id: "SPV-033", year: "2024", title: "Mysuru plot 1.8 acre", result: "Agricultural conversion risk disclosed on page 1.", scope: "Agricultural · sale" },
  ],

  process: [
    { img: "img/process-01.webp", title: "Instruction", copy: "Written purpose, asset class, fee, and GST. No verbal-only starts." },
    { img: "img/process-02.webp", title: "Site inspection", copy: "Measured survey, photographs, occupant access. Remote video where accepted." },
    { img: "img/process-03.webp", title: "Working papers", copy: "Comps, cost, income. Numbered revisions. Assumptions listed, not implied." },
    { img: "img/process-04.webp", title: "Report issue", copy: "Signed PDF, IBBI-style archive copy, GST invoice. File closed or restated." },
  ],

  articles: [
    { cat: "Method", img: "img/article-01.webp", date: "12 Aug 2026", title: "How we read a Bengaluru sale comp", excerpt: "Circle-rate is not market. We walk the last twelve registered sales." },
    { cat: "Bank", img: "img/article-02.webp", date: "28 Jul 2026", title: "Panel hours and what a lender actually files", excerpt: "Format, photographs, and the two values banks ask for." },
    { cat: "Industrial", img: "img/article-03.webp", date: "04 Jul 2026", title: "Sheds, cranage, and depreciated replacement", excerpt: "When cost approach leads, and when it must not." },
    { cat: "Method", img: "img/article-04.webp", date: "19 Jun 2026", title: "Desktop review: labelled, limited, dated", excerpt: "A cover that says desktop is not a site survey." },
    { cat: "Field", img: "img/article-05.webp", date: "02 Jun 2026", title: "Remote inspection protocol, 2026", excerpt: "Video walk-throughs we accept, and the measurements we still require." },
    { cat: "Field", img: "img/article-06.webp", date: "14 May 2026", title: "Drone roofs without pretending to be a structural engineer", excerpt: "What a roof shot can support in an insurance file." },
  ],

  demoUsers: {
    client: { name: "Asha Menon", email: "client@stackly.demo", pass: "client123", role: "client" },
    admin: { name: "Rahul Deshpande", email: "admin@stackly.demo", pass: "admin123", role: "admin" },
  },
};
