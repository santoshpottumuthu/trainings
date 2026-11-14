type DevLoginEnvironment = {
  nodeEnv?: string;
  enabled?: string;
};

export function isDevelopmentLoginEnabled({
  nodeEnv = process.env.NODE_ENV,
  enabled = process.env.ENABLE_DEV_ADMIN_LOGIN,
}: DevLoginEnvironment = {}) {
  if (enabled !== "true") {
    return false;
  }

  if (nodeEnv !== "development") {
    throw new Error("Development administrator login is only allowed in development.");
  }

  return true;
}
