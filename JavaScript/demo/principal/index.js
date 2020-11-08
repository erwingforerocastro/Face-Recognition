import { MvfyHsv } from '../../mvfy_hsv/mvfy-hsv';

const MODEL;

/**
 * Instanciar la clase principal del modelo
 * @returns null
 */
$(document).ready(() => {
    // Javascript method's body can be found in assets/js/demos.js
    demo.initDashboardPageCharts();

    MODEL = MvfyHsv({
        video_label: 'video_demo',
        min_date_knowledge: '1 day',
        file_extension: 'xlsx',
        features: 'all',
        type_system: 'optimized'
    });


});


/**
 * Detectar los rostros y etiquetarlos
 * 
 * @param null
 * @returns {FaceMatcher}
 *  
 */

const labelsMatchers = async() => {

    // face detection
    const labels = ['erwing'];


    const labeledFaceDescriptors = await Promise.all(
        labels.map(async(label, index) => {

            // convertir en un HTMLImageElement
            const imgUrl = `Images/${label}${index+1}.jpg`;
            const img = await faceapi.fetchImage(imgUrl);

            // detecta la cara con la puntuación más alta en la imagen 
            //y calcula sus puntos de referencia y el descriptor de la cara
            const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

            if (!fullFaceDescription) {
                throw new error(`no se han detectado rostros para ${label}`);
            }

            const faceDescriptors = [fullFaceDescription.descriptor];
            console.log(fullFaceDescription)
            return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
        }))


    const maxDescriptorDistance = 0.7;
    return new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);

};


// capturamos el evento play
video.addEventListener('play', async() => {

    // creamos un canvas
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    // le damos un tamaño
    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    // traemos las detecciones
    faceMatcher = await labelsMatchers();

    // detecciones cada 100 mls
    setInterval(async() => {
        // detectamos los rostros
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks().withFaceDescriptors();
        // redimencionamos las predicciones al tamaño del video
        const resizeDetections = faceapi.resizeResults(detections, displaySize);
        // limpiamos el canvas anteior
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        // dibujamos las predicciones
        // faceapi.draw.drawDetections(canvas, resizeDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizeDetections)

        // Detección de rostros
        const results = resizeDetections.map(fd => faceMatcher.findBestMatch(fd.descriptor))

        results.forEach((bestMatch, i) => {
            const box = resizeDetections[i].detection.box
            const text = bestMatch.toString()
            const drawBox = new faceapi.draw.DrawBox(box, { label: text })
            drawBox.draw(canvas)
        })

    }, 50)
})