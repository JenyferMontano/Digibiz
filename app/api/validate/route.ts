import { NextRequest, NextResponse } from 'next/server';
import { validateEvidence } from '@/lib/services';

export async function POST(request: NextRequest) {
  try {
    const { businessId, evidenceData, missionId } = await request.json();

    if (!businessId || !evidenceData || !missionId) {
      return NextResponse.json(
        { error: "businessId, evidenceData, and missionId are required" },
        { status: 400 }
      );
    }

    const result = await validateEvidence(businessId, evidenceData, missionId);

    return NextResponse.json({
      success: true,
      approved: result.validation.approved,
      feedback: result.validation.feedback,
      business: {
        businessId: result.business.businessId,
        currentLevel: result.business.currentLevel,
        completedMissions: result.business.completedMissions,
        progress: result.business.meta.progress
      }
    });
  } catch (error: any) {
    console.error('Error in validate:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

