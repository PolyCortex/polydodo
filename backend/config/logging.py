import logging
import sys

STD_OUTPUT_FORMAT = "[%(asctime)s]:\t%(levelname)s\t%(message)s (%(name)s)"
SUBLEVEL_OUTPUT_FORMAT = "[%(asctime)s]:\t%(levelname)s\t\t%(message)s (%(name)s)"


def config_logger(logger_name, log_level, message_sublevel=False):
    """Configures logging with std output"""
    logger = logging.getLogger(logger_name)
    logger.setLevel(log_level)
    logger.addHandler(_get_console_handler(message_sublevel))
    logger.propagate = False


def _get_console_handler(message_sublevel):
    console_handler = logging.StreamHandler(sys.stdout)
    formatter = SUBLEVEL_OUTPUT_FORMAT if message_sublevel else STD_OUTPUT_FORMAT
    console_handler.setFormatter(logging.Formatter(formatter))
    return console_handler
