export interface Partner {
  id: string;
  name: string;
  type: string;
  neighborhood: string;
  address: string;
  lat: number;
  lng: number;
  perk: string;
  perkLong: string;
  start: string;
  end: string;
  desc: string;
  cover: string;
  accent: string;
}

export const PARTNERS: Partner[] = [
  {
    id: "kabisera",
    name: "Binondo by Kabisera",
    type: "Restaurant",
    neighborhood: "Lower East Side · Manhattan",
    address: "50 E Broadway, New York, NY 10002",
    lat: 40.7140, lng: -73.9970,
    perk: "20% off the whole table",
    perkLong: "20% off the entire bill",
    start: "Jun 13", end: "Jun 20, 2026",
    desc: "Modern kamayan tasting menu by Chef Vince Mendoza — pancit palabok, kare-kare, lechon kawali served family-style under paper lanterns.",
    cover: "linear-gradient(160deg, #c3552a, #1d2412)",
    accent: "#c3552a"
  },
  {
    id: "halohalo",
    name: "Halo Halo House",
    type: "Café",
    neighborhood: "Carroll Gardens · Brooklyn",
    address: "412 Court St, Brooklyn, NY 11231",
    lat: 40.6810, lng: -73.9970,
    perk: "Free halo-halo with any drink",
    perkLong: "Complimentary halo-halo with any drink purchase",
    start: "Jun 13", end: "Jun 14, 2026",
    desc: "Ube soft serve, calamansi sodas, and Trish's grandmother's halo-halo recipe — shaved ice, coconut strings, leche flan and the works.",
    cover: "linear-gradient(160deg, #7a9460, #2e4121)",
    accent: "#7a9460"
  },
  {
    id: "tinapay",
    name: "Tinapay Bakeshop",
    type: "Bakery",
    neighborhood: "Sunnyside · Queens",
    address: "43-22 Greenpoint Ave, Sunnyside, NY 11104",
    lat: 40.7430, lng: -73.9180,
    perk: "Buy one ensaymada, get one",
    perkLong: "Buy one ensaymada, get the second free",
    start: "Jun 12", end: "Jun 13, 2026",
    desc: "Family bakery run by the Aquino sisters — pan de sal at 5am, ube ensaymada by noon, brewed barako on the counter from open till close.",
    cover: "linear-gradient(160deg, #dddc05, #3f5630)",
    accent: "#dddc05"
  },
  {
    id: "pamana",
    name: "Pamana Coffee",
    type: "Café",
    neighborhood: "Park Slope · Brooklyn",
    address: "318 5th Ave, Brooklyn, NY 11215",
    lat: 40.6735, lng: -73.9840,
    perk: "Two-for-one brewed coffee",
    perkLong: "Two-for-one on any brewed coffee, all day",
    start: "Jun 13", end: "Jun 13, 2026",
    desc: "Single-origin Sagada and Benguet beans, roasted in-house. The reading corner has a stack of diaspora chapbooks you can take home.",
    cover: "linear-gradient(160deg, #556f41, #1d2412)",
    accent: "#556f41"
  },
  {
    id: "adobo-co",
    name: "Adobo + Co",
    type: "Restaurant",
    neighborhood: "Bushwick · Brooklyn",
    address: "1241 Myrtle Ave, Brooklyn, NY 11221",
    lat: 40.6960, lng: -73.9230,
    perk: "Half-off Red Horse pitchers",
    perkLong: "Half off Red Horse pitchers — limit two per table",
    start: "Jun 13", end: "Jun 13, 2026",
    desc: "Late-night adobo and sizzling sisig in the back of a record shop. Live OPM on the speakers most nights, kanto-style stools out front.",
    cover: "linear-gradient(160deg, #c3552a, #2e4121)",
    accent: "#c3552a"
  },
  {
    id: "tela",
    name: "Tela Studio",
    type: "Boutique",
    neighborhood: "Williamsburg · Brooklyn",
    address: "215 N 6th St, Brooklyn, NY 11211",
    lat: 40.7180, lng: -73.9605,
    perk: "25% off handwoven goods",
    perkLong: "25% off all handwoven textiles & ready-to-wear",
    start: "Jun 13", end: "Jun 27, 2026",
    desc: "Inabel, t'nalak, and piña-silk garments sourced direct from weaving co-operatives in Ilocos and Lake Sebu. Mention In Bituin at the counter.",
    cover: "linear-gradient(160deg, #dddc05, #556f41)",
    accent: "#dddc05"
  },
  {
    id: "mga-awit",
    name: "Mga Awit Records",
    type: "Shop",
    neighborhood: "East Village · Manhattan",
    address: "112 St Marks Pl, New York, NY 10009",
    lat: 40.7280, lng: -73.9855,
    perk: "10% off OPM vinyl",
    perkLong: "10% off any OPM, kundiman or Pinoy rock vinyl",
    start: "Jun 13", end: "Jun 14, 2026",
    desc: "Crates of kundiman, Pinoy rock and Manila sound 7-inches, plus a small zine wall. The owner will play anything you ask, twice.",
    cover: "linear-gradient(160deg, #1d2412, #556f41)",
    accent: "#7a9460"
  },
  {
    id: "lolas-garden",
    name: "Lola's Garden Bar",
    type: "Bar",
    neighborhood: "Astoria · Queens",
    address: "31-12 Broadway, Astoria, NY 11106",
    lat: 40.7640, lng: -73.9230,
    perk: "Free pulutan with two drinks",
    perkLong: "Free chicharon pulutan with any two cocktails",
    start: "Jun 13", end: "Jun 13, 2026",
    desc: "Calamansi sours, lambanog flights and a backyard strung with capiz lights. The kitchen sends out chicharon, kwek-kwek and isaw till midnight.",
    cover: "linear-gradient(160deg, #c3552a, #1d2412)",
    accent: "#c3552a"
  }
];
