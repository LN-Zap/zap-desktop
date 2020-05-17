import { defineMessages } from 'react-intl'

// use pattern [reducer]_message

/* eslint-disable max-len */
export default defineMessages({
  unknown: 'Unknown',
  terminated_early: 'Payment attempt terminated early.',
  in_flight: 'Payment is still in flight.',
  succeeded: 'Payment completed successfully.',
  failed_timeout: 'There are more routes to try, but the payment timeout was exceeded.',
  no_route: 'Unable to find route.',
  failed_no_route:
    'All possible routes were tried and failed permanently. Or there were no routes to the destination at all.',
  failed_error: 'A non-recoverable error has occured.',
  failed_incorrect_payment_details:
    'Payment details incorrect (unknown hash, invalid amt or invalid final cltv delta).',
  failed_insufficient_balance: 'Insufficient local balance.',
  failure_reason_none: "Payment isn't failed (yet).",
  failure_reason_timeout: 'There are more routes to try, but the payment timeout was exceeded.',
  failure_reason_no_route:
    'All possible routes were tried and failed permanently. Or were there no routes to the destination at all.',
  failure_reason_error: 'A non-recoverable error has occured.',
  failure_reason_incorrect_payment_details:
    'Payment details incorrect (unknown hash, invalid amt or invalid final cltv delta).',
  failure_reason_insufficient_balance: 'Insufficient local balance.',
})
