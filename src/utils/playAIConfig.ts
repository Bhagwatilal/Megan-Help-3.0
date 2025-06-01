const CREDENTIALS = {
  srk: {
    apiKey: 'ak-166c63af72164613ab302951fa89ef7f',
    userId: 'h36PjGMRUYY9FDsiux35gUmiiXR2',
    agentId: 'u42h-yi4bzdbPg_rrqJyi'
  },
  ratanTata: {
    apiKey: 'ak-5ad8e4d13d2e4557b1633057657a6e82', 
    userId: '5lQ7E5qbiXWCdZ6yw4RhAfP61f82',
    agentId: 'zFKdgZGfcSrXs6rahx0jW'
  }
};

// Default to Ratan Tata credentials
export let PLAYAI_API_KEY = CREDENTIALS.ratanTata.apiKey;
export let PLAYAI_USER_ID = CREDENTIALS.ratanTata.userId;
export let PLAYAI_AGENT_ID = CREDENTIALS.ratanTata.agentId;

// Function to switch credentials
export const switchPersona = (persona: 'srk' | 'ratanTata') => {
  switch(persona) {
    case 'srk':
      PLAYAI_API_KEY = CREDENTIALS.srk.apiKey;
      PLAYAI_USER_ID = CREDENTIALS.srk.userId;
      PLAYAI_AGENT_ID = CREDENTIALS.srk.agentId;
      break;
    case 'ratanTata':
      PLAYAI_API_KEY = CREDENTIALS.ratanTata.apiKey;
      PLAYAI_USER_ID = CREDENTIALS.ratanTata.userId;
      PLAYAI_AGENT_ID = CREDENTIALS.ratanTata.agentId;
      break;
  }
};

export const initPlayAI = () => {
  if (window.PlayAI) {
    try {
      window.PlayAI.init({
        apiKey: PLAYAI_API_KEY,
        userId: PLAYAI_USER_ID
      });
      return true;
    } catch (error) {
      console.error("Error initializing PlayAI:", error);
      return false;
    }
  }
  return false;
};
