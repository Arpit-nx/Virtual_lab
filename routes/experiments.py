# routes/experiments.py
from flask import Blueprint, jsonify, request, current_app
from bson import ObjectId

experiments_bp = Blueprint('experiments', __name__, url_prefix='/api/experiments')

@experiments_bp.route('/start', methods=['POST'])
def start_experiment():
    print("Request Headers:", request.headers)  # Debug headers
    print("Request Data:", request.data)  # Debug raw data

    data = request.get_json()
    print("Parsed JSON Data:", data)  # Debug parsed JSON

    if not data or "name" not in data:
        return jsonify({"error": "Experiment name is required"}), 400

    experiment = {
        "name": data["name"],
        "status": "in-progress",
        "steps": [],
        "result": None
    }

    experiment_collection = current_app.db["experiments"]
    experiment_id = experiment_collection.insert_one(experiment).inserted_id

    return jsonify({"message": "Experiment Started", "experiment_id": str(experiment_id)})

@experiments_bp.route('/save', methods=['POST'])
def save_experiment():
    """Saves progress of an experiment."""
    data = request.get_json()
    if not data or "experiment_id" not in data or "steps" not in data:
        return jsonify({"error": "Experiment ID and steps are required"}), 400

    experiment_collection = current_app.db["experiments"]
    experiment_id = data["experiment_id"]

    # Update experiment with steps
    experiment_collection.update_one(
        {"_id": ObjectId(experiment_id)},
        {"$set": {"steps": data["steps"]}}
    )

    return jsonify({"message": "Experiment Saved"})

@experiments_bp.route('/load/<experiment_id>', methods=['GET'])
def load_experiment(experiment_id):
    """Loads an experiment from MongoDB."""
    experiment_collection = current_app.db["experiments"]
    experiment = experiment_collection.find_one({"_id": ObjectId(experiment_id)})

    if not experiment:
        return jsonify({"error": "Experiment not found"}), 404

    # Convert ObjectId to string for JSON response
    experiment["_id"] = str(experiment["_id"])

    return jsonify(experiment)
