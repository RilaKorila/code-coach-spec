/**
 * Policy: We MAY receive raw prompt/code and Q/A text for question generation, but we MUST NOT persist them.
 * For raw event storage, we only store an explicit allow-list of non-text metadata.
 */

export type IngestEventBody = Record<string, unknown>;

export type StoredEvent = {
  eventId: string;
  userId: string;
  installationId: string;
  occurredAt: string; // ISO (from client)
  ingestedAt: string; // ISO (server)
  type: string;

  // Optional metadata (no text)
  questionCategory?: string;
  trigger?: string;
  autoReason?: string;
  selfCheck?: string;
  questionId?: string;
  sessionId?: string;
  languageId?: string;
  model?: string;
  modelVersion?: string;
  success?: boolean;
  errorCode?: string;
  errorType?: string;
};

function pickString(body: IngestEventBody, key: string): string | undefined {
  const v = body[key];
  return typeof v === 'string' && v.trim().length > 0 ? v : undefined;
}

function pickBoolean(body: IngestEventBody, key: string): boolean | undefined {
  const v = body[key];
  return typeof v === 'boolean' ? v : undefined;
}

export function buildStoredEvent(params: {
  eventId: string;
  userId: string;
  ingestedAt: string;
  body: IngestEventBody;
}): StoredEvent {
  const { body } = params;

  // Required fields (validated at route layer)
  const installationId = String(body.installationId);
  const occurredAt = String(body.timestamp);
  const type = String(body.type);

  return {
    eventId: params.eventId,
    userId: params.userId,
    installationId,
    occurredAt,
    ingestedAt: params.ingestedAt,
    type,

    // Allow-list only:
    questionCategory: pickString(body, 'questionCategory'),
    trigger: pickString(body, 'trigger'),
    autoReason: pickString(body, 'autoReason'),
    selfCheck: pickString(body, 'selfCheck'),
    questionId: pickString(body, 'questionId'),
    sessionId: pickString(body, 'sessionId'),
    languageId: pickString(body, 'languageId'),
    model: pickString(body, 'model'),
    modelVersion: pickString(body, 'modelVersion'),
    success: pickBoolean(body, 'success'),
    errorCode: pickString(body, 'errorCode'),
    errorType: pickString(body, 'errorType'),
  };
}


