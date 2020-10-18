class ClassificationError(Exception):
    """Base errors for application errors that can occur"""
    pass


class TimestampsError(ClassificationError):
    """Raised when timestamps are incoherent or doesn't fit with the provided file"""
    pass


class FileSizeError(ClassificationError):
    """Raised when file is either too big or too small"""
    pass
