# web_app.py
# This file creates a Flask web server to connect your Python logic to the HTML frontend.

import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
from study_buddy import StudyBuddy 

# Load environment variables from your .env file
load_dotenv()

# Initialize the Flask app
app = Flask(__name__)
# CORS is required to allow your website (frontend) to send requests to this server (backend)
CORS(app) 

# Get the API key from the .env file and create an instance of our StudyBuddy
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    # This will stop the app if the API key is missing
    raise ValueError("Error: GROQ_API_KEY environment variable not found in .env file.")
buddy = StudyBuddy(api_key)

# --- Define the routes (URLs) for our web application ---

@app.route('/')
def home():
    """
    This is the main route for your website's homepage.
    When a user visits http://127.0.0.1:5000/, this function runs.
    It finds the 'index.html' file in your 'templates' folder and displays it.
    """
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """
    This is the API endpoint that your website's JavaScript will send messages to.
    It only accepts POST requests, which are used for sending data.
    """
    # Get the JSON data that was sent from the JavaScript
    data = request.get_json()
    user_message = data.get('message')
    history = data.get('history', [])

    if not user_message:
        return jsonify({"error": "No message was provided"}), 400

    # The conversation history must include the new user message to maintain context
    history.append({"role": "user", "content": user_message})
    
    # Use the StudyBuddy logic from your other file to get a response from the AI
    system_prompt = "You are 'StudyBuddy', a friendly and helpful AI assistant for students."
    ai_response_text = buddy._get_chat_response(system_prompt, history)

    # Add the AI's new response to the history
    history.append({"role": "assistant", "content": ai_response_text})

    # Send the AI's latest message and the updated history back to the JavaScript
    return jsonify({
        "latest_response": ai_response_text,
        "history": history
    })

# --- This section starts the web server ---

if __name__ == '__main__':
    # This will run the Flask app when you execute "python web_app.py" in the terminal.
    # debug=True allows the server to auto-reload when you save changes to the file.
    app.run(debug=True)

