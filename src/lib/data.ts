import { prisma } from "./prisma";
import { cache } from "react";

export const getUnits = cache(async (propertyId = 1) => {
  return prisma.unit.findMany({
    where: { propertyId },
    orderBy: { id: "asc" },
  });
});

export type Metrics = {
  totalUnits: number;
  occupied: number;
  vacant: number;
  ownerOccupied: number;
  notReady: number;
  rentDue: number;
  rentPaid: number;
  levyDue: number;
  levyPaid: number;
  commission: number;
  expenses: number;
  deposits: number;
  arrears: number;
  netPosition: number;
  occupancyRate: number;
  collectionRate: number;
  openMaintenance: number;
  criticalMaintenance: number;
  totalTenants: number;
  tenantsPaidInFull: number;
  totalMaintenanceCost: number;
};

export type LeaseReview = {
  tenantId: number;
  tenantName: string;
  unitName: string;
  totalMonths: number;
  monthsPaid: number;
  monthsPaidInFull: number;
  onTimeRate: number;
  totalRentDue: number;
  totalRentPaid: number;
  outstandingBalance: number;
  maintenanceCount: number;
  lastPaymentMonth: string;
};

export async function getCrmData(propertyId = 1, month = "2026-06") {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });
  const units = await prisma.unit.findMany({
    where: { propertyId },
    orderBy: { id: "asc" },
  });
  const tenants = await prisma.tenant.findMany({
    where: { propertyId },
    orderBy: { id: "asc" },
  });
  const rentRoll = await prisma.rentRoll.findMany({
    where: { propertyId, month },
    orderBy: { id: "asc" },
  });
  const allRentRoll = await prisma.rentRoll.findMany({
    where: { propertyId },
    orderBy: { month: "asc" },
  });
  const expenses = await prisma.expense.findMany({
    where: { propertyId, month },
    orderBy: { id: "asc" },
  });
  const deposits = await prisma.deposit.findMany({
    where: { propertyId },
    orderBy: { id: "asc" },
  });
  const maintenance = await prisma.maintenanceLog.findMany({
    where: { propertyId },
    orderBy: { id: "asc" },
  });

  const tenantsPaidInFull = rentRoll.filter(
    (r) => r.rentPaid >= r.rentDue && r.levyPaid >= r.levyDue,
  ).length;

  const metrics: Metrics = {
    totalUnits: units.length,
    occupied: units.filter((u) => u.status === "Occupied").length,
    vacant: units.filter((u) => u.status === "Vacant").length,
    ownerOccupied: units.filter((u) => u.status === "Owner Occupied").length,
    notReady: units.filter((u) => u.status === "Not Ready").length,
    rentDue: rentRoll.reduce((s, r) => s + r.rentDue, 0),
    rentPaid: rentRoll.reduce((s, r) => s + r.rentPaid, 0),
    levyDue: rentRoll.reduce((s, r) => s + r.levyDue, 0),
    levyPaid: rentRoll.reduce((s, r) => s + r.levyPaid, 0),
    commission: rentRoll.reduce((s, r) => s + r.commissionAmount, 0),
    expenses: expenses
      .filter((e) => e.currency === "USD")
      .reduce((s, e) => s + e.amount, 0),
    deposits: deposits
      .filter((d) => d.currency === "USD")
      .reduce((s, d) => s + d.amount, 0),
    arrears: 0,
    netPosition: 0,
    occupancyRate: 0,
    collectionRate: 0,
    openMaintenance: maintenance.filter(
      (m) => m.status === "Open" || m.status === "In Progress",
    ).length,
    criticalMaintenance: maintenance.filter((m) => m.priority === "Critical")
      .length,
    totalTenants: tenants.length,
    tenantsPaidInFull,
    totalMaintenanceCost: maintenance.reduce((s, m) => s + m.estimatedCost, 0),
  };
  metrics.arrears =
    metrics.rentDue - metrics.rentPaid + (metrics.levyDue - metrics.levyPaid);
  metrics.netPosition =
    metrics.rentPaid +
    metrics.levyPaid -
    metrics.commission -
    metrics.expenses;
  metrics.occupancyRate =
    metrics.totalUnits > 0
      ? Math.round((metrics.occupied / metrics.totalUnits) * 100 * 10) / 10
      : 0;
  metrics.collectionRate =
    metrics.rentDue > 0
      ? Math.round((metrics.rentPaid / metrics.rentDue) * 100 * 10) / 10
      : 0;

  const unitMap = Object.fromEntries(units.map((u) => [u.id, u.unitName]));
  const tenantMap = Object.fromEntries(
    tenants.map((t) => [t.id, t.tenantName]),
  );

  const leaseReviews: LeaseReview[] = tenants.map((t) => {
    const tenantEntries = allRentRoll.filter((r) => r.tenantId === t.id);
    const monthsPaid = tenantEntries.filter((r) => r.rentPaid > 0).length;
    const monthsPaidInFull = tenantEntries.filter(
      (r) => r.rentPaid >= r.rentDue && r.levyPaid >= r.levyDue,
    ).length;
    const totalRentDue = tenantEntries.reduce((s, r) => s + r.rentDue, 0);
    const totalRentPaid = tenantEntries.reduce((s, r) => s + r.rentPaid, 0);
    const outstandingBalance =
      totalRentDue -
      totalRentPaid +
      (tenantEntries.reduce((s, r) => s + r.levyDue, 0) -
        tenantEntries.reduce((s, r) => s + r.levyPaid, 0));
    const lastPaid = [...tenantEntries]
      .reverse()
      .find((r) => r.rentPaid > 0);

    const tenantUnits = units.filter((u) => u.id === t.unitId);
    const maintenanceCount = maintenance.filter((m) =>
      tenantUnits.some((u) => u.id === m.unitId),
    ).length;

    return {
      tenantId: t.id,
      tenantName: t.tenantName,
      unitName: unitMap[t.unitId] ?? "",
      totalMonths: tenantEntries.length,
      monthsPaid,
      monthsPaidInFull,
      onTimeRate:
        tenantEntries.length > 0
          ? Math.round((monthsPaidInFull / tenantEntries.length) * 100)
          : 0,
      totalRentDue,
      totalRentPaid,
      outstandingBalance,
      maintenanceCount,
      lastPaymentMonth: lastPaid?.month ?? "—",
    };
  });

  return {
    property,
    units,
    tenants,
    rentRoll,
    allRentRoll,
    expenses,
    deposits,
    maintenance,
    month,
    metrics,
    unitMap,
    tenantMap,
    leaseReviews,
  };
}
