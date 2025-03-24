# routes/chemicals.py
from flask import Blueprint, jsonify, request, current_app
from marshmallow import Schema, fields, ValidationError

chemicals_bp = Blueprint('chemicals', __name__, url_prefix='/api/chemicals')

class ChemicalSchema(Schema):  # Define the Chemical Schema
    name = fields.Str(required=True)
    formula = fields.Str()
    properties = fields.Dict()
    _id = fields.Str(required=True) # Include _id for easier handling.

class MixChemicalsSchema(Schema):  # Data validation for the /mix endpoint
    chemical1Id = fields.Str(required=True)
    chemical2Id = fields.Str(required=True)

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

@chemicals_bp.route('/mix', methods=['POST'])
def mix_chemicals():
    """Simulates mixing two chemicals based on their IDs, with validation."""
    schema = MixChemicalsSchema()
    try:
        data = schema.load(request.get_json())  # Load and validate
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    chemical1_id = data.get('chemical1Id')
    chemical2_id = data.get('chemical2Id')

    # Retrieve chemical data from MongoDB (IMPORTANT: Handle potential errors)
    chemical_collection = current_app.db["chemicals"]
    chemical1 = chemical_collection.find_one({'_id': chemical1_id})
    chemical2 = chemical_collection.find_one({'_id': chemical2_id})

    if not chemical1 or not chemical2:
        return jsonify({'error': 'Invalid chemical IDs'}), 400  #Better Error Messages

    # Simulate the chemical reaction based on chemical1 and chemical2
    result = "No reaction"
    if chemical1['name'] == "Sodium Chloride" and chemical2['name'] == "Water":  # Access by key
        result = "Solution of Sodium Chloride in Water formed"

    return jsonify({'result': result})