export function mockAssessmentAgent(businessDescription: string): string {
  const lowerDesc = businessDescription.toLowerCase();
  
  const wastes: any[] = [];
  
  if (lowerDesc.includes('waiting') || lowerDesc.includes('delay')) {
    wastes.push({
      type: "waiting",
      description: "Long waiting times identified in operations",
      severity: "high",
      impact: "Delays customer service and increases operational costs"
    });
  }
  
  if (lowerDesc.includes('inventory') || lowerDesc.includes('stock')) {
    wastes.push({
      type: "overproduction",
      description: "Inventory management inefficiencies detected",
      severity: "medium",
      impact: "Excess inventory ties up capital and storage space"
    });
  }
  
  if (lowerDesc.includes('movement') || lowerDesc.includes('transport')) {
    wastes.push({
      type: "transportation",
      description: "Unnecessary movement of materials or information",
      severity: "medium",
      impact: "Increases time and costs without adding value"
    });
  }
  
  if (wastes.length === 0) {
    wastes.push({
      type: "waiting",
      description: "Operational inefficiencies requiring process optimization",
      severity: "medium",
      impact: "Opportunity for Lean improvement"
    });
  }
  
  return JSON.stringify({
    wastes_detected: wastes,
    summary: `Analysis identified ${wastes.length} type(s) of waste requiring attention.`,
    next_action: "Proceed to mission selection with Lean Coach Agent"
  });
}

export function mockLeanCoachAgent(assessmentFindings: any, businessState: any): string {
  const currentLevel = businessState?.currentLevel || "organize";
  const completedMissions = businessState?.completedMissions || [];
  
  let missionId = "mission_map_process";
  let missionName = "Mission 1: Map Your Core Process";
  
  if (completedMissions.includes("mission_map_process")) {
    missionId = "mission_define_kpis";
    missionName = "Mission 2: Define Key Performance Indicators";
  }
  
  return JSON.stringify({
    mission_id: missionId,
    mission_name: missionName,
    level: currentLevel,
    reason: "Based on assessment findings, this mission addresses the identified waste",
    next_steps: "Proceed to Execution Agent for detailed action steps"
  });
}

export function mockExecutionAgent(missionData: any): string {
  const missionId = missionData.mission_id || missionData.missionId || "mission_map_process";
  
  const missionMap: any = {
    "mission_map_process": {
      mission_name: "Mission 1: Map Your Core Process",
      steps: [
        "Identify your core business process",
        "Document each step from start to finish",
        "Mark decision points and handoffs",
        "Create a visual process map",
        "Review and validate with your team"
      ],
      template_url: "/templates/core-process-map.pdf"
    },
    "mission_define_kpis": {
      mission_name: "Mission 2: Define Key Performance Indicators",
      steps: [
        "Identify key metrics for your process",
        "Define measurement methods",
        "Set target values",
        "Establish tracking frequency",
        "Document KPI definitions"
      ],
      template_url: "/templates/kpi-definition.pdf"
    }
  };
  
  const mission = missionMap[missionId] || missionMap["mission_map_process"];
  
  return JSON.stringify({
    mission_id: missionId,
    mission_name: mission.mission_name,
    steps: mission.steps,
    template_url: mission.template_url,
    estimated_time: "2-4 hours",
    success_criteria: "Complete process map with all steps documented"
  });
}

export function mockValidationAgent(evidenceData: any, missionId: string): string {
  const hasDescription = evidenceData?.description && evidenceData.description.length > 20;
  const hasType = evidenceData?.type;
  
  const approved = hasDescription && hasType;
  
  return JSON.stringify({
    approved: approved,
    feedback: approved 
      ? "Evidence meets mission requirements. Process map is complete and shows clear steps."
      : "Evidence incomplete. Please provide a detailed description and evidence type.",
    score: approved ? 85 : 40,
    improvements: approved ? [] : ["Add more detail to description", "Include evidence type"]
  });
}

