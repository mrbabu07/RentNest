import bcrypt from 'bcryptjs';
import prisma from '../../config/db';
import { generateToken } from '../../utils/jwt.utils';
import { RegisterInput, LoginInput } from './auth.validation';

export const registerUser = async (data: RegisterInput) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    const error: any = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      phone: data.phone,
    },
  });

  // Generate token
  const token = generateToken({ userId: user.id, role: user.role });

  // Don't send password back
  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    const error: any = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (user.status === 'BANNED') {
    const error: any = new Error('Your account has been banned');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    const error: any = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ userId: user.id, role: user.role });

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};