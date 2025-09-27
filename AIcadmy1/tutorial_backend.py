#!/usr/bin/env python3
"""
Tutorial Backend with Flask, Socket.IO, and ngrok integration
Provides real-time communication for the tutorial page
"""

import os
import json
import time
from datetime import datetime
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
import threading

# Initialize Flask app
app = Flask(__name__, 
            template_folder='AIcadmy1',
            static_folder='AIcadmy1')
app.config['SECRET_KEY'] = 'tutorial_secret_key_2024'
CORS(app, origins="*")

# Initialize Socket.IO with CORS support
socketio = SocketIO(app, cors_allowed_origins="*", 
                   async_mode='threading',
                   logger=True, 
                   engineio_logger=True)

# Global storage for tutorial data
tutorial_data = {
    'visits': [],
    'active_users': {},
    'progress_tracking': {},
    'study_sessions': [],
    'backend_status': {'available': True, 'started_at': datetime.now().isoformat()}
}

# --- HTTP Routes ---

@app.route('/')
def index():
    """Serve the main tutorial page"""
    return send_from_directory('AIcadmy1', 'tutorial.html')

@app.route('/AIcadmy1/<path:filename>')
def serve_static(filename):
    """Serve static files from AIcadmy1 directory"""
    return send_from_directory('AIcadmy1', filename)

@app.route('/api/tutorial/status', methods=['GET'])
def get_tutorial_status():
    """Get current tutorial backend status"""
    return jsonify({
        'status': 'active',
        'backend_available': True,
        'active_users': len(tutorial_data['active_users']),
        'total_visits': len(tutorial_data['visits']),
        'uptime': datetime.now().isoformat(),
        'features': ['real_time_tracking', 'progress_sync', 'collaborative_learning']
    })

@app.route('/api/tutorial/visits', methods=['GET', 'POST'])
def handle_visits():
    """Handle visit tracking"""
    if request.method == 'POST':
        visit_data = request.get_json()
        visit_record = {
            'timestamp': datetime.now().isoformat(),
            'user_id': visit_data.get('user_id', 'anonymous'),
            'page': visit_data.get('page', 'tutorial.html'),
            'user_agent': request.headers.get('User-Agent', ''),
            'ip': request.remote_addr
        }
        tutorial_data['visits'].append(visit_record)
        
        # Emit to all connected clients
        socketio.emit('visit_recorded', visit_record, broadcast=True)
        
        return jsonify({'success': True, 'visit_id': len(tutorial_data['visits'])})
    
    # GET request - return visit history
    return jsonify({
        'visits': tutorial_data['visits'][-50:],  # Last 50 visits
        'total_count': len(tutorial_data['visits'])
    })

@app.route('/api/tutorial/progress', methods=['GET', 'POST'])
def handle_progress():
    """Handle progress tracking"""
    if request.method == 'POST':
        progress_data = request.get_json()
        user_id = progress_data.get('user_id', 'anonymous')
        
        progress_record = {
            'user_id': user_id,
            'timestamp': datetime.now().isoformat(),
            'action': progress_data.get('action', 'unknown'),
            'data': progress_data.get('data', {})
        }
        
        if user_id not in tutorial_data['progress_tracking']:
            tutorial_data['progress_tracking'][user_id] = []
        
        tutorial_data['progress_tracking'][user_id].append(progress_record)
        
        # Emit progress update
        socketio.emit('progress_updated', progress_record, broadcast=True)
        
        return jsonify({'success': True, 'progress_id': len(tutorial_data['progress_tracking'][user_id])})
    
    # GET request
    user_id = request.args.get('user_id', 'anonymous')
    user_progress = tutorial_data['progress_tracking'].get(user_id, [])
    
    return jsonify({
        'progress': user_progress[-20:],  # Last 20 progress records
        'total_count': len(user_progress)
    })

@app.route('/api/tutorial/study-session', methods=['POST'])
def start_study_session():
    """Start a new study session"""
    session_data = request.get_json()
    
    study_session = {
        'session_id': f"session_{int(time.time())}",
        'user_id': session_data.get('user_id', 'anonymous'),
        'started_at': datetime.now().isoformat(),
        'topic': session_data.get('topic', 'General'),
        'goals': session_data.get('goals', []),
        'active': True
    }
    
    tutorial_data['study_sessions'].append(study_session)
    
    # Emit session start
    socketio.emit('study_session_started', study_session, broadcast=True)
    
    return jsonify({'success': True, 'session': study_session})

