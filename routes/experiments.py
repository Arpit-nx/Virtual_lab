# routes/experiments.py
from flask import Blueprint, jsonify

experiments_bp = Blueprint('experiments', __name__, url_prefix='/api/experiments')

@experiments_bp.route('/start', methods=['POST'])
def start_experiment():
    return jsonify({"message": "Experiment Started"})

@experiments_bp.route('/save', methods=['POST'])
def save_experiment():
  return jsonify({"message": "Experiment Saved"})

@experiments_bp.route('/load', methods=['GET'])
def load_experiment():
  return jsonify({"message": "Experiment Loaded"})