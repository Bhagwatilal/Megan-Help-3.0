import { PLAYAI_API_KEY, PLAYAI_USER_ID, PLAYAI_AGENT_ID, initPlayAI } from './playAIConfig';

// Initialize PlayAI when the module is loaded
initPlayAI();

export const openPlayAI = async (agentId?: string) => {
  // Remove any existing event listeners to prevent duplicates
  window.removeEventListener('message', handlePlayAIClose);
  
  if (!window.PlayAI) {
    console.error("PlayAI SDK not available");
    throw new Error("PlayAI SDK not available");
  }
  
  const targetAgentId = agentId || PLAYAI_AGENT_ID;
  console.log("Attempting to open PlayAI agent:", targetAgentId);
  
  try {
    // Initialize PlayAI with current credentials
    if (typeof window.PlayAI.initialize === 'function') {
      window.PlayAI.initialize({
        apiKey: PLAYAI_API_KEY,
        userId: PLAYAI_USER_ID
      });
    } else if (typeof window.PlayAI.init === 'function') {
      window.PlayAI.init({
        apiKey: PLAYAI_API_KEY,
        userId: PLAYAI_USER_ID
      });
    }

    // Try openAgent method first (preferred API)
    if (typeof window.PlayAI.openAgent === 'function') {
      window.PlayAI.openAgent(targetAgentId);
      console.log("Opened PlayAI agent using openAgent method");
    }
    // Fallback to open method if available
    else if (typeof window.PlayAI.open === 'function') {
      window.PlayAI.open(targetAgentId);
      console.log("Opened PlayAI agent using open method");
    } else {
      throw new Error("No valid PlayAI open method found");
    }
    
    // Add event listener for closing
    window.addEventListener('message', handlePlayAIClose);
    
  } catch (error) {
    console.error("Error opening PlayAI:", error);
    throw error;
  }
};

export const closePlayAI = async () => {
  try {
    // Try to find all possible PlayAI elements
    const selectors = [
      '#play-ai-container',
      '.play-ai-widget',
      '[data-playai]',
      'iframe[src*="playai"]'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => element.remove());
    });
    
    // If PlayAI SDK has a close method, call it
    if (window.PlayAI?.close) {
      window.PlayAI.close();
    }
    
    // Remove event listener
    window.removeEventListener('message', handlePlayAIClose);
    
    console.log("PlayAI closed successfully");
  } catch (error) {
    console.error("Error closing PlayAI:", error);
    throw error;
  }
};

// Helper function to handle PlayAI close messages
const handlePlayAIClose = (event: MessageEvent) => {
  if (event.data.type === 'CLOSE_PLAY_AI') {
    closePlayAI();
  }
};

// Chat data and helper functions for community features
export interface GroupChatUser {
  id: string;
  name: string;
  avatar: string;
}

export const groupChatUsers: GroupChatUser[] = [
  { id: 'user1', name: 'Raj Patel', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 'user2', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 'user3', name: 'Ajay Singh', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 'user4', name: 'Neha Gupta', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: 'user5', name: 'Vikram Mehta', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 'user6', name: 'Ananya Reddy', avatar: 'https://i.pravatar.cc/150?img=20' },
  { id: 'user7', name: 'Arjun Kumar', avatar: 'https://i.pravatar.cc/150?img=15' },
  { id: 'user8', name: 'Pooja Verma', avatar: 'https://i.pravatar.cc/150?img=32' }
];

export interface ChatMessage {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
    isCurrentUser: boolean;
  };
  timestamp: Date;
}

export const getSampleMessages = (groupId: number): ChatMessage[] => {
  const messages: ChatMessage[] = [
    {
      id: 'msg1',
      content: 'Welcome to the group! Feel free to share your thoughts and experiences.',
      sender: {
        id: 'admin',
        name: 'Group Admin',
        avatar: 'https://i.pravatar.cc/150?img=12',
        isCurrentUser: false
      },
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'msg2',
      content: 'Thanks for having me! I\'ve been struggling with anxiety lately and looking for support.',
      sender: {
        id: 'user2',
        name: 'Priya Sharma',
        avatar: 'https://i.pravatar.cc/150?img=5',
        isCurrentUser: false
      },
      timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000)
    },
    {
      id: 'msg3',
      content: 'I understand how you feel. Meditation has helped me a lot with my anxiety.',
      sender: {
        id: 'user3',
        name: 'Ajay Singh',
        avatar: 'https://i.pravatar.cc/150?img=3',
        isCurrentUser: false
      },
      timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000)
    }
  ];
  
  // Add some group-specific messages
  if (groupId === 1) {
    messages.push({
      id: 'grp1-msg',
      content: 'This anxiety support group has been a lifesaver for me!',
      sender: {
        id: 'user4',
        name: 'Neha Gupta',
        avatar: 'https://i.pravatar.cc/150?img=8',
        isCurrentUser: false
      },
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000)
    });
  } else if (groupId === 2) {
    messages.push({
      id: 'grp2-msg',
      content: 'I\'ve been practicing mindfulness for 3 weeks now and seeing improvements.',
      sender: {
        id: 'user5',
        name: 'Vikram Mehta',
        avatar: 'https://i.pravatar.cc/150?img=12',
        isCurrentUser: false
      },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    });
  }
  
  return messages;
};

export const getGroupTopics = (groupId: number): string[] => {
  const commonTopics = ['Mental Health', 'Self-Care', 'Support'];
  
  const groupSpecificTopics: Record<number, string[]> = {
    1: ['Anxiety', 'Stress Management', 'Coping Strategies'],
    2: ['Mindfulness', 'Meditation', 'Breathing Techniques'],
    3: ['Depression', 'Mood Disorders', 'Therapy'],
    4: ['Work-Life Balance', 'Burnout', 'Productivity'],
    5: ['Relationships', 'Social Anxiety', 'Communication']
  };
  
  return [...commonTopics, ...(groupSpecificTopics[groupId] || [])];
};

// Emoji utility functions
export const popularEmojis = [
  "😊", "👍", "❤️", "😂", "🙏", "😎", "🤔", 
  "😢", "😍", "👋", "🌟", "💪", "🙌", "🎉", 
  "✨", "🔥", "👏", "💯", "🤗", "😌", "🙂",
  "😀", "🥰", "😇", "🤩", "😋", "😉", "🤣"
];

// Update PlayAI type definition with more robust interface
declare global {
  interface Window {
    PlayAI?: {
      init?: (config: { apiKey: string; userId: string }) => void;
      initialize?: (config: { apiKey: string; userId: string }) => void;
      open?: (agentId: string) => void;
      openAgent?: (agentId: string) => void;
      close?: () => void;
      [key: string]: any;
    };
  }
}
