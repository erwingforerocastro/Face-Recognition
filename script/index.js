const video = document.getElementById('video')

const startVideo = () => {
    // Pedimos permiso al usuario para acceder
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webKitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    // capturamos el video
    navigator.getUserMedia({ video: {} },
        stream => video.srcObject = stream,
        err => console.log(err));

}

// cargamos los modelos
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('/weights'),
    faceapi.nets.ageGenderNet.loadFromUri('/weights'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/weights')
]).then(startVideo);

// capturamos el evento play
video.addEventListener('play', () => {
    // creamos un canvas
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    // le damos un tamaño
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);
    // detecciones cada 100 mls
    setInterval(async() => {
        // detectamos los rostros
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceExpressions();
        // redimencionamos las predicciones al tamaño del video
        const resizeDetections = faceapi.resizeResults(detections, displaySize);
        // limpiamos el canvas anteior
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        // dibujamos las predicciones
        faceapi.draw.drawDetections(canvas, resizeDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizeDetections)
    }, 100)
})