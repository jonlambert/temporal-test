import { Connection, WorkflowClient } from '@temporalio/client';
import { nanoid } from 'nanoid';
import { CreateBooking } from './workflows';

async function run() {
  const connection = await Connection.connect({});

  const client = new WorkflowClient({
    connection,
  });

  async function createBooking() {
    const handle = await client.start(CreateBooking, {
      // in practice, use a meaningful business id, eg customerId or transactionId
      workflowId: 'create-booking-' + nanoid(),
      taskQueue: 'default',
      args: [{ from: '', to: '' }],
    });
    console.log(`Started workflow ${handle.workflowId}`);
  }

  // Create 100 bookings
  await Promise.all(new Array(100).fill(0).map(() => createBooking()));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
