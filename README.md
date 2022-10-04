# Jon's WIP playground for Temporal

This project models a simple booking creation scenario:

1. When a booking is created, we should keep it alive to hold the room for 15 minutes
1. If the customer confirms their booking within that time, end the workflow and send a confirmation email. Could then trigger the "PreStay" or even just "Stay" workflow.

Each activity just simulates calling out to external services (Opera). As such, each call to Opera has a simulated 33% chance of failing, and a variable completion time. See: `src/activities.ts`.

### Running this sample

1. Make sure Temporal Server is running locally (use [https://github.com/temporalio/temporalite](Temporalite)).
1. Access the UI at [http://localhost:8233](http://localhost:8233)
1. `npm install` to install dependencies.
1. `npm run start` to start the Worker.
1. In another shell, `npm run workflow` to trigger 100 booking creations
1. Open the Temporal UI to see these running. Once CreateBooking is completed, they should trigger the HoldBooking workflow
1. To confirm a booking, grab a booking ID by selecting a HoldBooking event in the Temporal UI. The ID of the event will contain a booking ID, prefixed with `BE-`. For example, `hold-booking-BE-0N8pnL6N65A14q1SOyjyH`: the booking ID here is `BE-0N8pnL6N65A14q1SOyjyH`. Run `npm run confirm-booking -- <booking id>` to confirm a booking.
