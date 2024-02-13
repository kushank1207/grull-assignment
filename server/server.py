from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/members")
def members():
    return {"members": ["Member1", "Member2", "Member3"]}   # return data as JSON

if __name__ == '__main__':
    app.run(debug=True)