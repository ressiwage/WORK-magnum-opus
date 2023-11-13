from flask import Flask, render_template, Blueprint
from os import path, pardir

# from OpenSSL import SSL
# context = SSL.Context(SSL.PROTOCOL_TLSv1_2)
# context.use_privatekey_file('server.key')
# context.use_certificate_file('server.crt')

app = Flask(__name__, static_url_path='', static_folder='static')
multilingual = Blueprint('multilingual', __name__, template_folder='templates')


app.config['BASEDIR'] = path.abspath(path.join(path.dirname(__file__), pardir))

@app.route("/")
def hello_world():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port = 80)#, ssl_context=context)