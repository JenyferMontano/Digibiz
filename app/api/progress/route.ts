import { NextRequest, NextResponse } from 'next/server';
import { getProcessProgress } from '@/lib/services';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId is required" },
        { status: 400 }
      );
    }

    const doc: any = await getProcessProgress(businessId);
    
    return NextResponse.json({ 
      success: true,
      business: {
        businessId: doc.businessId,
        currentLevel: doc.currentLevel,
        completedMissions: doc.completedMissions || [],
        activeMission: doc.activeMission,
        progress: doc.meta?.progress || 0,
        lastValidation: doc.lastValidation
      }
    });
  } catch (error: any) {
    console.error('Error in progress:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

