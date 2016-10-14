from flask import Flask
from flask import request
from flask import jsonify
from flask import send_file

from parse import make_ast

app = Flask(__name__, static_folder='front/build/static')

@app.route('/')
def index():
    return send_file('front/build/index.html')

@app.route('/favicon.ico')
def favicon_ico():
    return send_file('front/build/favicon.png')

@app.route('/api/_parse', methods=['POST'])
def api_parse():
    body = request.get_data()
    try:
        return jsonify({ 'ast': make_ast(body) })
    except Exception as e:
        return jsonify({ 'ast': { 'error': 'yes', 'why_error?': 'it doesn\'t compile, yo' }})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

if __name__ == "__main__":
    app.debug = True
    app.run('0.0.0.0', 4361)
