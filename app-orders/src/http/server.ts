import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { z } from 'zod/v3';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.get('/health', () => 'OK');

app.post('/orders', {
  schema: {
    body: z.object({
      amount: z.number(),
    }),
  },
}, (request, reply) => {
  const { amount } = request.body;

  console.log(amount);

  return reply.status(201).send({
    message: 'Order created successfully',
  });
})

app.listen({host: '0.0.0.0', port: 3333}).then(() => {
  console.log('[ORDERS] HTTP server running!')
})
