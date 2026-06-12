import type { Carrier, CarrierType, CarrierStatus, RiskLevel, DocumentStatus } from "./types";

const types: CarrierType[] = [
  "General Freight",
  "Refrigerated",
  "Hazmat",
  "Pharmaceutical",
  "Food Distribution",
  "Multi-Modal",
];

const seedNames = [
  "Apex Logistics",
  "BlueWave Freight",
  "Continental Cargo",
  "Delta Transport Co.",
  "EagleEye Hauling",
  "FastLane Carriers",
  "Globex Shipping",
  "Horizon Trucking",
  "Iron Mountain Freight",
  "Jetstream Logistics",
  "Keystone Distribution",
  "Liberty Carriers",
  "Meridian Freight",
  "Northstar Logistics",
  "Oceanic Cargo Lines",
  "Pioneer Trucking",
  "Quantum Freight",
  "Redwood Haulers",
  "Summit Logistics",
  "Titan Transport Group",
];

const addresses = [
  "Chicago, IL",
  "Dallas, TX",
  "Atlanta, GA",
  "Los Angeles, CA",
  "Newark, NJ",
  "Seattle, WA",
  "Denver, CO",
  "Miami, FL",
  "Phoenix, AZ",
  "Boston, MA",
];

const scorePool = [35, 42, 48, 58, 62, 68, 72, 78, 84, 87, 91, 95];
const statuses: CarrierStatus[] = ["Approved", "Pending", "Conditional", "Rejected"];

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function deriveRisk(score: number): RiskLevel {
  if (score >= 80) return "Low";
  if (score >= 60) return "Medium";
  return "High";
}

function deriveStatus(score: number, i: number): CarrierStatus {
  if (score >= 85) return "Approved";
  if (score >= 70) return i % 3 === 0 ? "Conditional" : "Approved";
  if (score >= 50) return "Pending";
  return i % 4 === 0 ? "Rejected" : "Pending";
}

function buildDocs(score: number, i: number) {
  const baseExpiry = (offsetDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0, 10);
  };
  const statusFor = (idx: number): DocumentStatus => {
    if (score >= 85) return idx === 3 && i % 5 === 0 ? "Pending" : "Verified";
    if (score >= 70) return idx === 2 ? "Pending" : "Verified";
    if (score >= 50) {
      if (idx === 0) return "Pending";
      if (idx === 4) return "Expired";
      return "Verified";
    }
    if (idx % 2 === 0) return "Missing";
    return "Expired";
  };
  const names = [
    "Insurance Certificate",
    "Operating License",
    "Safety Certificate",
    "Tax Document",
    "Vehicle Registration",
  ] as const;
  return names.map((n, idx) => ({
    name: n,
    status: statusFor(idx),
    expiryDate: baseExpiry(30 + idx * 60 - (score < 60 ? 200 : 0)),
  }));
}

export const carriers: Carrier[] = seedNames.map((name, i) => {
  const score = pick(scorePool, i + (i % 3));
  const status = deriveStatus(score, i);
  const risk = deriveRisk(score);
  const type = pick(types, i);
  const docs = buildDocs(score, i);
  const insuranceDoc = docs[0];
  const cap = {
    generalFreight: true,
    refrigerated: i % 2 === 0,
    hazmat: i % 4 === 0,
    pharmaceutical: i % 5 === 0,
    foodDistribution: i % 3 === 0,
  };
  const missing: string[] = [];
  if (cap.hazmat && score < 70) missing.push("Hazmat certification incomplete");
  if (insuranceDoc.status === "Expired") missing.push("Insurance certificate expired");
  if (docs[2].status !== "Verified") missing.push("Safety certificate pending verification");
  if (score < 60) missing.push("Driver background checks outdated");

  const recommendations: string[] = [];
  if (score < 85) recommendations.push("Renew insurance and upload updated COI");
  if (score < 75) recommendations.push("Complete safety training documentation");
  if (score < 65) recommendations.push("Update fleet maintenance records");

  const risks: string[] = [];
  if (risk === "High") risks.push("Multiple expired documents");
  if (risk !== "Low") risks.push("Insurance renewal due in <60 days");
  if (cap.hazmat && score < 80) risks.push("Hazmat compliance gap");

  return {
    id: `carrier-${i + 1}`,
    name,
    type,
    status,
    readinessScore: score,
    riskLevel: risk,
    insuranceStatus: insuranceDoc.status,
    lastUpdated: new Date(Date.now() - i * 86400000 * 2).toISOString().slice(0, 10),
    contactPerson: `${name.split(" ")[0]} Operations Lead`,
    email: `ops@${name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    phone: `+1 555-0${100 + i}`,
    address: pick(addresses, i),
    fleetSize: 25 + ((i * 17) % 220),
    coverageArea: i % 2 === 0 ? "Nationwide" : "Regional (Midwest & South)",
    capabilities: cap,
    documents: docs,
    readiness: {
      documentation: Math.max(20, score - 5 + (i % 6)),
      insurance: Math.max(15, score - 8 + (i % 5)),
      safety: Math.max(25, score - 3 + (i % 4)),
      capabilities: Math.max(30, score + 2 - (i % 7)),
    },
    riskIndicators: risks,
    missingRequirements: missing,
    recommendations,
  };
});

export const readinessCategory = (score: number) => {
  if (score >= 85) return { label: "Highly Ready", tone: "success" as const };
  if (score >= 70) return { label: "Ready", tone: "info" as const };
  if (score >= 50) return { label: "At Risk", tone: "warning" as const };
  return { label: "Critical", tone: "destructive" as const };
};

export const recentActivity = [
  { id: 1, type: "approval", text: "Apex Logistics approved by Compliance Officer", time: "2h ago" },
  { id: 2, type: "compliance", text: "Insurance certificate expired for Delta Transport Co.", time: "4h ago" },
  { id: 3, type: "readiness", text: "Horizon Trucking readiness updated to 87", time: "6h ago" },
  { id: 4, type: "approval", text: "Quantum Freight moved to Conditional Approval", time: "9h ago" },
  { id: 5, type: "compliance", text: "Safety certificate pending for Redwood Haulers", time: "1d ago" },
  { id: 6, type: "readiness", text: "Northstar Logistics flagged as At Risk", time: "1d ago" },
];

export const alerts = [
  { id: 1, severity: "high", text: "3 carriers have expired insurance certificates" },
  { id: 2, severity: "medium", text: "7 carriers awaiting compliance review" },
  { id: 3, severity: "high", text: "4 high-risk carriers require immediate attention" },
  { id: 4, severity: "low", text: "12 documents expiring in the next 60 days" },
];

export const riskTrend = [
  { month: "Jan", low: 8, medium: 6, high: 3 },
  { month: "Feb", low: 9, medium: 5, high: 4 },
  { month: "Mar", low: 10, medium: 6, high: 3 },
  { month: "Apr", low: 11, medium: 5, high: 2 },
  { month: "May", low: 12, medium: 6, high: 2 },
  { month: "Jun", low: 13, medium: 5, high: 2 },
];
