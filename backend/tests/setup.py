from unittest.mock import patch

from backend.request import ClassificationRequest
from classification.config.constants import Sex


def pytest_generate_tests(metafunc):
    # called once per each test function
    funcarglist = metafunc.cls.params[metafunc.function.__name__]
    argnames = sorted(funcarglist[0])
    metafunc.parametrize(
        argnames, [[funcargs[name] for name in argnames] for funcargs in funcarglist]
    )


def get_mock_request():
    with patch.object(ClassificationRequest, '_validate', lambda *x, **y: None):
        mock_request = ClassificationRequest(
            sex=Sex.M,
            age=22,
            stream_start=1582418280,
            bedtime=1582423980,
            wakeup=1582452240,
            raw_eeg=None,
            stream_duration=35760,
        )

    return mock_request
