from flask import Blueprint, jsonify, request, current_app
from flask_cors import CORS

equipment_bp = Blueprint('equipment', __name__, url_prefix='/api/equipment')
CORS(equipment_bp)

@equipment_bp.route('', methods=['GET'])
def get_equipment():
    """Return the list of available laboratory equipment"""
    equipment = [
        {"id": "flask", "icon": "flask"},
        {"id": "test-tube", "icon": "test-tube"},
        {"id": "beaker", "icon": "beaker"}
    ]
    
    # If you want to get equipment from MongoDB instead, uncomment this:
    # try:
    #     equipment_collection = current_app.db["equipment"]
    #     equipment = list(equipment_collection.find({}, {'_id': False}))
    # except Exception as e:
    #     print(f"Error fetching equipment: {e}")
    
    return jsonify(equipment)

@equipment_bp.route('/<equipment_id>', methods=['GET'])
def get_equipment_details(equipment_id):
    """Get detailed information about a specific piece of equipment"""
    # Example static data - replace with DB lookup when available
    equipment_details = {
        "flask": {
            "id": "flask",
            "name": "Erlenmeyer Flask",
            "description": "A conical flask with a flat bottom and narrow neck",
            "capacity": "250ml",
            "material": "Borosilicate glass"
        },
        "test-tube": {
            "id": "test-tube",
            "name": "Test Tube",
            "description": "A thin glass tube closed at one end",
            "capacity": "20ml",
            "material": "Borosilicate glass"
        },
        "beaker": {
            "id": "beaker",
            "name": "Beaker",
            "description": "A cylindrical container with a flat bottom",
            "capacity": "400ml",
            "material": "Borosilicate glass"
        }
    }
    
    if equipment_id in equipment_details:
        return jsonify(equipment_details[equipment_id])
    return jsonify({"error": "Equipment not found"}), 404
