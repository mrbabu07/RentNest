import crypto from 'crypto';
import prisma from '../../config/db';
import { CreateCategoryInput } from '../categories/category.validation';
import { CreatePaymentInput } from './payment.validation';


const generateTransactionId = () => {
    return `TXN-${crypto.randomBytes(8).toString('hex').toLocaleUpperCase}`;

};

export const createPayment = async(tenantId: string, data: CreatePaymentInput) => {
    const rentalRequest = await prisma.rentalRequest.findUnique({
        where: {id: data.rentalRequestId},
        include: {property: true, payment: true},

    });

    if(!rentalRequest) {
        const error: any = new Error('Rental request not found');
        error.statusCode = 404;
        throw error;

    }

    if(rentalRequest.tenantId !== tenantId) {
        const error: any = new Error('You are not authorized to pay for this request');
        error.statusCode = 403;
        throw error;

    }

    if(rentalRequest.status !== 'APPROVED') {
        const error: any = new Error('This rental request is not approved yet');
        error.statusCode = 400;
        throw error;
    }

    if(rentalRequest.payment) {
        const error: any = new Error('Payment already exists for this rental request');
        error.statusCode = 409;
        throw error;
    }

    const transactionId = generateTransactionId();
    const payment = await prisma.payment.create({
        data: {
            transactionId,
            amount: rentalRequest.property.price,
            method: data.method,
            provider: data.provider,
            status: 'COMPLETED',
            paidAt: new Date(),
            rentalRequestId: rentalRequest.id,
        },
    });


    await prisma.rentalRequest.update({
        where: {id: rentalRequest.id},
        data: {status: 'ACTIVE'},
    });
    
    return payment;
};

export const getTenantPayments = async(tenantId: string) => {
    return prisma.payment.findMany({
        where: {
            rentalRequest: {tenantId},

        },
        include: {
            rentalRequest: {
                include: {property: true}
            },
        },
        orderBy: {createdAt: 'desc'},
    });
};

export const getPaymentById = async (id: string, userId: string) => {
    const payment = await prisma.payment.findUnique({
        where: {id},
        include: {
            rentalRequest: {
                include: {property: true, tenant: {select: {id: true, name: true, email: true}}}
            },
        },
    });
    if(!payment) {
        const error: any = new Error('Payment not found');
        error.statusCode = 404;
        throw error;
    }

    const isTenant = payment.rentalRequest.tenantId === userId;
    const isLandlord = payment.rentalRequest.property.landlordId === userId;


    if(!isTenant && isLandlord) {
        const error: any = new Error('you are not authorized to view this payment');
        error.statusCode = 403;
        throw error;

    }
    return payment;
};