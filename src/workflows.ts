import { proxyActivities, sleep } from '@temporalio/workflow';
import * as wf from '@temporalio/workflow';
// Only import the activity types
import type * as activities from './activities';
import { holdBookingWorkflowId } from './ids';

const confirmedSignal = wf.defineSignal<[]>('confirmed');
const confirmedTrigger = new wf.Trigger<boolean>();

const acts = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
  retry: {
    backoffCoefficient: 2,
  },
});

export async function CreateBooking(args: { from: string; to: string }) {
  const bookingId = await acts.createBooking();

  await wf.startChild(HoldBooking, {
    workflowId: holdBookingWorkflowId(bookingId),
    args: [bookingId],
    parentClosePolicy: wf.ParentClosePolicy.PARENT_CLOSE_POLICY_ABANDON,
  });

  return { bookingId };
}

export async function HoldBooking(bookingId: string) {
  let isConfirmed = false;
  wf.setHandler(confirmedSignal, () => {
    isConfirmed = true;
    confirmedTrigger.resolve(true);
  });

  await Promise.race([confirmedTrigger, sleep('15 mins')]);

  if (!isConfirmed) {
    await acts.cancelBooking(bookingId);
  }
}

export async function ConfirmBooking(bookingId: string) {
  await acts.confirmBookingInOpera(bookingId);
  const handle = wf.getExternalWorkflowHandle(holdBookingWorkflowId(bookingId));
  await handle.signal(confirmedSignal);
}

// export async function CleanupBookings() {
//   // eslint-disable-next-line no-constant-condition
//   while (true) {
//     const bookingIds = await acts.getExpiredBookingIds();
//     await Promise.all(bookingIds.map(acts.cancelBooking));
//     await wf.sleep('1 min');
//   }
// }

// export async function AbandonedBasket() {}
