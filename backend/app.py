from concurrent import futures
import logging
import os

import grpc

from config.constants import (
    SERVER_MAX_NB_WORKERS,
    SERVER_PORT,
    LOGGER_CONFIG,
)
from protos.polydodo.classification_pb2_grpc import (
    ClassificationServiceServicer,
    add_ClassificationServiceServicer_to_server
)
from protos.polydodo.classification_pb2 import GetSleepStagesResponse


class ClassificationService(ClassificationServiceServicer):
    def GetSleepStages(self, request, context):
        return GetSleepStagesResponse()


def serve():
    logging.basicConfig(**{
        key: os.getenv(f'LOGGING_{key}', LOGGER_CONFIG[key])
        for key in LOGGER_CONFIG
    })

    server = grpc.server(futures.ThreadPoolExecutor(
        max_workers=SERVER_MAX_NB_WORKERS))

    add_ClassificationServiceServicer_to_server(
        ClassificationService(), server)

    server.add_insecure_port(f'[::]:{SERVER_PORT}')
    server.start()
    logging.info("Server started")

    server.wait_for_termination()


if __name__ == '__main__':
    serve()
