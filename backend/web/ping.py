import falcon


class Ping:
    def on_get(self, request, response):
        response.content_type = falcon.MEDIA_TEXT
        response.body = ''
