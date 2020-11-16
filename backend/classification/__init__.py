from logging import INFO

from config.logging import config_logger

config_logger(
    logger_name=__name__,
    log_level=INFO,
    message_sublevel=True,
)
