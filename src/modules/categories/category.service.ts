import prisma from '../../config/db';
import { CreateCategoryInput } from './category.validation';

export const createCategory = async (data: CreateCategoryInput) => {
    const existing = await prisma.category.findUnique({
        where: { name: data.name },
    });

    if (existing) {
        const error: any = new Error('Category already exists');
        error.statusCode = 409;
        throw error;
    }   

    return prisma.category.create({ data });
};

export const getAllCategories = async () => {
    return prisma.category.findMany({
        orderBy: { createdAt: 'asc' },
    });
};

export const getCategoryById = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: { id },
    });

    if (!category) {
        const error: any = new Error('Category not found');
        error.statusCode = 404;
        throw error;
    }

    return category;
};

export const deleteCategory = async (id: string) => {
    await getCategoryById(id); // Ensure category exists before deleting

    return prisma.category.delete({
        where: { id },
    });
};