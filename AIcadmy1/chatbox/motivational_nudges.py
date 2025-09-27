# motivational_nudges.py
# Uses the Groq API to generate fresh motivational messages.

from groq import Groq

def get_motivational_nudge(api_key: str, context: str) -> str:
    """
    Generates a short, encouraging message for a student based on context.

    Args:
        api_key (str): The Groq API key.
        context (str): The situation the student is in (e.g., "starting a study session").

    Returns:
        str: A motivational message or a default message on error.
    """
    try:
        client = Groq(api_key=api_key)
        prompt = f"Generate a short, powerful, and encouraging message (1-2 sentences) for a student who is currently {context}."
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a motivational coach for students. Your tone is inspiring and positive. Keep your messages very short."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            # --- UPDATED MODEL NAME ---
            model="llama-3.1-70b-versatile",
            temperature=0.9, # Higher temperature for more creative/varied responses
            max_tokens=60,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"Error fetching nudge: {e}")
        return "You've got this! Keep up the great work."

