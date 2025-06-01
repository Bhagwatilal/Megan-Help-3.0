import { useEffect, useState } from 'react';
import { initPlayAI } from '@/utils/playAIConfig';

export const usePlayAI = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);
  const MAX_ATTEMPTS = 5;

  useEffect(() => {
    // Function to handle PlayAI initialization
    const setupPlayAI = () => {
      try {
        console.log("Setting up PlayAI...", window.PlayAI);
        const success = initPlayAI();
        setIsLoaded(success);
        if (!success) {
          // If initialization fails, increment attempts counter
          setInitAttempts(prev => prev + 1);
        }
      } catch (error) {
        console.error("Error during PlayAI setup:", error);
        setInitAttempts(prev => prev + 1);
      }
    };

    // If we've reached max attempts, stop trying
    if (initAttempts >= MAX_ATTEMPTS) {
      console.warn(`Reached maximum ${MAX_ATTEMPTS} attempts to initialize PlayAI. Giving up.`);
      return;
    }

    // Check if PlayAI is already available
    if (window.PlayAI) {
      console.log("PlayAI object available, attempting setup");
      setupPlayAI();
    } else {
      console.log("PlayAI not yet available, setting up fallbacks");
      
      // Set a timeout to check again soon
      const initTimeout = setTimeout(() => {
        if (window.PlayAI) {
          console.log("PlayAI loaded after timeout");
          setupPlayAI();
        } else {
          console.log("PlayAI still not available after timeout");
          setInitAttempts(prev => prev + 1);
        }
      }, 1000);
      
      // Create the mock PlayAI object if it doesn't exist after a delay
      const createMockTimeout = setTimeout(() => {
        if (!window.PlayAI) {
          console.warn("Creating mock PlayAI implementation as fallback");
          window.PlayAI = {
            initialize: (config) => {
              console.log("Mock PlayAI initialized with:", config);
            },
            openAgent: (agentId) => {
              console.log("Mock PlayAI agent opened:", agentId);
              alert(`Would open PlayAI agent: ${agentId}`);
            }
          };
          setupPlayAI();
        }
      }, 2000);
      
      // Clean up
      return () => {
        clearTimeout(initTimeout);
        clearTimeout(createMockTimeout);
      };
    }
  }, [initAttempts]);
  
  return { isLoaded };
};
