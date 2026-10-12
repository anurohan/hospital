import "server-only";

/**
 * Notification provider abstraction.
 *
 * Email/SMS are optional external integrations. We define a provider interface
 * and select a concrete provider from env. When no credentials are configured
 * we use a NoopProvider that records intent but reports `delivered: false` — we
 * NEVER report a message as delivered unless a real provider confirms it.
 */

export interface SendResult {
  delivered: boolean;
  provider: string;
  id?: string;
  error?: string;
}

export interface MessagePayload {
  to: string;
  subject?: string;
  body: string;
}

export interface NotificationProvider {
  readonly name: string;
  readonly configured: boolean;
  send(msg: MessagePayload): Promise<SendResult>;
}

/** Default provider: does not send. Used until a real provider is configured. */
class NoopProvider implements NotificationProvider {
  readonly name = "noop";
  readonly configured = false;
  async send(): Promise<SendResult> {
    return { delivered: false, provider: this.name, error: "No provider configured" };
  }
}

/**
 * Resend email provider scaffold. Intentionally NOT wired to a network call
 * here — the integration is enabled only when RESEND_API_KEY is present AND the
 * concrete fetch is implemented during deployment. Until then it reports
 * undelivered so status handling stays honest.
 */
class ResendProvider implements NotificationProvider {
  readonly name = "resend";
  readonly configured: boolean;
  constructor(private apiKey: string | undefined) {
    this.configured = !!apiKey;
  }
  async send(msg: MessagePayload): Promise<SendResult> {
    if (!this.configured) {
      return { delivered: false, provider: this.name, error: "RESEND_API_KEY missing" };
    }
    // Deployment step: implement the authenticated POST to the Resend API here,
    // then return delivered:true only on a 2xx response.
    void msg;
    return { delivered: false, provider: this.name, error: "Email sending not yet enabled in this build" };
  }
}

export function getEmailProvider(): NotificationProvider {
  const key = process.env.RESEND_API_KEY;
  return key ? new ResendProvider(key) : new NoopProvider();
}

export function getSmsProvider(): NotificationProvider {
  // Twilio scaffold: return Noop until TWILIO_* are configured + implemented.
  return new NoopProvider();
}
