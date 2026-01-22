import { NextResponse } from 'next/server';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  let dbHealthy = false;

  try {
    // Check database connection with a simple query
    await db.execute(sql`SELECT 1`);
    dbHealthy = true;
  } catch (error) {
    console.error('Database health check failed:', error);
    dbHealthy = false;
  }

  return NextResponse.json({
    status: dbHealthy ? 'healthy' : 'degraded',
    database: dbHealthy ? 'connected' : 'error',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
