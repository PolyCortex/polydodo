from logging import INFO

from backend.config.logging import config_logger

config_logger(
    logger_name=__name__,
    log_level=INFO,
)
