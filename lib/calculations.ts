/**
 * Subscription date calculation utilities.
 *
 * Handles next-payment-date computation with proper month-end logic:
 * e.g. a monthly subscription starting Jan 31 → next payment Feb 28 (or 29).
 */

type BillingCycle = 'monthly' | 'yearly' | 'weekly';

/**
 * Calculates the next payment date from a given start date and billing cycle.
 *
 * @param startDate - The subscription start / reference date (ISO string or Date)
 * @param billingCycle - One of 'weekly', 'monthly', or 'yearly'
 * @returns The next payment date as an ISO date string (YYYY-MM-DD)
 *
 * @example
 * calculateNextPaymentDate('2026-01-31', 'monthly') // '2026-02-28'
 * calculateNextPaymentDate('2026-01-15', 'yearly')  // '2027-01-15'
 */
export function calculateNextPaymentDate(
    startDate: string | Date,
    billingCycle: BillingCycle
): string {
    const date = typeof startDate === 'string' ? new Date(startDate) : new Date(startDate.getTime());
    const originalDay = date.getUTCDate();

    switch (billingCycle) {
        case 'weekly':
            date.setUTCDate(date.getUTCDate() + 7);
            break;

        case 'monthly': {
            const nextMonth = date.getUTCMonth() + 1;
            date.setUTCMonth(nextMonth);
            // If the day overflowed (e.g. 31 → March 3), clamp to last day of target month
            if (date.getUTCDate() !== originalDay) {
                date.setUTCDate(0); // sets to last day of previous month (the target month)
            }
            break;
        }

        case 'yearly': {
            const nextYear = date.getUTCFullYear() + 1;
            date.setUTCFullYear(nextYear);
            // Handle Feb 29 → Feb 28 in non-leap years
            if (date.getUTCDate() !== originalDay) {
                date.setUTCDate(0);
            }
            break;
        }
    }

    return date.toISOString().split('T')[0];
}

/**
 * Calculates the "current" next payment date by advancing from the start date
 * until the result is in the future (or today).
 *
 * @param startDate - The original subscription start date
 * @param billingCycle - The billing cycle
 * @returns The nearest future payment date as YYYY-MM-DD
 */
export function calculateCurrentNextPaymentDate(
    startDate: string | Date,
    billingCycle: BillingCycle
): string {
    const today = new Date().toISOString().split('T')[0];
    let next = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];

    // Advance until the date is today or in the future
    while (next < today) {
        next = calculateNextPaymentDate(next, billingCycle);
    }

    return next;
}

/** Hardcoded exchange rates to CNY (MVP) */
export const EXCHANGE_RATES: Record<string, number> = {
    CNY: 1,
    USD: 7.2,
    EUR: 7.8,
    JPY: 0.048,
};

/**
 * Normalizes any subscription amount to a monthly CNY equivalent for stats calculation.
 * Uses provided exchangeRate if available, otherwise falls back to hardcoded defaults.
 */
export function toMonthlyCNY(
    amount: string,
    currency: string,
    cycle: string,
    exchangeRate?: number | string
): number {
    const raw = parseFloat(amount);
    // Use provided rate, or fallback to CONSTANT, or 1
    const rate = exchangeRate ? parseFloat(exchangeRate.toString()) : (EXCHANGE_RATES[currency] ?? 1);
    const inCNY = raw * rate;

    switch (cycle) {
        case 'weekly':
            return inCNY * (52 / 12); // ~4.33 weeks per month
        case 'yearly':
            return inCNY / 12;
        case 'monthly':
        default:
            return inCNY;
    }
}
