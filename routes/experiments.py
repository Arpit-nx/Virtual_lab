from flask import Blueprint, jsonify, request, current_app
from bson import ObjectId
from flask_cors import CORS

experiments_bp = Blueprint('experiments', __name__, url_prefix='/api/experiments')  # Keep only one instance
CORS(experiments_bp)  # Apply CORS correctly

@experiments_bp.route('/', methods=['GET'])
def get_experiments():
    return jsonify({"message": "Experiments fetched successfully!"})

@experiments_bp.route('/start', methods=['POST'])
def start_experiment():
    data = request.get_json()
    if not data or "name" not in data:
        return jsonify({"error": "Experiment name is required"}), 400

    experiment = {
        "experiment_name": data["name"],
        "status": "in-progress",
        "steps": [],
        "result": None
    }
    experiment_collection = current_app.db["experiments"]
    experiment_id = experiment_collection.insert_one(experiment).inserted_id
    return jsonify({"message": "Experiment Started", "experiment_id": str(experiment_id)})

@experiments_bp.route('/save', methods=['POST'])
def save_experiment():
    data = request.get_json()
    if not data or "experiment_id" not in data or "steps" not in data:
        return jsonify({"error": "Experiment ID and steps are required"}), 400

    experiment_collection = current_app.db["experiments"]
    experiment_id = data["experiment_id"]
    experiment_collection.update_one(
        {"_id": ObjectId(experiment_id)},
        {"$set": {"steps": data["steps"], "status": "saved"}}
    )
    return jsonify({"message": "Experiment Saved"})

@experiments_bp.route('/load/<experiment_id>', methods=['GET'])
def load_experiment(experiment_id):
    experiment_collection = current_app.db["experiments"]
    experiment = experiment_collection.find_one({"_id": ObjectId(experiment_id)})
    if not experiment:
        return jsonify({"error": "Experiment not found"}), 404
    experiment["_id"] = str(experiment["_id"])
    return jsonify(experiment)

@experiments_bp.route('/react', methods=['POST'])
def react_chemicals():
    data = request.get_json()
    if not data or "hcl_volume" not in data or "naoh_volume" not in data:
        return jsonify({"error": "HCl and NaOH volumes are required"}), 400

    hcl_volume = data["hcl_volume"]
    naoh_volume = data["naoh_volume"]

    # Assuming 1M concentration for simplicity
    if hcl_volume > naoh_volume:
        excess = hcl_volume - naoh_volume
        result = "Excess HCl remains"
        color = "blue"
    elif naoh_volume > hcl_volume:
        excess = naoh_volume - hcl_volume
        result = "Excess NaOH remains"
        color = "red"
    else:
        result = "Neutralization complete: NaCl and H₂O formed"
        color = "green"

    return jsonify({
        "result": result,
        "color": color,
        "remaining_hcl": max(0, hcl_volume - naoh_volume),
        "remaining_naoh": max(0, naoh_volume - hcl_volume)
    })
