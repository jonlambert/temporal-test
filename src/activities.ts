import { ApplicationFailure } from '@temporalio/client';
import { nanoid } from 'nanoid';

// We're in activity context here - so normal sleep()
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const log = (...messages: any[]) => console.log('[activity]', ...messages);

/**
 * Simulates a call to Opera, with a 1 in 3 chance of failing each request.
 */
async function callOpera() {
  await sleep(Math.random() * 10);
  if (Math.random() > 0.666666) {
    log(`❌ Unable to reach Opera`);
    throw ApplicationFailure.retryable('nobody home', 'OperaFailure');
  }
}

export async function confirmBookingInOpera(bookingId: string) {
  log(`⏳ Confirming booking [${bookingId}] with Opera...`);

  await callOpera();

  log(`✅ Confirmed booking [${bookingId}]`);
}

export async function createBooking() {
  log('⏳ Creating new booking in Opera...');

  await callOpera();
  const id = `BE-${nanoid()}`;
  log(`✅ Booking created: ${id}`);

  return id;
}

export async function cancelBooking(bookingId: string) {
  log(`⌛️ Cancelling booking [${bookingId}]...`);
  await callOpera();
  log(`🗑 Cancelled booking [${bookingId}]`);
}


export async function sendConfirmationEmail(bookingId: string) {
  log(`⌛️ Sending confirmation email for booking [${bookingId}]...`);
  // HTTP call to Sendgrid, or Email service -> 
}

export async function getExpiredBookingIds() {
  return ['X-XX-XXXXXXX'];
}
