// import crypto from "crypto";
// import prisma from "../../config/db";
// import { CreateCategoryInput } from "../categories/category.validation";
// import { CreatePaymentInput } from "./payment.validation";

// const generateTransactionId = () => {
//   return `TXN-${crypto.randomBytes(8).toString("hex").toUpperCase}`;
// };

// export const createPayment = async (
//   tenantId: string,
//   data: CreatePaymentInput,
// ) => {
//   const rentalRequest = await prisma.rentalRequest.findUnique({
//     where: { id: data.rentalRequestId },
//     include: { property: true, payment: true },
//   });

//   if (!rentalRequest) {
//     const error: any = new Error("Rental request not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   if (rentalRequest.tenantId !== tenantId) {
//     const error: any = new Error(
//       "You are not authorized to pay for this request",
//     );
//     error.statusCode = 403;
//     throw error;
//   }

//   if (rentalRequest.status !== "APPROVED") {
//     const error: any = new Error("This rental request is not approved yet");
//     error.statusCode = 400;
//     throw error;
//   }

//   if (rentalRequest.payment) {
//     const error: any = new Error(
//       "Payment already exists for this rental request",
//     );
//     error.statusCode = 409;
//     throw error;
//   }

//   const transactionId = generateTransactionId();
//   const payment = await prisma.payment.create({
//     data: {
//       transactionId,
//       amount: rentalRequest.property.price,
//       method: data.method,
//       provider: data.provider,
//       status: "COMPLETED",
//       paidAt: new Date(),
//       rentalRequestId: rentalRequest.id,
//     },
//   });

//   await prisma.rentalRequest.update({
//     where: { id: rentalRequest.id },
//     data: { status: "ACTIVE" },
//   });

//   return payment;
// };

// export const getTenantPayments = async (tenantId: string) => {
//   return prisma.payment.findMany({
//     where: {
//       rentalRequest: { tenantId },
//     },
//     include: {
//       rentalRequest: {
//         include: { property: true },
//       },
//     },
//     orderBy: { createdAt: "desc" },
//   });
// };

// export const getPaymentById = async (id: string, userId: string) => {
//   const payment = await prisma.payment.findUnique({
//     where: { id },
//     include: {
//       rentalRequest: {
//         include: {
//           property: true,
//           tenant: { select: { id: true, name: true, email: true } },
//         },
//       },
//     },
//   });
//   if (!payment) {
//     const error: any = new Error("Payment not found");
//     error.statusCode = 404;
//     throw error;
//   }

//   const isTenant = payment.rentalRequest.tenantId === userId;
//   const isLandlord = payment.rentalRequest.property.landlordId === userId;

//   if (!isTenant && isLandlord) {
//     const error: any = new Error("you are not authorized to view this payment");
//     error.statusCode = 403;
//     throw error;
//   }
//   return payment;
// };


import Stripe from 'stripe';
import prisma from '../../config/db';
import { CreatePaymentIntentInput, ConfirmPaymentInput } from './payment.validation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// STEP 1: Create a Payment Intent (called before payment)
export const createPaymentIntent = async (tenantId: string, data: CreatePaymentIntentInput) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: data.rentalRequestId },
    include: { property: true, payment: true },
  });

  if (!rentalRequest) {
    const error: any = new Error('Rental request not found');
    error.statusCode = 404;
    throw error;
  }

  if (rentalRequest.tenantId !== tenantId) {
    const error: any = new Error('You are not authorized to pay for this request');
    error.statusCode = 403;
    throw error;
  }

  if (rentalRequest.status !== 'APPROVED') {
    const error: any = new Error('This rental request is not approved yet');
    error.statusCode = 400;
    throw error;
  }

  if (rentalRequest.payment) {
    const error: any = new Error('Payment already exists for this rental request');
    error.statusCode = 409;
    throw error;
  }

  // Stripe wants amount in smallest currency unit (cents). Using USD for test compatibility.
  const amountInCents = Math.round(rentalRequest.property.price * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    automatic_payment_methods: { enabled: true, allow_redirects: 'never' },
    metadata: {
      rentalRequestId: rentalRequest.id,
      tenantId,
      propertyId: rentalRequest.propertyId,
    },
  });

  // Create a PENDING payment record in our DB, linked to Stripe's paymentIntent.id
  const payment = await prisma.payment.create({
    data: {
      transactionId: paymentIntent.id,
      amount: rentalRequest.property.price,
      method: 'card',
      provider: 'STRIPE',
      status: 'PENDING',
      rentalRequestId: rentalRequest.id,
    },
  });

  return {
    paymentId: payment.id,
    clientSecret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
    amount: rentalRequest.property.price,
  };
};

// STEP 2: Confirm the payment (simulates the tenant completing payment with a card)
export const confirmPayment = async (tenantId: string, data: ConfirmPaymentInput) => {
  const payment = await prisma.payment.findUnique({
    where: { transactionId: data.paymentIntentId },
    include: { rentalRequest: true },
  });

  if (!payment) {
    const error: any = new Error('Payment not found');
    error.statusCode = 404;
    throw error;
  }

  if (payment.rentalRequest.tenantId !== tenantId) {
    const error: any = new Error('You are not authorized to confirm this payment');
    error.statusCode = 403;
    throw error;
  }

  if (payment.status === 'COMPLETED') {
    const error: any = new Error('This payment has already been completed');
    error.statusCode = 409;
    throw error;
  }

  // Confirm with Stripe using a test payment method (Stripe provides these for API testing)
  const paymentIntent = await stripe.paymentIntents.confirm(data.paymentIntentId, {
    payment_method: data.paymentMethodId || 'pm_card_visa',
  });

  if (paymentIntent.status !== 'succeeded') {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    });

    const error: any = new Error(`Payment failed. Stripe status: ${paymentIntent.status}`);
    error.statusCode = 400;
    throw error;
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: { status: 'COMPLETED', paidAt: new Date() },
  });

  await prisma.rentalRequest.update({
    where: { id: payment.rentalRequestId },
    data: { status: 'ACTIVE' },
  });

  return updatedPayment;
};

export const getTenantPayments = async (tenantId: string) => {
  return prisma.payment.findMany({
    where: { rentalRequest: { tenantId } },
    include: { rentalRequest: { include: { property: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

export const getPaymentById = async (id: string, userId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      rentalRequest: {
        include: { property: true, tenant: { select: { id: true, name: true, email: true } } },
      },
    },
  });

  if (!payment) {
    const error: any = new Error('Payment not found');
    error.statusCode = 404;
    throw error;
  }

  const isTenant = payment.rentalRequest.tenantId === userId;
  const isLandlord = payment.rentalRequest.property.landlordId === userId;

  if (!isTenant && !isLandlord) {
    const error: any = new Error('You are not authorized to view this payment');
    error.statusCode = 403;
    throw error;
  }

  return payment;
};