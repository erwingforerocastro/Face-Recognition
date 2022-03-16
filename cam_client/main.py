import cv2
import asyncio
import socket
import base64
from flask_socketio import SocketIO, emit, send
from flask import Flask, render_template

BUFF_SIZE = 2073600
SIZE = (1920, 1080)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'


class Streamer():

    def __init__(self, url_server: str, url_client: str, ip_cam: str,  *args, **kargs) -> None:
        self.app = Flask(__name__)
        self.socketio = SocketIO(app)
        self.title = "title"
        self.url_client = url_client
        self.url_server = url_server
        self.ip_cam = ip_cam
        self.stream = None
        self.server = None
        self.state = 0  # conection, 0 disconnect, 1 conected, 2 wait connection
        self.image = None
        self._img_capture = None
        self._temp_url = None

        self.app.config['SECRET_KEY'] = 'secret'
        self.socketio.on('connect')(self.ws)

    async def ws(self):
        # self.server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # self.server.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, BUFF_SIZE)
        # self.server.bind((self.url_server["host"], int(self.url_server["port"])))
        
        try:
            # self.server.listen()
            while True:
                await self.connect(self.ip_cam)
                # msg, client_addr = self.server.recvfrom(BUFF_SIZE)
                # print(f"new connection {client_addr}")

                while self.stream:
                    print("sending image")
                    await self.send_image(client_addr=client_addr)

        except Exception as e:
            raise ConnectionError(
                f"Invalid conection to {self.url_server}, {e}")

        finally:
            self.socketio.close()

    async def __trying_connection(self) -> None:
        self.state = 2
        if self._temp_url is not None:
            await self.connect(self._temp_url)
            self.state = 1
            return
        else:
            self.state = 0

        cv2.destroyAllWindows()

    async def connect(self, url: str) -> None:
        try:
            self.stream = cv2.VideoCapture(url)
            self._temp_url = url
            print("init the capture of image")
            await self.start()

        except Exception as e:
            raise Exception(e)

    async def start(self):

        if self.stream is None:
            raise Exception("Stream is required")

        self.state = 1

        while self.state == 1:
            try:
                _, self._img_capture = self.stream.read()

                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
            except:
                await self.__trying_connection()

    async def send_image(self, client_addr) -> None:
        if self._img_capture is not None:
            frame = cv2.resize(self._img_capture, SIZE)
            encoded, buffer = cv2.imencode(
                '.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            message = base64.b64encode(buffer)
            self.server.sendto(message, client_addr)

        await self.update_video()

    async def update_video(self):
        if self._img_capture is not None:
            cv2.imshow(self.title, self._img_capture)


stream = Streamer(
    url_server={
        "host": "127.0.0.1",
        "port": "8088"
    },
    url_client={
        "host": "127.0.0.2",
        "port": "8089"
    },
    ip_cam='rtsp://mvfysystem:mvfysystem@192.168.1.1:8080/h264_ulaw.sdp'
)


if __name__ == '__main__':
    asyncio.run(stream.ws())
