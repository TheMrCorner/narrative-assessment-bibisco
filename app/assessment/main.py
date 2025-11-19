from flask import Flask, jsonify, request
import sys
import os

workspace_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
rag_mcp_dir = os.path.join(workspace_root, 'narritive-rag-mcp')
sys.path.insert(0, rag_mcp_dir)

from llm_query import query

app = Flask(__name__)
working_directory = ""

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Assessment service is running"}), 200

@app.route('/assess', methods=['POST'])
def assessment_endpoint():
    data = request.get_json()
    print(f"[PYTHON API] [ASSESS] What is the working directory? {working_directory}")
    print(f"[PYTHON API] [ASSESS] Received data: {data}")
    # Placeholder for assessment logic

    result = query("elf adventure quest magic",
                     file=None,  # No RAG for faster response
                     port=8081,
                     prompt=lambda context: "Write a 2-sentence story about an elf who finds the power of a Silmarill")

    print(result)

    if result:
        output = result.content

        print("\nEnhanced Story with Multiple Tools:")
        print("=" * 60)
        print(output)
        print("=" * 60)
    else:
        print("No response received")

    result = {"assessment": result.content, "working_directory": working_directory }
    return jsonify(result), 200

@app.route('/setup-working-directory', methods=['POST'])
def setup_working_directory():
    data = request.get_json()
    if not data or 'working_directory' not in data:
        print(f"[PYTHON API] [SETUP_WORKING_DIRECTORY] Error: No working_directory in request")
        return jsonify({"status": "error", "message": "working_directory parameter required"}), 400
    
    directory_path = data.get('working_directory')
    print(f"[PYTHON API] [SETUP_WORKING_DIRECTORY] Setting directory: {directory_path}")
    
    if not directory_path:
        print(f"[PYTHON API] [SETUP_WORKING_DIRECTORY] Error: Empty directory path")
        return jsonify({"status": "error", "message": "working_directory cannot be empty"}), 400
    
    if os.path.isdir(directory_path):
        # Check if directory is readable and writable
        if os.access(directory_path, os.R_OK | os.W_OK):
            print(f"[PYTHON API] [SETUP_WORKING_DIRECTORY] Working directory exists and is accessible: {directory_path}")
            global working_directory
            working_directory = directory_path
            return jsonify({"status": "success", "message": "directory setup correctly", "working_directory": working_directory}), 200
        else:
            print(f"[PYTHON API] [SETUP_WORKING_DIRECTORY] Error: No read/write permissions for: {directory_path}")
            return jsonify({"status": "error", "message": "insufficient permissions for directory"}), 403
    else:
        print(f"[PYTHON API] [SETUP_WORKING_DIRECTORY] Error: Working directory does not exist: {directory_path}")
        return jsonify({"status": "error", "message": "directory does not exist or is not reachable"}), 404

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
