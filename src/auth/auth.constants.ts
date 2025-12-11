export const authConstants = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: (process.env.JWT_EXPIRY || '7d') as string,
};