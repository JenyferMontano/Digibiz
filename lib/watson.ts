import axios from "axios";
import { IamAuthenticator } from "ibm-cloud-sdk-core";
import { 
  mockAssessmentAgent, 
  mockLeanCoachAgent, 
  mockExecutionAgent, 
  mockValidationAgent 
} from "./agent-mocks";

async function getIAMToken() {
  const apiKey = process.env.WATSONX_API_KEY || process.env.WATSONX_IAM_APIKEY || process.env.WXO_ATM_API_KEY;
  
  if (!apiKey) {
    console.error('No API key found in environment variables');
    throw new Error('WATSONX_API_KEY not configured');
  }
  
  try {
    const response = await axios.post(
      'https://iam.cloud.ibm.com/identity/token',
      'grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=' + encodeURIComponent(apiKey),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    );
    
    return response.data.access_token;
  } catch (error: any) {
    console.error('IAM Token error:', {
      status: error.response?.status,
      message: error.response?.data?.errorMessage || error.message,
      apiKeyPrefix: apiKey.substring(0, 10) + '...' // Log only prefix for security
    });
    throw error;
  }
}

const ORCHESTRATE_BASE_URL = process.env.WATSONX_ENDPOINT || process.env.WATSONX_URL!;
const ORCHESTRATE_HOST_URL = process.env.WATSONX_HOST_URL;

export async function callOrchestrateAgent(agentId: string, message: string, context: any = {}) {
  if (!ORCHESTRATE_HOST_URL) {
    console.warn('WATSONX_HOST_URL not configured, will use mock response');
    return null;
  }
  
  const orchestrationId = process.env.ORCHESTRATION_ID;
  if (!orchestrationId) {
    console.warn('ORCHESTRATION_ID not configured, will use mock response');
    return null;
  }
  
  try {
    const token = await getIAMToken();
    
    const endpoint = `${ORCHESTRATE_BASE_URL}/api/v1/agents/${agentId}/messages`;
    
    const payload = {
      input: {
        text: message
      },
      context: {
        global: {
          system: {
            orchestration_id: orchestrationId,
            agent_id: agentId
          }
        }
      }
    };

    console.log(`Calling agent ${agentId} at ${endpoint}`);

    const response = await axios.post(endpoint, payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 60000
    });

    console.log(`Agent ${agentId} response status: ${response.status}`);

    let responseText = null;
    
    if (response.data) {
      if (response.data.output) {
        if (response.data.output.text) {
          responseText = response.data.output.text;
        } else if (response.data.output.generic && Array.isArray(response.data.output.generic)) {
          const textResponse = response.data.output.generic.find((item: any) => item.response_type === 'text');
          responseText = textResponse?.text || response.data.output.generic[0]?.text;
        } else if (typeof response.data.output === 'string') {
          responseText = response.data.output;
        }
      }
      
      if (!responseText && response.data.text) {
        responseText = response.data.text;
      }
      
      if (!responseText && response.data.message) {
        responseText = response.data.message;
      }
      
      if (!responseText && response.data.response) {
        responseText = response.data.response;
      }
    }
    
    if (!responseText) {
      console.warn(`Could not extract text from agent ${agentId} response:`, JSON.stringify(response.data, null, 2));
      responseText = JSON.stringify(response.data);
    }

    return responseText;
  } catch (error: any) {
    console.error(`Error calling agent ${agentId}:`, {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      endpoint: error.config?.url
    });

    console.warn(`API call failed, watsonx Orchestrate may not have public REST API. Using mock response for demo.`);
    return null;
  }
}

export async function callAssessmentAgent(businessDescription: string) {
  const ASSESSMENT_AGENT_ID = process.env.ASSESSMENT_AGENT_ID!;
  const result = await callOrchestrateAgent(ASSESSMENT_AGENT_ID, businessDescription);
  if (result === null) {
    console.log('Using mock Assessment Agent response');
    return mockAssessmentAgent(businessDescription);
  }
  return result;
}

export async function callLeanCoachAgent(assessmentFindings: any, businessState: any = null) {
  const LEAN_COACH_AGENT_ID = process.env.LEAN_COACH_AGENT_ID!;
  const message = businessState 
    ? `Assessment findings: ${JSON.stringify(assessmentFindings)}\nBusiness state: ${JSON.stringify(businessState)}`
    : `Assessment findings: ${JSON.stringify(assessmentFindings)}`;
  const result = await callOrchestrateAgent(LEAN_COACH_AGENT_ID, message);
  if (result === null) {
    console.log('Using mock Lean Coach Agent response');
    return mockLeanCoachAgent(assessmentFindings, businessState);
  }
  return result;
}

export async function callExecutionAgent(missionData: any) {
  const EXECUTION_AGENT_ID = process.env.EXECUTION_AGENT_ID!;
  const result = await callOrchestrateAgent(EXECUTION_AGENT_ID, JSON.stringify(missionData));
  if (result === null) {
    console.log('Using mock Execution Agent response');
    return mockExecutionAgent(missionData);
  }
  return result;
}

export async function callValidationAgent(evidenceData: any, missionId: string) {
  const VALIDATION_AGENT_ID = process.env.VALIDATION_AGENT_ID!;
  const message = `Mission ID: ${missionId}\nEvidence: ${JSON.stringify(evidenceData)}`;
  const result = await callOrchestrateAgent(VALIDATION_AGENT_ID, message);
  if (result === null) {
    console.log('Using mock Validation Agent response');
    return mockValidationAgent(evidenceData, missionId);
  }
  return result;
}
