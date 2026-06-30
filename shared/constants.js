export const APPOINTMENT_STATUS = { CONFIRMED: "confirmed", CANCELLED: "cancelled", COMPLETED: "completed", PENDING: "pending" };
export const SLOT_STATUS = { AVAILABLE: "available", BOOKED: "booked", BLOCKED: "blocked" };
export const CONVERSATION_STEPS = { GREETING: "greeting", AWAITING_CASE_TYPE: "awaiting_case_type", AWAITING_LAWYER_CHOICE: "awaiting_lawyer_choice", AWAITING_DATE_CHOICE: "awaiting_date_choice", AWAITING_SLOT_CHOICE: "awaiting_slot_choice", AWAITING_CONFIRMATION: "awaiting_confirmation", BOOKING_COMPLETE: "booking_complete" };
export const CASE_TYPES = [ "Property Dispute", "Family Law", "Criminal Defense", "Business / Corporate", "Consumer Court", "Other" ];
export const TIMEZONE = "Asia/Kolkata";
export const CONVERSATION_TTL_MS = 2 * 60 * 60 * 1000;
