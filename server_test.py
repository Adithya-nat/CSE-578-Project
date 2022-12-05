from flask import Flask
from flask import send_from_directory

app = Flask(__name__, static_url_path='', static_folder='static')


@app.route('/')
def hello():
    return send_from_directory("static", "index.html")
