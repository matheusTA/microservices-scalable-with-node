import { orders } from "./channels/orders.ts";

orders.consume('orders', async message => {
  if (!message) {
    return null
  }

  console.log(message?.content.toString())

  orders.ack(message)
}, {
  noAck: false, // não reconhecer a mensagem imediatamente, mas sim esperar o processamento ser finalizado
})
