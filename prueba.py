import cv2

stream = cv2.VideoCapture('rtsp://mvfysystem:mvfysystem@192.168.1.4:8080/h264_ulaw.sdp')

# Use the next line if your camera has a username and password
# stream = cv2.VideoCapture('protocol://username:password@IP:port/1')  

while True:

    r, f = stream.read()
    cv2.imshow('IP Camera stream',f)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cv2.destroyAllWindows()