import { NextResponse } from 'next/server';
import billsData from '../../../mocks/bills.json';

export async function GET() {
  return NextResponse.json(billsData);
}
