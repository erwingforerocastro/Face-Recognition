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
    faceapi.nets.tinyFaceDetector.loadFromUri('scripts/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('scripts/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('scripts/weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('scripts/weights'),
    faceapi.nets.ageGenderNet.loadFromUri('scripts/weights'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('scripts/weights')
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

// face detection
const labels = ['Bill', 'Elon', 'Mark'];
const labeledFaceDescriptors = await promise.all(
    labels.map(async label => {

        // convertir en un HTMLImageElement
        const imgUrl = `images/${label}1.jpg`;
        const img = await faceapi.fetchImage(imgUrl);

        // detecta la cara con la puntuación más alta en la imagen 
        //y calcula sus puntos de referencia y el descriptor de la cara
        const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

        if (!fullFaceDescription) {
            throw new error(`no se han detectado rostros para ${label}`);
        }

        const faceDescriptors = [fullFaceDescription.descriptor];
        return new faceapi.labeledFaceDescriptors(label, faceDescriptors);
    })
)