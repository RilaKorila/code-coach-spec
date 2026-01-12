type PairingCodeRecord = {
  code: string;
  userId: string;
  expiresAt: string; // ISO
};

type InstallationRecord = {
  installationId: string;
  userId: string;
};

type MetricKey = string;

type MetricPoint = {
  date: string; // YYYY-MM-DD
  eventType: string;
  questionCategory: string;
  selfCheck: string;
  count: number;
};

const pairingCodes = new Map<string, PairingCodeRecord>();
const installations = new Map<string, InstallationRecord>();
const metrics = new Map<MetricKey, MetricPoint>();

function metricKey(p: Omit<MetricPoint, 'count'> & { userId: string }): MetricKey {
  return [
    p.userId,
    p.date,
    p.eventType,
    p.questionCategory,
    p.selfCheck,
  ].join('|');
}

export const memoryStore = {
  pairingCodes,
  installations,
  metrics,
  upsertPairingCode(rec: PairingCodeRecord) {
    pairingCodes.set(rec.code, rec);
  },
  getPairingCode(code: string): PairingCodeRecord | undefined {
    return pairingCodes.get(code);
  },
  setInstallation(rec: InstallationRecord) {
    installations.set(rec.installationId, rec);
  },
  getInstallation(installationId: string): InstallationRecord | undefined {
    return installations.get(installationId);
  },
  incrementMetric(input: Omit<MetricPoint, 'count'> & { userId: string }) {
    const k = metricKey(input);
    const prev = metrics.get(k);
    if (!prev) {
      metrics.set(k, { ...input, count: 1 });
      return;
    }
    metrics.set(k, { ...prev, count: prev.count + 1 });
  },
  listMetrics(userId: string): MetricPoint[] {
    const out: MetricPoint[] = [];
    for (const [k, v] of metrics.entries()) {
      if (k.startsWith(`${userId}|`)) out.push(v);
    }
    return out;
  },
};


