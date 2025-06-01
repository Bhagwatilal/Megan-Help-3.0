// // Note: In a production app, this API key would be stored securely in a backend environment
// // For demonstration purposes, we're using a placeholder
// const API_KEY = "AIzaSyCuynAsF9les34Mj5Pqg0sD3yR9dlOjkCQ";
// const MODEL = "models/gemini-1.5-flash-001-tuning"; // Specifying the Gemini model

// export async function generateChatResponse(prompt: string): Promise<string> {
//   try {
//     console.log(`Sending prompt to Gemini API (${MODEL}):`, prompt);
    
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     // In a real implementation, we would make an API call like this:
    
//     const response = await fetch('https://generativelanguage.googleapis.com/v1beta/' + MODEL + ':generateContent', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-goog-api-key': API_KEY
//       },
//       body: JSON.stringify({
//         contents: [
//           {
//             role: 'user',
//             parts: [{ text: prompt }]
//           }
//         ],
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.95,
//           maxOutputTokens: 1000,
//         }
//       })
//     });
    
//     const data = await response.json();
//     return data.candidates[0].content.parts[0].text;
    
    
//     // Enhanced response patterns for mental health support
//     const lowerPrompt = prompt.toLowerCase();
    
//     // Anxiety-related responses
//     if (lowerPrompt.includes("anxiety") || lowerPrompt.includes("anxious") || lowerPrompt.includes("worried")) {
//       if (lowerPrompt.includes("breathing") || lowerPrompt.includes("calm")) {
//         return "Let's try a quick breathing exercise: Breathe in slowly for 4 counts, hold for 4, and exhale for 6. Repeat this 5 times. Many of our users find that our Mood Music section has calming playlists that help with anxiety. Would you like to try that?";
//       }
//       return "I understand you're experiencing anxiety. This is a common feeling, and there are several ways to manage it. Deep breathing can help - try breathing in for 4 counts, hold for 4, and exhale for 6. Some of our users also find that the Bubble Pop game in our Games section provides a helpful distraction when anxious thoughts arise. Would you like to explore some relaxation exercises or activities?";
//     }
    
//     // Depression-related responses
//     else if (lowerPrompt.includes("sad") || lowerPrompt.includes("depression") || lowerPrompt.includes("depressed") || lowerPrompt.includes("unhappy")) {
//       if (lowerPrompt.includes("help") || lowerPrompt.includes("what should i do")) {
//         return "When feeling low, small actions can make a difference. Our Journal section has guided prompts for gratitude exercises, which research shows can help improve mood over time. Also, the Color Therapy game might help you connect with emotions through colors. Would you like to try either of these?";
//       }
//       return "I'm sorry you're feeling down. Remember that it's okay to not be okay sometimes. Our Color Psychology activity might give you some insights into your emotional state, and the Journal feature can help you track your mood patterns over time. Some users also find that even a short 5-minute walk can help shift their perspective. Would you like me to suggest a specific activity based on your energy level right now?";
//     }
    
//     // Stress-related responses
//     else if (lowerPrompt.includes("stress") || lowerPrompt.includes("overwhelm") || lowerPrompt.includes("pressure")) {
//       if (lowerPrompt.includes("work") || lowerPrompt.includes("deadline")) {
//         return "Work stress can be challenging. Taking short breaks can actually improve productivity. Our Snake or Tetris games provide quick mental breaks. Also, the 'Focus' playlist in our Music section is designed to help with concentration. For immediate relief, try the '5-4-3-2-1' grounding technique: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.";
//       }
//       return "When you're feeling stressed, your body's fight-or-flight response can be activated. Grounding exercises can help. Try this: List three things you can see, two things you can touch, and one thing you can hear right now. Our Pong Challenge game requires focus that can help distract from stressful thoughts, and many users report that the rhythmic nature of Tetris has a calming effect.";
//     }
    
