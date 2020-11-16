import falcon
import logging

from backend.ping import Ping
from backend.analyze_sleep import AnalyzeSleep

_logger = logging.getLogger(__name__)


def App():
    app = falcon.App(cors_enable=True)

    ping = Ping()
    app.add_route('/', ping)

    analyze = AnalyzeSleep()
    app.add_route('/analyze-sleep', analyze)

    _logger.info(
        'Completed local server initialization. '
        'Please go back to your browser in order to submit your sleep EEG file. '
    )
    return app
