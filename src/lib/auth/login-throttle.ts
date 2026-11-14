import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";

const maxFailedAttempts = 5;

function createThrottleKey(identity: string) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET must be configured before login is enabled.");
  }

  return createHmac("sha256", secret)
    .update(identity.trim().toLowerCase())
    .digest("hex");
}

export async function isLoginBlocked(identity: string) {
  const key = createThrottleKey(identity);
  const rows = await prisma.$queryRaw<{ blocked: boolean }[]>`
    SELECT "blockedUntil" > CURRENT_TIMESTAMP AS blocked
    FROM "LoginThrottle"
    WHERE "key" = ${key}
  `;

  return rows[0]?.blocked ?? false;
}

export async function recordLoginFailure(identity: string) {
  const key = createThrottleKey(identity);

  await prisma.$executeRaw`
    INSERT INTO "LoginThrottle" ("key", "attempts", "windowStartedAt", "updatedAt")
    VALUES (${key}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT ("key") DO UPDATE SET
      "attempts" = CASE
        WHEN "LoginThrottle"."blockedUntil" > CURRENT_TIMESTAMP
          THEN "LoginThrottle"."attempts"
        WHEN "LoginThrottle"."windowStartedAt" <= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
          THEN 1
        ELSE "LoginThrottle"."attempts" + 1
      END,
      "windowStartedAt" = CASE
        WHEN "LoginThrottle"."blockedUntil" > CURRENT_TIMESTAMP
          THEN "LoginThrottle"."windowStartedAt"
        WHEN "LoginThrottle"."windowStartedAt" <= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
          THEN CURRENT_TIMESTAMP
        ELSE "LoginThrottle"."windowStartedAt"
      END,
      "blockedUntil" = CASE
        WHEN "LoginThrottle"."blockedUntil" > CURRENT_TIMESTAMP
          THEN "LoginThrottle"."blockedUntil"
        WHEN "LoginThrottle"."windowStartedAt" <= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
          THEN NULL
        WHEN "LoginThrottle"."attempts" + 1 >= ${maxFailedAttempts}
          THEN CURRENT_TIMESTAMP + INTERVAL '15 minutes'
        ELSE NULL
      END,
      "updatedAt" = CURRENT_TIMESTAMP
  `;
}

export async function clearLoginFailures(identity: string) {
  const key = createThrottleKey(identity);
  await prisma.loginThrottle.deleteMany({ where: { key } });
}
