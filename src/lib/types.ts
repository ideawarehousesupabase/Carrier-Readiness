export type UserRole = "Transport Manager" | "Compliance Officer" | "Operations Manager";

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

export type CarrierStatus = "Approved" | "Pending" | "Conditional" | "Rejected";
export type RiskLevel = "Low" | "Medium" | "High";
export type DocumentStatus = "Verified" | "Pending" | "Expired" | "Missing";
export type CarrierType =
  | "General Freight"
  | "Refrigerated"
  | "Hazmat"
  | "Pharmaceutical"
  | "Food Distribution"
  | "Multi-Modal";

export interface CarrierDocument {
  name:
    | "Insurance Certificate"
    | "Operating License"
    | "Safety Certificate"
    | "Tax Document"
    | "Vehicle Registration";
  status: DocumentStatus;
  expiryDate: string;
}

export interface Carrier {
  id: string;
  name: string;
  type: CarrierType;
  status: CarrierStatus;
  readinessScore: number;
  riskLevel: RiskLevel;
  insuranceStatus: DocumentStatus;
  lastUpdated: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  fleetSize: number;
  coverageArea: string;
  capabilities: {
    generalFreight: boolean;
    refrigerated: boolean;
    hazmat: boolean;
    pharmaceutical: boolean;
    foodDistribution: boolean;
  };
  documents: CarrierDocument[];
  readiness: {
    documentation: number;
    insurance: number;
    safety: number;
    capabilities: number;
  };
  riskIndicators: string[];
  missingRequirements: string[];
  recommendations: string[];
}
