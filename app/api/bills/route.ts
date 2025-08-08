import { NextResponse } from 'next/server';
import billsData from './bills.json';

export async function GET() {
  return NextResponse.json(billsData);
}
