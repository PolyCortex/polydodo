from enum import Enum, auto


class FileType(Enum):
    SDFile = auto()
    SessionFile = auto()


def detect_file_type(file) -> FileType:
    """Detects file type
    - file: received as an input file
    Returns:
    - FileType of the input file
    """
    first_line = file.readline().decode("utf-8")
    return FileType.SessionFile if "EEG Data" in first_line else FileType.SDFile
