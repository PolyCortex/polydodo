from waitress import serve

from web import App

app = App()

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=8080)
