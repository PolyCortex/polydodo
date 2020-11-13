import falcon

from web.ping import Ping
from web.analyze_sleep import AnalyzeSleep


def App():
    app = falcon.App(cors_enable=True)

    ping = Ping()
    app.add_route('/', ping)

    analyze = AnalyzeSleep()
    app.add_route('/analyze-sleep', analyze)

    return app
