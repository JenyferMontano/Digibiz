import { NextRequest, NextResponse } from 'next/server';
import { startMission, startMissionWithResults } from '@/lib/services';

export async function POST(request: NextRequest) {
  try {
    const { businessId, businessDescription, agentResults } = await request.json();

    if (!businessId || !businessDescription) {
      return NextResponse.json(
        { error: "businessId and businessDescription are required" },
        { status: 400 }
      );
    }

    if (agentResults) {
      const result = await startMissionWithResults(businessId, agentResults);
      return NextResponse.json({
        success: true,
        businessId: result.business.businessId,
        currentLevel: result.business.currentLevel,
        activeMission: result.business.activeMission,
        assessment: result.assessment,
        mission: result.mission,
        execution: result.execution
      });
    }

    const result = await startMission(businessId, businessDescription);

    return NextResponse.json({
      success: true,
      businessId: result.business.businessId,
      currentLevel: result.business.currentLevel,
      activeMission: result.business.activeMission,
      assessment: result.assessment,
      mission: result.mission,
      execution: result.execution
    });
  } catch (error: any) {
    console.error('Error in start:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

