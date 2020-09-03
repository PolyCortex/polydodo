from flask import Flask, render_template, url_for, request, redirect
import os
from resampling import convert_csv_to_raw 
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'csv'}

def allowed_filename(filename):
    if not '.' in filename:
        print('No extension in filename')
        return False

    ext = filename.rsplit('.', 1)[1]
    if ext.lower() in ALLOWED_EXTENSIONS:
        return True
    else:
        print('That file extension is not allowed')
        return False 
    

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload-csv', methods =['GET','POST'])
def upload_csv():
    if request.method == 'POST':
        if request.files:
            csv = request.files['csv']

            if csv.filename =='':
                print('No filename or no selected file')
                return redirect(request.url)

            if allowed_filename(csv.filename):
                filename = secure_filename(csv.filename) #useless si on save pas le fichier je crois
                print(csv)
                convert_csv_to_raw(csv)
                return redirect(request.url)

    return render_template('upload_csv.html')

if __name__ == '__main__':
    app.run(debug=True)