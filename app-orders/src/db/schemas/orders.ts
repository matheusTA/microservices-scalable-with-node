import { pgEnum } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { customers } from "./customers.ts";

export const orderStatusEnum = pgEnum('order_status', ['pending', 'paid', 'cancelled'])

export const orders = pgTable('orders', {
  id: text().primaryKey(),
  customerId: text().notNull().references(() => customers.id),
  amount: integer().notNull(),
  status: orderStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})