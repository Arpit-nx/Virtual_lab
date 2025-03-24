# app.py
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from routes.chemicals import chemicals_bp
from routes.experiments import experiments_bp  # Create this file later
import config
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load configuration
app.config.from_object(config)

# MongoDB Connection
mongo_client = MongoClient(app.config['MONGO_URI'])
db = mongo_client[app.config['DATABASE_NAME']]

# Register Blueprints (for organizing routes)
app.register_blueprint(chemicals_bp)
app.register_blueprint(experiments_bp)

@app.route('/')
def hello_world():
    return "Virtual lab backend is running!"

if __name__ == '__main__':
    app.run(debug=app.config['DEBUG'], port=app.config['PORT'])