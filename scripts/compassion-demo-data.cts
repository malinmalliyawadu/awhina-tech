// Fills a LOCAL, freshly seeded Compassion Soup Kitchen database with a
// believable working month, so the staff dashboard screenshot on the case-study
// card reads like a real kitchen rather than a dev seed ("Kia ora, Admin",
// every row "3 minutes ago"). Every person here is fictional. The shot is
// never taken from prod, where the dashboard names real volunteers.
//
// It needs the Compassion app's own Prisma client, so run it from that repo's
// apps/web with its node_modules on NODE_PATH (this is a .cts file so plain
// CommonJS resolution applies):
//
//   docker run -d --name csk-screenshots -e POSTGRES_PASSWORD=postgres \
//     -e POSTGRES_DB=volunteer_app -p 5491:5432 postgres:17-alpine
//   cd <volunteer-app>/apps/web
//   set -a && . ./.env.local && set +a       # DATABASE_URL → localhost:5491
//   pnpm exec prisma migrate deploy && pnpm run db:seed
//   NODE_PATH=$PWD/node_modules pnpm exec tsx <awhina-tech>/scripts/compassion-demo-data.cts
//
// Dates are relative to today, so start from a fresh container on the day you
// capture (ideally not in the first few days of a month, or "hours this month"
// is near zero). Serve the app with NEXTAUTH_URL=http://localhost:3011 in its
// .env.local (`pnpm run build && pnpm exec next start -p 3011`), then run
// `pnpm run screenshots compassion` from this repo.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const url = process.env.DATABASE_URL!;
if (!/@localhost:5491\//.test(url)) throw new Error("Refusing: DATABASE_URL is not the local screenshot database (localhost:5491).");
const prisma = new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString: url })) });

let seed = 42;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];
const now = Date.now();
const ago = (mins: number) => new Date(now - mins * 60_000);
// A wall-calendar day in the current NZ month, encoded the way @db.Date expects.
const [nzYear, nzMonth] = new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Auckland", year: "numeric", month: "2-digit" }).format(new Date()).split("-").map(Number);
const nzToday = Number(new Intl.DateTimeFormat("en-CA", { timeZone: "Pacific/Auckland", day: "2-digit" }).format(new Date()));
const day = (d: number) => new Date(Date.UTC(nzYear, nzMonth - 1, d));

const first = ["Mereana","Sione","Grace","Wiremu","Priya","Tom","Ana","Liam","Kahu","Sofia","Rawiri","Mei","Ben","Hana","Josh","Losa","Nikau","Emma","Tama","Ruby","Daniel","Aria","Isaac","Moana","Chloe","Ihaia","Lucy","Sam","Te Ao","Olivia","Matiu","Fatima","Jack","Kiri","Noah","Ella","Rangi","Zoe","Hamish","Tui"];
const last = ["Paewai","Fonoti","Chen","Tamihana","Sharma","Whitfield","Taufa","O'Connor","Herewini","Rossi","Kereama","Lin","McKenzie","Rāwiri","Patel","Afamasaga","Walker","Te Huia","Brown","Nguyen"];

