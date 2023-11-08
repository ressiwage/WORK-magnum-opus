from flask import Flask, render_template
from os import path, pardir



app = Flask(__name__, static_url_path='', static_folder='static')
app.config['BASEDIR'] = path.abspath(path.join(path.dirname(__file__), pardir))

@app.route("/")
def hello_world():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)