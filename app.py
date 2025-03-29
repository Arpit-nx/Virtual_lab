from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import config
import os
import google.generativeai as genai

# Initialize Flask App
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)  # Allow Vite Frontend

# Load Configuration
app.config.from_object(config)

# MongoDB Connection
mongo_uri = os.getenv('MONGO_URI', "mongodb://localhost:27017")
database_name = os.getenv('DATABASE_NAME', "virtual_lab")

mongo_client = MongoClient(mongo_uri)
db = mongo_client[database_name]
app.db = db

# Debugging: Print available collections
available_collections = db.list_collection_names()
print(f"✅ Connected to MongoDB: {database_name}")
print(f"📂 Available Collections: {available_collections}")

# Ensure `chemicals` collection exists
if "chemicals" not in available_collections:
    print("⚠️ Warning: `chemicals` collection not found in the database!")

# Configure Gemini AI API
GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)
else:
    print("⚠️ Warning: GOOGLE_API_KEY is missing! Gemini API features will not work.")

# Register Blueprints (Only if the files exist)
try:
    from routes.chemicals import chemicals_bp
    app.register_blueprint(chemicals_bp)
except ImportError:
    print("⚠️ Warning: `routes/chemicals.py` not found. Skipping chemicals API.")

try:
    from routes.experiments import experiments_bp
    app.register_blueprint(experiments_bp)
except ImportError:
    print("⚠️ Warning: `routes/experiments.py` not found. Skipping experiments API.")

# Default Route
@app.route('/')
def hello_world():
    return "✅ Virtual Lab Backend is Running!"

# Fetch Chemicals (Handles missing collection)
@app.route('/api/chemicals', methods=['GET'])
def get_chemicals():
    if "chemicals" not in available_collections:
        return jsonify([])  # Return an empty list if the collection does not exist
    
    try:
        chemicals = list(db["chemicals"].find({}, {"_id": 0}))  # Fetch chemicals data
        return jsonify(chemicals)
    except Exception as e:
        print(f"⚠️ Error fetching chemicals: {e}")
        return jsonify({"error": "Failed to fetch chemicals"}), 500

# Gemini AI Text Generation
@app.route('/generate', methods=['POST'])
def generate_text():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        generated_text = response.text if hasattr(response, 'text') else "No response generated."
        return jsonify({'generated_text': generated_text})
    except Exception as e:
        print(f"⚠️ Error: {e}")
        return jsonify({'error': str(e)}), 500

# Chatbot Route
@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        user_message = data.get('message')
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(user_message)
        reply = response.text if hasattr(response, 'text') else "No response available."
        return jsonify({'reply': reply})
    except Exception as e:
        print(f"⚠️ Chatbot Error: {e}")
        return jsonify({'error': str(e)}), 500

# Fetch Specific Experiment
@app.route('/experiment/<experiment_name>', methods=['GET'])
def get_experiment(experiment_name):
    if "experiments" not in available_collections:
        return jsonify({"error": "Experiments collection not found"}), 404

    experiment = db["experiments"].find_one({"experiment_name": experiment_name}, {"_id": 0})
    if not experiment:
        return jsonify({"error": "Experiment not found"}), 404
    return jsonify(experiment)

# Run Flask App
if __name__ == '__main__':
    app.run(debug=app.config.get('DEBUG', True), port=app.config.get('PORT', 5000))
