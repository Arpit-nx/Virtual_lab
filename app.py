from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from routes.chemicals import chemicals_bp
from routes.experiments import experiments_bp
import config
import os
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Load configuration
app.config.from_object(config)

# ✅ Correct MongoDB Connection
mongo_uri = os.getenv('MONGO_URI')  # Get value from .env
database_name = os.getenv('DATABASE_NAME')

if not mongo_uri or not database_name:
    raise ValueError("MONGO_URI or DATABASE_NAME is missing from environment variables.")

mongo_client = MongoClient(mongo_uri)
db = mongo_client[database_name]
app.db = db  # Attach db to app for use in blueprints

# Configure Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("The GOOGLE_API_KEY environment variable is not set.")

genai.configure(api_key=GOOGLE_API_KEY)


# Register Blueprints
app.register_blueprint(chemicals_bp)
app.register_blueprint(experiments_bp)

@app.route('/')
def hello_world():
    return "Virtual lab backend is running!"


@app.route('/generate', methods=['POST'])
def generate_text():
    try:
        data = request.get_json()
        prompt = data.get('prompt')

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(prompt)

        return jsonify({'generated_text': response.text})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], port=app.config['PORT'])