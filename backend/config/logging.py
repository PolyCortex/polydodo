import logging
import sys

STDOUT_FORMATTER = logging.Formatter(
    "[%(asctime)s]:\t%(levelname)s\t%(message)s (%(name)s)"
)


def config_logger(logger_name, log_level):
    """Configures logging with std output"""
    logger = logging.getLogger(logger_name)
    logger.setLevel(log_level)
    logger.addHandler(_get_console_handler())
    logger.propagate = False


def _get_console_handler():
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(STDOUT_FORMATTER)
    return console_handler
