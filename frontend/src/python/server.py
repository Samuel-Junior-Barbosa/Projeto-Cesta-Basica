from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Libera CORS pro frontend em http://localhost:5173
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route("/authentication", methods=["POST"])
def authentication():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username == "Admin" and password == "123":
        return jsonify({"status": 0})
    else:
        return jsonify({"status": 0})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
