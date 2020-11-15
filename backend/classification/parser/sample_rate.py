import re

from classification.parser.file_type import FileType
from classification.exceptions import ClassificationError

OPENBCI_CYTON_SD_DEFAULT_SAMPLE_RATE = 250

SAMPLE_RATE_STRING = "Sample Rate"
SAMPLE_RATE_REGEX = fr"%{SAMPLE_RATE_STRING} = (\d+)"


def detect_sample_rate(file_content, filetype):
    if filetype == FileType.SDFile:
        return OPENBCI_CYTON_SD_DEFAULT_SAMPLE_RATE

    try:
        sample_rate_raw = re.search(SAMPLE_RATE_REGEX, file_content).group(1)
        return int(sample_rate_raw)
    except BaseException:
        raise ClassificationError('Invalid sample rate')

    raise ClassificationError("Couldn't find sample rate")
