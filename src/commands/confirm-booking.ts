import { Connection, WorkflowClient } from "@temporalio/client";
import { ConfirmBooking } from "../workflows";

const args = process.argv.slice(2);
const bookingId = args[0];

if (!bookingId) {
  new Error('usage: `npm run confirm-booking -- <booking id>`');
}

async function run() {
  const connection = await Connection.connect({});

  const client = new WorkflowClient({
    connection,
  });

  const handle = await client.start(ConfirmBooking, {
    // in practice, use a meaningful business id, eg customerId or transactionId
    workflowId: 'confirm-booking-' + bookingId,
    taskQueue: 'default',
    args: [bookingId],
  });

  console.log(`Started workflow ${handle.workflowId}`);

  // optional: wait for client result
  // console.log(await handle.result()); // Hello, Temporal!
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});