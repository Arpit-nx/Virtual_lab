# routes/chemicals.py
from flask import Blueprint, jsonify, current_app

chemicals_bp = Blueprint('chemicals', __name__, url_prefix='/api/chemicals')

@chemicals_bp.route('/', methods=['GET'])
def get_chemicals():
    """Returns a list of chemicals from MongoDB."""
    chemical_collection = current_app.db["chemicals"]
    chemicals = list(chemical_collection.find({}, {'_id': False}))  # Exclude _id from the result
    return jsonify(chemicals)

@chemicals_bp.route('/<chemical_id>', methods=['GET'])
def get_chemical(chemical_id):
    """Returns a single chemical by ID."""
    chemical_collection = current_app.db["chemicals"]
    chemical = chemical_collection.find_one({'_id': chemical_id}, {'_id': False})
    if chemical:
        return jsonify(chemical)
    else:
        return jsonify({'error': 'Chemical not found'}), 404