import prisma from "../../config/db";


export const getAllUsers = async()=> {
    return prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            phone: true,
            createdAt: true,
        },
        orderBy: {createdAt: 'desc'},
    });
};

export const updateUserStatus = async(userId: string, status: 'ACTIVE' | 'BANNED') => {
    const user = await prisma.user.findUnique({where: {id: userId}});


    if(!user) {
        const error: any = new Error('User not found')
        error.statusCode = 404,
        throw error;

    }

    if(user.role === 'ADMIN'){
        const error: any = new Error('Cannot change status of admin account');
        error.statusCode = 403,
        throw error;
    }

    return prisma.user.update({
        where: {id: userId},
        data: {status},
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });
};

export const getAllPropertiesAdmin = async()=> {
    return prisma.property.findMany({
        include: {
            category: true,
            landlord: {select: {id: true, name: true, email: true}},

        },
        orderBy: {createdAt: 'desc'},
    });
};

export const getLandlordRentalRequestsAdmin = async () => {
    return prisma.rentalRequest.findMany({
        include: {
            property: {select: {id: true, title: true, location: true}},
            tenant: {select: {id: true, name: true, email: true}},
            payment: true,
        },
        orderBy: {createdAt: 'desc'}
    });
};


export const getDashboardStats = async () => {
    const [totalUsers, totalTenants, totalLandlords, totalProperties, totalRentalRequests, totalRevenue] =
    await promise.all ([
        prisma.user.count(),
        prisma.user.count({where: {role: 'TENANT'}}),
        prisma.user.count({where: {role: 'LANDLORD'}}),
        prisma.property.count(),
        prisma.rentalRequest.count(),
        prisma.payment.aggregate({
            where: {status: 'COMPLETED'},
            _sum: {amount: true},
        }),
    ]);

    return {
        totalUsers,
        totalTenants,
        totalLandlords,
        totalProperties,
        totalRentalRequests,
        totalRevenue: totalRevenue._sum.amount || 0,
    };
};