//     // Sleep-related responses
//     else if (lowerPrompt.includes("sleep") || lowerPrompt.includes("insomnia") || lowerPrompt.includes("can't sleep")) {
//       return "Trouble sleeping is frustrating. For better sleep, try avoiding screens an hour before bed. Our Music section has a 'Sleep' playlist with soothing sounds. The Journal feature can help you track sleep patterns or write down thoughts that might be keeping you awake. Some users also find that the Color Therapy activity helps them wind down before bedtime.";
//     }
    
//     // Activity suggestions
//     else if (lowerPrompt.includes("what should i do") || lowerPrompt.includes("suggest") || lowerPrompt.includes("recommendation")) {
//       return "Based on what you've shared, you might benefit from trying our Color Psychology activity to better understand your current emotional state. Many users also find that the Journaling feature helps them process feelings. If you're looking for a distraction, our Games section offers options like Snake, Tetris, and Pac-Man. Would you like a specific recommendation based on whether you want to reflect or distract?";
//     }
    
//     // General support
//     else if (lowerPrompt.includes("help") || lowerPrompt.includes("crisis")) {
//       return "If you're in crisis, please reach out to a mental health professional or call your local emergency services. I'm here to chat and suggest Mentii activities that might help, but I'm not a replacement for professional support when you really need it. Mentii offers tools like journaling, games for distraction, music for mood regulation, and more. What specific support are you looking for today?";
//     }
    
//     // Lighter responses
//     else if (lowerPrompt.includes("joke") || lowerPrompt.includes("funny")) {
//       return "Why don't scientists trust atoms? Because they make up everything! 😄 Laughter can be good medicine. If you're looking to boost your mood, our Games section has several options that might bring a smile to your face. The PacMan game is especially nostalgic for many users!";
//     }
    
//     // Default responses with activity suggestions
//     else {
//       const suggestions = [
//         "Thank you for sharing that with me. Based on what you've shared, you might find our Journal feature helpful for processing these thoughts. Many users also report that the Color Psychology activity provides interesting insights. How are you feeling right now on a scale of 1-10?",
//         "I appreciate you opening up. Mentii offers several tools that might help with what you're experiencing. Our Games section provides healthy distractions, while the Music feature has playlists for different moods. Would you like to explore either of these?",
//         "I hear you. Sometimes putting feelings into words is the first step. The Journal section has guided prompts that many users find helpful for self-reflection. The Color Therapy activity might also give you some visual ways to express what words can't. Would either of these interest you?",
//         "Thank you for trusting me with that. Remember that your feelings are valid. Mentii's activities are designed to support mental wellbeing - from games for distraction to music for emotional regulation. Based on what you've shared, you might find the Bubble Pop game helpful for releasing tension. Would you like to try it?"
//       ];
      
//       // Return a random suggestion for variety
//       return suggestions[Math.floor(Math.random() * suggestions.length)];
//     }
//   } catch (error) {
//     console.error("Error with Gemini API:", error);
//     return "I'm having trouble connecting right now. Could you try again in a moment? In the meantime, you might want to explore our Games or Music sections for some immediate support.";
//   }
// }


const API_KEY = "AIzaSyCuynAsF9les34Mj5Pqg0sD3yR9dlOjkCQ";
const MODEL = "tunedModels/cbt236-s6xu2hp80tx4"; // Specifying the Gemini model

export async function generateChatResponse(prompt: string): Promise<string> {
  try {
    console.log(`Sending prompt to Gemini API (${MODEL}):`, prompt);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, we would make an API call like this:
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/' + MODEL + ':generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
        }
      })
    });
    
    const data = await response.json();
    const rawResponse = data.candidates[0].content.parts[0].text;
    return removeMarkdownFormatting(rawResponse);
  } catch (error) {
    console.error("Error fetching response:", error);
    return "Sorry, an error occurred while processing your request.";
  }
}

// Function to remove Markdown formatting
function removeMarkdownFormatting(text: string): string {
    return text.replace(/\*\*\*(.*?)\*\*\*/g, "$1")  // Remove bold + italic
               .replace(/\*\*(.*?)\*\*/g, "$1")      // Remove bold
               .replace(/\*(.*?)\*/g, "$1")          // Remove italic
               .replace(/^\* /gm, "");               // Remove list item markers (* )
  }
