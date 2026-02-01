import crypto from "crypto";
import { createProcess, findBusinessProcess, updateProcess } from "./cloudant";
import { 
  callAssessmentAgent, 
  callLeanCoachAgent, 
  callExecutionAgent,
  callValidationAgent 
} from "./watson";

export async function startMission(businessId: string, businessDescription: string) {
  let business: any = await findBusinessProcess(businessId);
  
  if (!business) {
    business = {
      _id: crypto.randomUUID(),
      type: "process",
      businessId,
      currentLevel: "organize",
      completedMissions: [],
      evidenceUrls: [],
      activeMission: null,
      lastValidation: null,
      status: "started",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: [],
      meta: {
        progress: 0,
      },
    };
    await createProcess(business);
  }

  console.log(`Starting mission for business: ${businessId}`);
  const assessmentResponse = await callAssessmentAgent(businessDescription);
  console.log(`Assessment agent response received`);
  
  let assessmentFindings: any;
  try {
    assessmentFindings = JSON.parse(assessmentResponse);
  } catch (e) {
    const jsonMatch = assessmentResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        assessmentFindings = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.warn('Failed to parse assessment JSON, using fallback');
        assessmentFindings = { wastes_detected: [], raw_response: assessmentResponse };
      }
    } else {
      assessmentFindings = { wastes_detected: [], raw_response: assessmentResponse };
    }
  }

  const businessState = {
    currentLevel: business.currentLevel,
    completedMissions: business.completedMissions,
    activeMission: business.activeMission
  };
  console.log(`Calling Lean Coach agent with assessment findings`);
  const leanCoachResponse = await callLeanCoachAgent(assessmentFindings, businessState);
  console.log(`Lean Coach agent response received`);
  
  let missionData: any;
  try {
    missionData = JSON.parse(leanCoachResponse);
  } catch (e) {
    const jsonMatch = leanCoachResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        missionData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.warn('Failed to parse Lean Coach JSON, using fallback');
        missionData = { mission_id: "mission_map_process", raw_response: leanCoachResponse };
      }
    } else {
      missionData = { mission_id: "mission_map_process", raw_response: leanCoachResponse };
    }
  }

  console.log(`Calling Execution agent with mission data`);
  const executionResponse = await callExecutionAgent(missionData);
  console.log(`Execution agent response received`);
  
  let executionSteps: any;
  try {
    executionSteps = JSON.parse(executionResponse);
  } catch (e) {
    const jsonMatch = executionResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        executionSteps = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.warn('Failed to parse Execution JSON, using fallback');
        executionSteps = { steps: [], raw_response: executionResponse };
      }
    } else {
      executionSteps = { steps: [], raw_response: executionResponse };
    }
  }

  business.activeMission = missionData.mission_id || missionData.missionId;
  business.steps.push({
    step: "assessment",
    output: assessmentFindings,
    createdAt: new Date().toISOString(),
  });
  business.steps.push({
    step: "lean_coach",
    output: missionData,
    createdAt: new Date().toISOString(),
  });
  business.steps.push({
    step: "execution",
    output: executionSteps,
    createdAt: new Date().toISOString(),
  });
  business.updatedAt = new Date().toISOString();

  if (!business._id) {
    business._id = crypto.randomUUID();
  }

  await updateProcess(business._id, business);

  return {
    business,
    assessment: assessmentFindings,
    mission: missionData,
    execution: executionSteps
  };
}

export async function getProcessProgress(businessId: string) {
  const doc = await findBusinessProcess(businessId);

  if (!doc) {
    throw new Error("Process Not Found");
  }

  return doc;
}

export async function validateEvidence(businessId: string, evidenceData: any, missionId: string) {
  const business: any = await findBusinessProcess(businessId);

  if (!business) {
    throw new Error("Business Not Found");
  }

  console.log(`Validating evidence for mission: ${missionId}`);
  const validationResponse = await callValidationAgent(evidenceData, missionId);
  console.log(`Validation agent response received`);
  
  let validationResult: any;
  try {
    validationResult = JSON.parse(validationResponse);
  } catch (e) {
    const jsonMatch = validationResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        validationResult = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.warn('Failed to parse Validation JSON, using fallback');
        validationResult = { approved: false, feedback: "Could not parse validation response", raw_response: validationResponse };
      }
    } else {
      validationResult = { approved: false, feedback: "Could not parse validation response", raw_response: validationResponse };
    }
  }

  if (validationResult.approved) {
    if (!business.completedMissions.includes(missionId)) {
      business.completedMissions.push(missionId);
    }
    business.activeMission = null;
    business.meta.progress = Math.min(100, business.meta.progress + 20);
  }

  business.lastValidation = {
    missionId,
    approved: validationResult.approved,
    feedback: validationResult.feedback,
    timestamp: new Date().toISOString()
  };
  business.updatedAt = new Date().toISOString();

  await updateProcess(business._id, business);

  return {
    business,
    validation: validationResult
  };
}

export async function startMissionWithResults(businessId: string, agentResults: any) {
  let business: any = await findBusinessProcess(businessId);
  
  if (!business) {
    business = {
      _id: crypto.randomUUID(),
      type: "process",
      businessId,
      currentLevel: "organize",
      completedMissions: [],
      evidenceUrls: [],
      activeMission: null,
      lastValidation: null,
      status: "started",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: [],
      meta: {
        progress: 0,
      },
    };
    await createProcess(business);
  }

  const assessment = agentResults.assessment || {};
  const mission = agentResults.mission || {};
  const execution = agentResults.execution || {};

  business.activeMission = mission.mission_id || mission.missionId || null;
  business.steps.push({
    step: "assessment",
    output: assessment,
    createdAt: new Date().toISOString(),
  });
  business.steps.push({
    step: "lean_coach",
    output: mission,
    createdAt: new Date().toISOString(),
  });
  business.steps.push({
    step: "execution",
    output: execution,
    createdAt: new Date().toISOString(),
  });
  business.updatedAt = new Date().toISOString();

  await updateProcess(business._id, business);

  return {
    business,
    assessment,
    mission,
    execution
  };
}

