from flask import Flask, render_template, url_for, request, redirect
import os
from convert_csv_to_raw import convert_csv_to_raw

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload-csv', methods =['GET','POST'])
def upload_csv():

    if request.method == 'POST':

        if request.files:

            csv = request.files['csv']

            print(csv)
            convert_csv_to_raw(csv)

            return redirect(request.url)

    return render_template('upload_csv.html')

if __name__ == '__main__':
    app.run(debug=True)