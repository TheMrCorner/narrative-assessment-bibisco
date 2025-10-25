from flask import Flask, jsonify, request
import sys
import os

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Assessment service is running"}), 200

@app.route('/assess', methods=['POST'])
def assessment_endpoint():
    data = request.get_json()
    # Placeholder for assessment logic
    result = {"assessment": "This is a placeholder assessment result."}
    return jsonify(result), 200

@app.route('/load-project/<project_id>', methods=['POST'])
def load_project_endpoint(project_id: str):
    data = request.get_json()
    print(f"Loading project with ID: {project_id}")
    # Placeholder for project loading logic
    result = {"status": "Project loaded successfully."}
    return jsonify(result), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='127.0.0.1', port=port, debug=False)
