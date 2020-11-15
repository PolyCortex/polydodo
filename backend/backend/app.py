import falcon

from backend.ping import Ping
from backend.analyze_sleep import AnalyzeSleep


def App():
    app = falcon.App(cors_enable=True)

    ping = Ping()
    app.add_route('/', ping)

    analyze = AnalyzeSleep()
    app.add_route('/analyze-sleep', analyze)

    return app
