import { channels } from "../channels/index.ts";

interface OrderCreatedMessage {
  orderId: string
  amount: number
  customer: {
    id: string
  },
}

export function dispatchOrderCreated(data: OrderCreatedMessage) {
  channels.orders.sendToQueue('orders', Buffer.from(JSON.stringify(data)))
}