from flask import Flask, jsonify, request
import sys
import os

app = Flask(__name__)
working_directory = ""

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Assessment service is running"}), 200

@app.route('/assess', methods=['POST'])
def assessment_endpoint():
    data = request.get_json()
    print(f"[PYTHON API] [ASSESS] What is the working directory? {working_directory}")
    # Placeholder for assessment logic
    result = {"assessment": "Esto es una respuesta por defecto.", "working_directory": working_directory }
    return jsonify(result), 200

@app.route('/setup-working-directory', methods=['POST'])
def setup_working_directory():
    data = request.get_json()
    print(data)
    print(f"[PYTHON API] [SETUP_WORKING_DIRECTORY] Setting directoy: {data.get('working_directory')}")
    if os.path.isdir(data.get('working_directory')):
        print(f"[PYTHON API] [SETUP_WORKING_DIRECTORY] Working directory exist: {data.get('working_directory')}")
        global working_directory
        working_directory = data.get('working_directory')
        return jsonify({"status": "directory setup correctly"})
    else:
        print(f"[PYTHON API] [SETUP_WORKING_DIRECTORY] Working directory does not exist: {data.get('working_directory')}")
        return jsonify({"status": "directory does not exists or is not reachable"})

@app.route('/load-project/<project_id>', methods=['POST'])
def load_project_endpoint(project_id: str):
    data = request.get_json()
    print(f"[PYTHON API] [LOAD_PROJECT] Loading project with ID: {project_id}")
    # Placeholder for project loading logic
    result = {"status": "Project loaded successfully."}
    return jsonify(result), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='127.0.0.1', port=port, debug=False)
