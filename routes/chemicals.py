from flask import Blueprint, jsonify, request, current_app
from marshmallow import Schema, fields, ValidationError
from flask_cors import CORS

chemicals_bp = Blueprint('chemicals', __name__, url_prefix='/api/chemicals')  # Keep only one instance
CORS(chemicals_bp)  # Apply CORS correctly

class ChemicalSchema(Schema):
    name = fields.Str(required=True)
    formula = fields.Str()
    properties = fields.Dict()
    _id = fields.Str(required=True)

class MixChemicalsSchema(Schema):
    chemical1Id = fields.Str(required=True)
    chemical2Id = fields.Str(required=True)

@chemicals_bp.route('', methods=['GET'])  # Remove trailing `/`
def get_chemicals():
    chemical_collection = current_app.db["chemicals"]
    chemicals = list(chemical_collection.find({}, {'_id': False}))
    return jsonify(chemicals)

@chemicals_bp.route('/<chemical_id>', methods=['GET'])
def get_chemical(chemical_id):
    chemical_collection = current_app.db["chemicals"]
    chemical = chemical_collection.find_one({'_id': chemical_id}, {'_id': False})
    if chemical:
        return jsonify(chemical)
    return jsonify({'error': 'Chemical not found'}), 404

@chemicals_bp.route('/mix', methods=['POST'])
def mix_chemicals():
    schema = MixChemicalsSchema()
    try:
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    chemical1_id = data.get('chemical1Id')
    chemical2_id = data.get('chemical2Id')

    chemical_collection = current_app.db["chemicals"]
    chemical1 = chemical_collection.find_one({'_id': chemical1_id})
    chemical2 = chemical_collection.find_one({'_id': chemical2_id})

    if not chemical1 or not chemical2:
        return jsonify({'error': 'Invalid chemical IDs'}), 400

    result = "No reaction"
    if chemical1['name'] == "Hydrochloric Acid" and chemical2['name'] == "Sodium Hydroxide":
        result = "Neutralization: NaCl and H₂O formed"
    
    return jsonify({'result': result})
