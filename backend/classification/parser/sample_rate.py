import re

from classification.parser.file_type import FileType
from classification.parser.constants import SESSION_FILE_HEADER_NB_LINES

OPENBCI_CYTON_SD_SAMPLE_RATE = 250

SAMPLE_RATE_STRING = "Sample Rate"
SAMPLE_RATE_REGEX = fr"^%{SAMPLE_RATE_STRING} = (\d+)"


def detect_sample_rate(file, filetype):
    if filetype == FileType.SDFile:
        return OPENBCI_CYTON_SD_SAMPLE_RATE

    for _ in range(SESSION_FILE_HEADER_NB_LINES):
        line = file.readline().decode("utf-8")
        if SAMPLE_RATE_STRING not in line:
            continue

        sample_rate_raw = re.search(SAMPLE_RATE_REGEX, line).group(1)
        return int(sample_rate_raw)
