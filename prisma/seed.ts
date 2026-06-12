import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma-client/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const existing = await prisma.property.findFirst({
    where: { name: "The Courtyard Complex" },
  });

  if (!existing) {
  const property = await prisma.property.create({
    data: {
      name: "The Courtyard Complex",
      address: "Glenara, Highlands, Harare",
      propertyType: "Mixed-use commercial complex",
      manager: "Neville Mupunga",
      owner: "Landlord",
      notes: "17 units, cafe, bar, restaurant and Whitehouse.",
    },
  });

  const unitData: [string, string, string, number, number, string][] = [
    ["Unit 1","Retail","Vacant",0,80,"Offer for Units 1 and 2 intending to operate a butchery."],
    ["Unit 2","Retail","Vacant",0,80,"Offer for Units 1 and 2 intending to operate a butchery."],
    ["Unit 3","Retail","Occupied",600,80,"Modernly Modest Brides."],
    ["Unit 4","Retail","Occupied",650,80,"Luna's Shop. Arrears issue."],
    ["Unit 5","Retail","Occupied",0,80,"Alvatron Electronics. Arrears and reconciliation required."],
    ["Unit 6","Retail","Occupied",730,80,"Birdie Bling."],
    ["Unit 7","Retail","Occupied",700,80,"Laura's Scent."],
    ["Unit 8","Retail","Occupied",650,80,"Speed Blu."],
    ["Unit 9","Retail","Occupied",0,80,"Queens Crown. Previous month rental paid; current outstanding levy only."],
    ["Unit 10","Retail","Occupied",650,80,"Elsie The Makeup Artist."],
    ["Unit 11","Retail","Occupied",650,80,"Crimelock Security."],
    ["Unit 12","Retail","Occupied",650,80,"Up to date. No commission charged."],
    ["Unit 13","Retail","Owner Occupied",0,0,"Owner occupied."],
    ["Unit 14","Retail","Vacant",0,80,"Vacant with expected offer."],
    ["Unit 15","Retail","Owner Occupied",0,0,"Proposed VR gaming."],
    ["Unit 16","Retail","Not Ready",0,0,"Vacant and not ready for occupation."],
    ["Unit 17","Retail","Not Ready",0,0,"Vacant and not ready for occupation."],
    ["Whitehouse","House / Office","Vacant",0,0,"Vacant."],
    ["Cafe","Cafe","Occupied",1200,0,"Rental paid to Courtyard for operational expenses."],
    ["Restaurant","Restaurant","Owner Occupied",0,0,"Owner occupied."],
    ["Bar","Bar","Vacant",1300,0,"Prospect available at USD1,300 rental."],
  ];

  const unitRecords: Record<string, { id: number }> = {};
  for (const row of unitData) {
    const unit = await prisma.unit.create({
      data: {
        propertyId: property.id,
        unitName: row[0],
        useType: row[1],
        status: row[2],
        monthlyRent: row[3],
        monthlyLevy: row[4],
        notes: row[5],
      },
    });
    unitRecords[row[0]] = unit;
  }

  const tenantData: [string, string, string, string, boolean, string][] = [
    ["Modernly Modest Brides","Modernly Modest Brides","Unit 3","Bridal",true,"brides@example.com"],
    ["Luna's Shop","Luna's Shop","Unit 4","Retail",true,"luna@example.com"],
    ["Alvatron Electronics","Alvatron Electronics","Unit 5","Electronics",true,"alvatron@example.com"],
    ["Birdie Bling","Birdie Bling","Unit 6","Retail",true,"birdie@example.com"],
    ["Laura's Scent","Laura's Scent","Unit 7","Fragrance",true,"laura@example.com"],
    ["Speed Blu","Speed Blu","Unit 8","Retail",true,"speed@example.com"],
    ["Queens Crown","Queens Crown","Unit 9","Retail",true,"queens@example.com"],
    ["Elsie The Makeup Artist","Elsie The Makeup Artist","Unit 10","Beauty",true,"elsie@example.com"],
    ["Crimelock Security","Crimelock Security","Unit 11","Security",true,"crimelock@example.com"],
    ["Unit 12 Tenant","Unit 12","Unit 12","Retail",false,""],
    ["Cafe Operator","Cafe","Cafe","Cafe",true,"cafe@example.com"],
  ];

  const tenantRecords: Record<string, { id: number; commissionRate: number; unitId: number }> = {};
  for (const [name, trading, unitName, btype, comm, email] of tenantData) {
    const rate = comm ? 0.1 : 0;
    const tenant = await prisma.tenant.create({
      data: {
        propertyId: property.id,
        unitId: unitRecords[unitName].id,
        tenantName: name,
        tradingName: trading,
        businessType: btype,
        commissionApplicable: comm,
        commissionRate: rate,
        email,
      },
    });
    tenantRecords[name] = { id: tenant.id, commissionRate: rate, unitId: tenant.unitId };
  }

  const rentData: [string, number, number, number, number, string, string][] = [
    ["Modernly Modest Brides",600,600,80,80,"#0032","Paid. USD50 previous month Whitehouse use discontinued."],
    ["Luna's Shop",650,0,80,0,"#0023","Outstanding USD70 landlord balance, USD130 commission and USD160 levies noted."],
    ["Alvatron Electronics",0,0,80,0,"","In arrears. Reconciliation required."],
    ["Birdie Bling",730,730,80,80,"","Paid."],
    ["Laura's Scent",700,700,80,80,"","Paid."],
    ["Speed Blu",650,650,80,80,"","Paid."],
    ["Queens Crown",0,0,80,0,"","Previous month rental paid. Outstanding USD80 levies."],
    ["Elsie The Makeup Artist",650,650,80,80,"","Paid."],
    ["Crimelock Security",650,650,80,80,"","Paid."],
    ["Unit 12 Tenant",650,650,80,80,"","Up to date. No commission."],
    ["Cafe Operator",1200,1200,0,0,"","Rental paid to Courtyard for operational expenses. Deposit held USD1,200."],
  ];

  for (const [tenantName, rentDue, rentPaid, levyDue, levyPaid, receipt, notes] of rentData) {
    const t = tenantRecords[tenantName];
    await prisma.rentRoll.create({
      data: {
        propertyId: property.id,
        unitId: t.unitId,
        tenantId: t.id,
        month: "2026-06",
        rentDue,
        rentPaid,
        levyDue,
        levyPaid,
        receiptNumber: receipt,
        commissionRate: t.commissionRate,
        commissionAmount: rentPaid * t.commissionRate,
        notes,
      },
    });
  }

  await prisma.expense.create({
    data: { propertyId: property.id, month: "2026-06", expenseType: "Security", supplier: "Security Provider", currency: "USD", amount: 600, status: "Due", notes: "Monthly security due." },
  });
  await prisma.expense.create({
    data: { propertyId: property.id, month: "2026-06", expenseType: "City of Harare", supplier: "City of Harare", currency: "USD", amount: 312, status: "Due", notes: "ZiG 7,609 as of 1 May plus ZiG 512 monthly estimate, total ZiG 8,121 / USD312." },
  });
  await prisma.deposit.create({
    data: { propertyId: property.id, tenantId: tenantRecords["Cafe Operator"].id, amount: 1200, currency: "USD", heldBy: "Courtyard / Property", notes: "Cafe deposit held." },
  });
  await prisma.maintenanceLog.create({
    data: { propertyId: property.id, unitId: unitRecords["Unit 16"].id, issue: "Unit not ready for occupation", priority: "Medium", status: "Open", notes: "Prepare before letting." },
  });
  await prisma.maintenanceLog.create({
    data: { propertyId: property.id, unitId: unitRecords["Unit 17"].id, issue: "Unit not ready for occupation", priority: "Medium", status: "Open", notes: "Prepare before letting." },
  });

  console.log("Seeded successfully.");
  }

  const adminEmail = "neville@hiltonpropertieszw.com";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.hash("changeme123", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "Neville Mupunga",
        role: "Admin",
        mustChangePassword: true,
      },
    });
    console.log(`Admin user created: ${adminEmail} / changeme123`);
  } else {
    console.log("Admin user already exists.");
  }

  const admin2Email = "nicholas.gwanzura@outlook.com";
  const existingAdmin2 = await prisma.user.findUnique({ where: { email: admin2Email } });
  if (!existingAdmin2) {
    const bcrypt2 = await import("bcryptjs");
    const passwordHash2 = await bcrypt2.hash("Zubi@2030$", 12);
    await prisma.user.create({
      data: {
        email: admin2Email,
        passwordHash: passwordHash2,
        name: "Nicholas Gwanzura",
        role: "Admin",
        mustChangePassword: false,
      },
    });
    console.log(`Admin user created: ${admin2Email}`);
  } else {
    console.log("Admin user already exists.");
  }

  const existingSettings = await prisma.companySettings.findFirst();
  if (!existingSettings) {
    await prisma.companySettings.create({
      data: {
        companyName: "Hilton Properties",
        tagline: "Premier Property Management Platform",
        address: "Glenara, Highlands, Harare",
        phone: "+263 77 123 4567",
        email: "notifications@hiltonpropertieszw.com",
        website: "https://www.hiltonpropertieszw.com",
        currency: "USD",
        footer: "Hilton Properties — Excellence in Property Management",
        primaryColor: "#0e2a47",
        secondaryColor: "#173d63",
      },
    });
    console.log("Company settings created.");
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
