class ClassificationError(Exception):
    """Base errors for application errors that can occur"""
    message = "An error occured while calculating sleep stages."


class TimestampsError(ClassificationError):
    """Raised when timestamps are incoherent or doesn't fit with the provided file"""
    message = "Received file, stream start time, bedtime or wakeup time are incoherent"


class FileSizeError(ClassificationError):
    """Raised when file is either too big or too small"""
    message = "Received file is either too big or too small"
