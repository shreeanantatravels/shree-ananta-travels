export const DEFAULT_CONTACT_PHONE = "";
export const DEFAULT_DISPLAY_PHONE = "";
export const DEFAULT_WHATSAPP_DIGITS = "";

/**
 * Extracts the 10 mobile digits from any phone representation
 * (strips leading +91, 91, 0, whitespace, punctuation).
 */
export function extract10Digits(phone?: string | null): string {
  if (!phone) return "";
  const rawDigits = phone.replace(/\D/g, "");
  if (rawDigits.length > 10 && rawDigits.startsWith("91")) {
    return rawDigits.slice(2, 12);
  }
  if (rawDigits.length === 11 && rawDigits.startsWith("0")) {
    return rawDigits.slice(1, 11);
  }
  return rawDigits.slice(-10);
}

/**
 * Returns clean digits with country code prefix (e.g. "919876543210").
 * If no phone is provided or empty, returns "".
 */
export function getCleanPhoneDigits(phone?: string | null): string {
  if (!phone || !phone.trim()) {
    return "";
  }
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `91${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `91${digits.slice(1)}`;
  return digits;
}

/**
 * Returns phone formatted for user-facing UI display.
 * E.g. "+91 9876543210" or original if already formatted with country code.
 */
export function getDisplayPhone(phone?: string | null): string {
  if (!phone || !phone.trim()) {
    return "";
  }
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10 && !trimmed.startsWith("+")) {
    return `+91 ${trimmed}`;
  }
  if (digits.length > 10 && !trimmed.startsWith("+")) {
    return `+${digits}`;
  }
  return trimmed;
}

/**
 * Returns tel: protocol URI for call links.
 * E.g. "tel:+919876543210"
 */
export function getTelHref(phone?: string | null): string {
  const digits = getCleanPhoneDigits(phone);
  return digits ? `tel:+${digits}` : "#";
}

/**
 * Returns direct WhatsApp click-to-chat URL with optional pre-filled message.
 * E.g. "https://wa.me/919876543210?text=..."
 */
export function getWhatsAppUrl(phone?: string | null, message: string = ""): string {
  const digits = getCleanPhoneDigits(phone);
  if (!digits) return "#";
  const textParam = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${textParam}`;
}
