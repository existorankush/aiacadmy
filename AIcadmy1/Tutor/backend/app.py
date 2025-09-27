import os
import io
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from groq import Groq
import PyPDF2
import docx
import traceback

# --- Initialization ---
app = Flask(__name__, 
            template_folder='templates',
            static_folder='static')
CORS(app)

# --- Groq API Client Setup ---
# Strictly require the GROQ_API_KEY from environment; do not hard-code secrets
API_KEY = os.environ.get("GROQ_API_KEY")

client = None
try:
    if not API_KEY or "gsk_" not in API_KEY:
        print("\n--- FATAL ERROR: Groq API key is missing or invalid. ---")
        print("Please set the GROQ_API_KEY environment variable")
    else:
        client = Groq(api_key=API_KEY)
        print("\n--- Groq client initialized successfully. ---")
except Exception as e:
    print(f"An error occurred while initializing the Groq client: {e}")
    traceback.print_exc()

document_context = ""

# --- Homepage Route ---
@app.route('/')
def home():
    return render_template('index.html')

# --- Helper Function to Extract Text ---
def extract_text(file_stream, filename):
    """Extract text from various file formats"""
    file_extension = os.path.splitext(filename)[1].lower()
    try:
        if file_extension == '.pdf':
            pdf_stream = io.BytesIO(file_stream.getvalue())
            pdf_reader = PyPDF2.PdfReader(pdf_stream)
            text = ""
            for page in pdf_reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text.strip() if text.strip() else None
            
        elif file_extension == '.docx':
            docx_stream = io.BytesIO(file_stream.getvalue())
            doc = docx.Document(docx_stream)
            text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
            return text if text.strip() else None
            
        elif file_extension in ['.txt', '.md']:
            text = file_stream.read().decode('utf-8')
            return text if text.strip() else None
            
        return None
    except Exception as e:
        print(f"Error reading {filename}: {e}")
        traceback.print_exc()
        return None

# --- API Endpoints ---

@app.route('/upload-and-summarize', methods=['POST'])
def upload_and_summarize():
    """Handle file upload and generate summary"""
    global document_context
    
    print("\n--- Upload and Summarize Request Received ---")
    
    if client is None:
        print("ERROR: AI client is not initialized")
        return jsonify({"error": "AI client is not initialized. Check server logs."}), 500
    
    if 'file' not in request.files:
        print("ERROR: No file part in request")
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    if file.filename == '':
        print("ERROR: No file selected")
        return jsonify({"error": "No file selected"}), 400

    print(f"Processing file: {file.filename}")
    
    try:
        file_stream = io.BytesIO(file.read())
        extracted_text = extract_text(file_stream, file.filename)
        
        if extracted_text is None or not extracted_text.strip():
            print("ERROR: Could not extract text from file or file is empty")
            return jsonify({"error": "Could not extract text from file or file is empty"}), 400

        document_context = extracted_text
        print(f"Extracted text length: {len(document_context)} characters")
        
        # Truncate text if too long (Groq has context limits)
        max_chars = 15000  # Conservative limit
        text_to_summarize = document_context[:max_chars]
        if len(document_context) > max_chars:
            text_to_summarize += "\n\n[Document truncated for processing]"
            print(f"Document truncated to {max_chars} characters")

        print("Sending request to Groq API for summarization...")
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system", 
                    "content": "You are a skilled study assistant. Create a clear, comprehensive summary of the provided document. Focus on key concepts, main ideas, and important details that would help a student understand the material."
                },
                {
                    "role": "user", 
                    "content": f"Please provide a detailed summary of this document:\n\n{text_to_summarize}"
                }
            ],
            model="llama-3.1-8b-instant",
            temperature=0.3,
            max_tokens=1000
        )
        
        summary = chat_completion.choices[0].message.content
        print("Summary generated successfully")
        print(f"Summary length: {len(summary)} characters")
        
        return jsonify({"summary": summary})
        
    except Exception as e:
        print(f"\n--- GROQ API ERROR (Summarization) ---")
        print(f"Error: {str(e)}")
        traceback.print_exc()
        print("--- END OF ERROR ---\n")
        return jsonify({"error": f"Failed to generate summary: {str(e)}"}), 500

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat requests"""
    global document_context
    
    print("\n--- Chat Request Received ---")
    
    if client is None:
        print("ERROR: AI client is not initialized")
        return jsonify({"error": "AI client is not initialized. Check server logs."}), 500
    
    try:
        request_data = request.get_json()
        if not request_data:
            print("ERROR: No JSON data in request")
            return jsonify({"error": "Invalid request format"}), 400
            
        user_question = request_data.get("question")
        if not user_question:
            print("ERROR: No question provided")
            return jsonify({"error": "No question provided"}), 400
            
        if not document_context or not document_context.strip():
            print("ERROR: No document context available")
            return jsonify({"error": "Please upload a document first"}), 400

        print(f"User question: {user_question}")
        print(f"Document context length: {len(document_context)} characters")
        
        # Prepare context with length limit
        max_context_chars = 12000  # Leave room for question and system prompt
        context_to_use = document_context[:max_context_chars]
        if len(document_context) > max_context_chars:
            context_to_use += "\n\n[Note: Document was truncated due to length]"

        system_prompt = f"""You are an AI Tutor Bot specialized in helping students understand their study materials. 

IMPORTANT RULES:
1. Answer questions based ONLY on the document content provided below
2. If the question cannot be answered from the document, say: "I can only answer questions based on the uploaded document. This information is not available in your material."
3. Be helpful, clear, and educational in your responses
4. If you need to explain concepts, do so in a student-friendly way
5. Always stay focused on the document content

DOCUMENT CONTENT:
---
{context_to_use}
---

Remember: Only use information from the document above to answer questions."""

        print("Sending request to Groq API for chat response...")
        
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_question}
            ],
            model="llama-3.1-8b-instant",
            temperature=0.4,
            max_tokens=800
        )
        
        answer = chat_completion.choices[0].message.content
        print("Chat response generated successfully")
        print(f"Response length: {len(answer)} characters")
        
        return jsonify({"answer": answer})
        
    except Exception as e:
        print(f"\n--- CHAT ERROR ---")
        print(f"Error: {str(e)}")
        traceback.print_exc()
        print("--- END OF ERROR ---\n")
        return jsonify({"error": f"Failed to get chat response: {str(e)}"}), 500

# --- Health Check Endpoint ---
@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        "status": "healthy",
        "groq_client": "initialized" if client else "not_initialized",
        "has_document": bool(document_context)
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("AI TUTOR BOT SERVER STARTING")
    print("="*50)
    print(f"Groq Client Status: {'✓ Initialized' if client else '✗ Failed'}")
    print(f"API Key Status: {'✓ Present' if API_KEY else '✗ Missing'}")
    print("Server will run on: http://127.0.0.1:5000")
    print("="*50 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)