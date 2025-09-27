# study_buddy.py
# Handles all interactions with the Groq API for conversational features.

import os
from groq import Groq

class StudyBuddy:
    """A class to represent the AI Study Buddy's conversational abilities."""

    def __init__(self, api_key):
        """Initializes the StudyBuddy with a Groq API key."""
        try:
            self.client = Groq(api_key=api_key)
        except Exception as e:
            raise ConnectionError(f"Failed to initialize Groq client: {e}")

    def _get_chat_response(self, system_prompt, conversation_history):
        """
        Private method to get a response from the Groq API.
        
        Args:
            system_prompt (str): The initial instruction for the AI's persona.
            conversation_history (list): The list of messages in the conversation.
        
        Returns:
            str: The AI's response text, or an error message.
        """
        try:
            messages = [{"role": "system", "content": system_prompt}] + conversation_history
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                # --- FINAL UPDATED MODEL NAME ---
                model="llama-3.1-8b-instant",
                temperature=0.7,
                max_tokens=1024,
            )
            return chat_completion.choices[0].message.content
        except Exception as e:
            return f"Sorry, I encountered an error trying to connect to the API: {e}"

    def start_chat_session(self):
        """Initiates a 'Want to Talk' session with an empathetic AI."""
        system_prompt = """
        You are 'StudyBuddy', a friendly and empathetic AI assistant. Your goal is to be a supportive friend to the student. 
        Listen to their concerns, validate their feelings (e.g., "That sounds really tough"), and offer gentle encouragement.
        Keep your responses concise and conversational. Do not give life advice.
        
        IMPORTANT SAFETY RULE: You are not a therapist. If the conversation involves topics of severe mental distress, crisis, or self-harm, 
        you MUST immediately respond with: "It sounds like you are going through a very difficult time. It's important to talk to someone who can support you. Please reach out to a professional."
        """
        print("\n--- Chat Session ---")
        print("I'm here to listen. What's on your mind? (Type 'end' to finish the chat)")
        
        conversation = []
        while True:
            user_input = input("You: ")
            if user_input.lower() == 'end':
                print("StudyBuddy: Thanks for sharing. I'm here anytime you need to talk.")
                break
            
            conversation.append({"role": "user", "content": user_input})
            response = self._get_chat_response(system_prompt, conversation)
            print(f"StudyBuddy: {response}")
            conversation.append({"role": "assistant", "content": response})

    def start_brainstorming_session(self):
        """Initiates a brainstorming session for academic topics."""
        system_prompt = """
        You are an expert academic brainstorming assistant. Your task is to help a student explore topics for a project or essay. 
        Ask clarifying questions to help them narrow their focus. Suggest different angles, generate potential thesis statements, 
        and help structure their ideas into a logical outline. Use lists and clear headings to organize your output and keep responses focused.
        """
        print("\n--- Brainstorming Session ---")
        print("Let's brainstorm! What project or essay are you working on? (Type 'end' to finish)")
        
        conversation = []
        while True:
            user_input = input("You: ")
            if user_input.lower() == 'end':
                print("StudyBuddy: Great session! You've got some solid ideas to start with.")
                break
            
            conversation.append({"role": "user", "content": user_input})
            response = self._get_chat_response(system_prompt, conversation)
            print(f"StudyBuddy: {response}")
            conversation.append({"role": "assistant", "content": response})

