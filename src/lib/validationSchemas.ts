import { z } from 'zod';

// Auth validation schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password too long')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim(),
  displayName: z.string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be at most 50 characters')
    .trim()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  password: z.string().min(1, 'Password is required')
});

// Post validation schemas
export const postSchema = z.object({
  content: z.string()
    .min(1, 'Post cannot be empty')
    .max(5000, 'Post must be at most 5000 characters')
    .trim(),
  media_url: z.string().url('Invalid URL').optional().nullable()
});

// Comment validation schema
export const commentSchema = z.object({
  content: z.string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be at most 1000 characters')
    .trim()
});

// Profile update schema
export const profileUpdateSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim()
    .optional(),
  display_name: z.string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be at most 50 characters')
    .trim()
    .optional(),
  bio: z.string()
    .max(500, 'Bio must be at most 500 characters')
    .trim()
    .optional()
    .nullable()
});

// Media caption schema
export const mediaCaptionSchema = z.object({
  caption: z.string()
    .max(200, 'Caption must be at most 200 characters')
    .trim()
    .optional()
    .nullable()
});

// Location schema
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});
