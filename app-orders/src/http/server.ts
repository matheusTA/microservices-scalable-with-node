import '@opentelemetry/auto-instrumentations-node/register'

import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { z } from 'zod/v3';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { db } from "../db/client.ts";
import { schemas } from "../db/schemas/index.ts";
import { randomUUID } from "node:crypto";
import { dispatchOrderCreated } from "../broker/messages/order-created.ts";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(fastifyCors, {
  origin: '*',
})

app.get('/health', () => 'OK');

app.post('/orders', {
  schema: {
    body: z.object({
      amount: z.number(),
      customerId: z.string(),
    }),
  },
}, async (request, reply) => {
  const { amount, customerId } = request.body;

  const orderId = randomUUID();
  await db.insert(schemas.orders).values({
    id: orderId,
    amount,
    customerId,
  })

  dispatchOrderCreated({
    orderId,
    amount,
    customer: {
      id: customerId,
    },
  })

  return reply.status(201).send({
    message: 'Order created successfully',
  });
})

app.listen({host: '0.0.0.0', port: 3333}).then(() => {
  console.log('[ORDERS] HTTP server running!')
})
