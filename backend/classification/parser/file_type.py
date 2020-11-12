from enum import Enum

from classification.parser.sd_file import parse_sd_file
from classification.parser.session_file import parse_session_file


class FileType(Enum):
    SDFile = (parse_sd_file,)
    SessionFile = (parse_session_file,)

    def __init__(self, parser):
        self.parser = parser


def detect_file_type(file) -> FileType:
    """Detects file type
    - file: received as an input file
    Returns:
    - FileType of the input file
    """
    first_line = file.readline().decode("utf-8")
    return FileType.SessionFile if "EEG Data" in first_line else FileType.SDFile