# --- Socket.IO Events ---

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    client_id = request.sid
    user_data = {
        'client_id': client_id,
        'connected_at': datetime.now().isoformat(),
        'ip': request.remote_addr
    }
    
    tutorial_data['active_users'][client_id] = user_data
    
    # Join general tutorial room
    join_room('tutorial_room')
    
    # Send welcome message
    emit('connected', {
        'message': 'Connected to Tutorial Backend',
        'client_id': client_id,
        'active_users': len(tutorial_data['active_users']),
        'backend_features': ['real_time_sync', 'progress_tracking', 'collaborative_tools']
    })
    
    # Broadcast user joined to others
    emit('user_joined', {
        'user_count': len(tutorial_data['active_users']),
        'timestamp': datetime.now().isoformat()
    }, room='tutorial_room', include_self=False)
    
    print(f"Client {client_id} connected. Total users: {len(tutorial_data['active_users'])}")

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    client_id = request.sid
    
    if client_id in tutorial_data['active_users']:
        del tutorial_data['active_users'][client_id]
    
    leave_room('tutorial_room')
    
    # Broadcast user left
    emit('user_left', {
        'user_count': len(tutorial_data['active_users']),
        'timestamp': datetime.now().isoformat()
    }, room='tutorial_room')
    
    print(f"Client {client_id} disconnected. Total users: {len(tutorial_data['active_users'])}")

@socketio.on('tutorial_interaction')
def handle_tutorial_interaction(data):
    """Handle tutorial page interactions"""
    client_id = request.sid
    
    interaction_data = {
        'client_id': client_id,
        'timestamp': datetime.now().isoformat(),
        'type': data.get('type', 'unknown'),
        'target': data.get('target', ''),
        'value': data.get('value', '')
    }
    
    # Broadcast interaction to all users in tutorial room
    emit('interaction_broadcast', interaction_data, room='tutorial_room', include_self=False)
    
    # Send acknowledgment
    emit('interaction_received', {
        'success': True,
        'interaction_id': f"int_{int(time.time())}"
    })

@socketio.on('request_sync')
def handle_sync_request():
    """Handle sync request from client"""
    emit('sync_data', {
        'active_users': len(tutorial_data['active_users']),
        'recent_visits': tutorial_data['visits'][-5:],
        'backend_status': tutorial_data['backend_status'],
        'timestamp': datetime.now().isoformat()
    })

# --- ngrok Integration ---

def start_ngrok():
    """Start ngrok tunnel"""
    try:
        from pyngrok import ngrok
        
        # Kill any existing ngrok processes
        ngrok.kill()
        
        # Start tunnel on port 5001
        public_url = ngrok.connect(5001, "http")
        print(f"\n{'='*60}")
        print(f"🚀 TUTORIAL BACKEND WITH NGROK STARTED")
        print(f"{'='*60}")
        print(f"📍 Local URL: http://localhost:5001")
        print(f"🌐 Public URL: {public_url}")
        print(f"📄 Tutorial Page: {public_url}/")
        print(f"🔌 Socket.IO: {public_url}/socket.io/")
        print(f"📊 API Status: {public_url}/api/tutorial/status")
        print(f"{'='*60}\n")
        
        # Store ngrok URL
        tutorial_data['ngrok_url'] = str(public_url)
        tutorial_data['backend_status']['ngrok_active'] = True
        tutorial_data['backend_status']['public_url'] = str(public_url)
        
        return str(public_url)
        
    except ImportError:
        print("\n⚠️  pyngrok not installed. Install with: pip install pyngrok")
        print("Running in local mode only...")
        return None
    except Exception as e:
        print(f"\n❌ ngrok setup failed: {str(e)}")
        print("Running in local mode only...")
        return None

def cleanup_ngrok():
    """Cleanup ngrok on shutdown"""
    try:
        from pyngrok import ngrok
        ngrok.kill()
        print("🔌 ngrok tunnel closed")
    except:
        pass

# --- Main Execution ---

if __name__ == '__main__':
    print("\n🎓 Starting AIcademy Tutorial Backend...")
    
    # Start ngrok in a separate thread
    ngrok_url = None
    try:
        ngrok_thread = threading.Thread(target=lambda: start_ngrok())
        ngrok_thread.daemon = True
        ngrok_thread.start()
        time.sleep(2)  # Give ngrok time to start
        ngrok_url = start_ngrok()
    except Exception as e:
        print(f"ngrok startup issue: {e}")
    
    try:
        # Start the Flask-SocketIO server
        socketio.run(app, 
                    host='0.0.0.0', 
                    port=5001, 
                    debug=True,
                    use_reloader=False)  # Disable reloader to prevent ngrok issues
    except KeyboardInterrupt:
        print("\n🛑 Shutting down...")
        cleanup_ngrok()
    except Exception as e:
        print(f"❌ Server error: {e}")
        cleanup_ngrok()