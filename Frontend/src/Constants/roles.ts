export const Roles = {
  Admin: "Admin",
  FinancialAnalyst: "FinancialAnalyst",
  Collaborator: "Collaborator",
};
export type Role = keyof typeof Roles;