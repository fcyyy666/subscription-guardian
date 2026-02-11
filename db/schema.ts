import { pgTable, uuid, varchar, timestamp, decimal, date, pgEnum } from 'drizzle-orm/pg-core';

// ===== Enums =====
export const currencyEnum = pgEnum('currency', ['CNY', 'USD', 'EUR', 'JPY']);
export const billingCycleEnum = pgEnum('billing_cycle', ['monthly', 'yearly', 'weekly']);
export const categoryEnum = pgEnum('category', ['Entertainment', 'Tools', 'Utilities', 'Health']);
export const statusEnum = pgEnum('status', ['active', 'paused', 'cancelled']);

// ===== Users Table =====
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  fullName: varchar('full_name', { length: 255 }),
  currencyPreference: currencyEnum('currency_preference').default('CNY').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ===== Subscriptions Table =====
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum('currency').notNull(),
  exchangeRate: decimal('exchange_rate', { precision: 10, scale: 6 }).default('1.0').notNull(),
  billingCycle: billingCycleEnum('billing_cycle').notNull(),
  startDate: date('start_date').notNull(),
  nextPaymentDate: date('next_payment_date').notNull(),
  category: categoryEnum('category').notNull(),
  status: statusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