async function main() {
  const admin = await prisma.user.update({ where: { email: "admin@soupkitchen.org.nz" }, data: { name: "Anahera Rāwiri" } });
  const areas = Object.fromEntries((await prisma.serviceArea.findMany()).map((a) => [a.name, a]));

  // Push the seed's own activity back in time so it doesn't all read "3 minutes ago".
  const seedSignups = await prisma.shiftSignup.findMany();
  for (const [i, s] of seedSignups.entries())
    await prisma.shiftSignup.update({ where: { id: s.id }, data: { signedUpAt: ago(60 * 24 * (3 + i)) } });
  const seedApps = await prisma.application.findMany();
  for (const [i, a] of seedApps.entries())
    await prisma.application.update({ where: { id: a.id }, data: { submittedAt: ago(60 * 24 * (30 + 7 * i)) } });

  // 40 active, vetted volunteers.
  const vols: { id: string }[] = [];
  for (let i = 0; i < 40; i++) {
    const name = `${first[i]} ${last[i % last.length]}`;
    const u = await prisma.user.create({ data: { name, email: `demo${i}@example.org.nz`, role: "VOLUNTEER", emailVerified: ago(60 * 24 * 90) } });
    const p = await prisma.volunteerProfile.create({ data: { userId: u.id, status: "ACTIVE", mojStatus: "CLEARED" } });
    await prisma.application.create({ data: { volunteerId: p.id, status: "APPROVED", submittedAt: ago(60 * 24 * (40 + i * 4)), reviewedAt: ago(60 * 24 * (35 + i * 4)), reviewedById: admin.id } });
    vols.push(p);
  }

  // Three fresh applications awaiting review.
  for (const [name, mins] of [["Leilani Faleolo", 26], ["Arjun Mehta", 60 * 3 + 12], ["Pania Ngāwhika", 60 * 26]] as const) {
    const u = await prisma.user.create({ data: { name, email: `applicant-${mins}@example.org.nz`, role: "PUBLIC", emailVerified: ago(mins + 5) } });
    const p = await prisma.volunteerProfile.create({ data: { userId: u.id } });
    await prisma.application.create({ data: { volunteerId: p.id, submittedAt: ago(mins) } });
  }

  // The month so far: a full breakfast kitchen every day, plus garden and
  // clothing bank shifts. Today and yesterday are left to the dev seed.
  for (let d = 1; d < nzToday - 1; d++) {
    const plan: [string, string, string, number][] = [["Kitchen & Meals", "07:30", "11:30", 8]];
    if (d % 3 === 0) plan.push(["Community Garden", "09:00", "12:00", 5]);
    if (d % 4 === 1) plan.push(["Clothing & Essentials", "13:00", "16:00", 4]);
    for (const [area, startTime, endTime, capacity] of plan) {
      const shift = await prisma.shift.create({ data: { serviceAreaId: areas[area].id, date: day(d), startTime, endTime, capacity, createdById: admin.id, mealsServed: area === "Kitchen & Meals" ? 90 + Math.floor(rnd() * 40) : null } });
      const crew = new Set<string>();
      while (crew.size < capacity - Math.floor(rnd() * 2)) crew.add(pick(vols).id);
      for (const v of crew)
        await prisma.shiftSignup.create({ data: { shiftId: shift.id, volunteerId: v, status: rnd() < 0.94 ? "ATTENDED" : "NO_SHOW", signedUpAt: ago(60 * 24 * (nzToday + 7 - d)), attendanceMarkedAt: day(d), attendanceMarkedById: admin.id } });
    }
  }

  // Fill upcoming shifts, with the most recent signups spread across today.
  const upcoming = await prisma.shift.findMany({ where: { date: { gt: day(nzToday) } }, include: { _count: { select: { signups: true } } }, orderBy: { date: "asc" } });
  const recentMins = [9, 34, 71, 118, 160, 245, 390, 610, 880, 1300];
  let r = 0;
  for (const s of upcoming) {
    const target = Math.max(s._count.signups, Math.ceil(s.capacity * (0.5 + rnd() * 0.5)));
    const taken = new Set((await prisma.shiftSignup.findMany({ where: { shiftId: s.id } })).map((x) => x.volunteerId));
    while (taken.size < target) {
      const v = pick(vols).id;
      if (taken.has(v)) continue;
      taken.add(v);
      await prisma.shiftSignup.create({ data: { shiftId: s.id, volunteerId: v, signedUpAt: ago(recentMins[r] ?? 60 * 24 * 2 + r * 90) } });
      r++;
    }
  }
  console.log(`enriched: ${vols.length} volunteers, ${upcoming.length} upcoming shifts filled, ${r} recent signups`);
}
main().finally(() => prisma.$disconnect());
