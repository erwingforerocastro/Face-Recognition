const MODEL_FEATURES = {
    min_date_knowledge: '1 day',
    features: 'all',
    type_system: 'optimized',
    maxDescriptorDistance: 0.7
}
const streamVideo = document.getElementById('video-demo')
const MvFy_Features = {}
const URL_BASE_SERVICE = 'http://localhost:3000/api/mvfy/hsv'
const status = 'Iniciado'

/**
 * Función para cargar los modelos
 */
const loadModels = async() => {

    let url = '/models';

    try {

        await faceapi.loadFaceRecognitionModel(url)

        if (MODEL_FEATURES.type_system == 'optimized') {
            await faceapi.nets.tinyFaceDetector.loadFromUri(url);
            MvFy_Features.type_model_detection = 'TinyFaceDetectorOptions'
        } else {
            await faceapi.nets.ssdMobilenetv1.loadFromUri(url);
            MvFy_Features.type_model_detection = 'SsdMobilenetv1Options'
        }

        array_features = (Array.isArray(MODEL_FEATURES.features)) ? MODEL_FEATURES.features : [MODEL_FEATURES.features]

        await faceapi.nets.faceLandmark68Net.loadFromUri(url)

        array_features.forEach(async v => {
            if (v == 'all') {
                await faceapi.nets.faceExpressionNet.loadFromUri(url)
                await faceapi.nets.ageGenderNet.loadFromUri(url)
            } else if (v == 'ageandgender') {
                await faceapi.nets.ageGenderNet.loadFromUri(url)
            } else if (v == 'expressions') {
                await faceapi.nets.faceExpressionNet.loadFromUri(url)
            }
        })
    } catch (error) {
        throw new Error(`Error: ${error} `)
    }
}

/**
 * Iniciar la camara web del usuario
 * @param {object HTMLElement} video_label etiqueta de video donde se muestra la información
 * @return null
 */
const startVideo = (video_label) => {
    // Pedimos permiso al usuario para acceder
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webKitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
    // capturamos el video
    navigator.getUserMedia({ video: {} },
        stream => video_label.srcObject = stream,
        err => console.log(err));
}

/**
 * Funcion para iniciar el servicio
 * @param {object} features 
 */
const initialService = (features) => {
    $.ajax({
        type: "post",
        url: URL_BASE_SERVICE,
        data: MODEL_FEATURES,
        success: res => {
            MvFy_Features = res
        },
        error: err => {
            console.error(err)
        }
    });
}

/**
 * Cambiar el estado del sistema
 * @param {String} state 
 */
const changueStatus = (state) => {
    status = state
    $("#statusOfSystem").text(state)
}

/**
 * Funcion para realizar la deteccion de rostros
 */
const loadDetectionsAndFeatures = () => {

    let detector = faceapi.detectAllFaces(streamVideo, new faceapi[`${MvFy_Features.type_model_detection}`]()).withFaceLandmarks().withFaceDescriptors()

    array_features = (Array.isArray(MODEL_FEATURES.features)) ? MODEL_FEATURES.features : [MODEL_FEATURES.features]

    array_features.forEach(v => {
        if (v == 'all') {
            detector = detector.withAgeAndGender().withFaceExpressions()
        } else if (v == 'ageandgender') {
            detector = detector.withAgeAndGender()
        } else if (v == 'expressions') {
            detector = detector.withFaceExpressions()
        }
    })

    return detector
}

/**
 * 
 * @param {String} label Nombre del rostro capturado
 * @param {Float32Array} descriptor descriptor del rostro
 */
const saveDetection = async(label, descriptor) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: `${URL_BASE_SERVICE}/save_descriptor`,
            data: {
                label: label,
                descriptor: descriptor
            },
            dataType: "JSON",
            success: (res) => {
                resolve(res)
            },
            error: (err) => {
                reject(err)
            }
        });
    })

}

$(document).ready(async() => {
    await loadModels()
    await startVideo(streamVideo)
    changueStatus("Observando")

});

streamVideo.addEventListener('play', async() => {

    // se crea un canvas
    const canvas = faceapi.createCanvasFromMedia(streamVideo);
    document.body.append(canvas);

    // le damos un tamaño
    const displaySize = { width: streamVideo.width, height: streamVideo.height };
    faceapi.matchDimensions(canvas, displaySize);



    //Intervalo que se observa los rostros
    setInterval(async() => {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        let detections = await loadDetectionsAndFeatures()
        detections.map(detection => {
            let resizedDetection = faceapi.resizeResults(detection, displaySize)
            let uniqueName = Math.floor(Date.now() / 1000)

            // console.log(detection)
            // const { age, gender, genderProbability } = detection
            // const drawOptions = {
            //     anchorPosition: 'TOP_LEFT',
            //     backgroundColor: 'rgba(0, 0, 0, 0.5)'
            // }

            // new faceapi.draw.DrawTextField(
            //     [
            //         `${faceapi.utils.round(age, 0)} años`,
            //         `${gender} (${faceapi.utils.round(genderProbability)})`
            //     ],
            //     detection.detection.box.topRight,
            //     drawOptions
            // ).draw(canvas)

            const drawOptionsStranger = {
                label: 'Desconocido',
                lineWidth: 2,
                boxColor: 'red',
                drawLabelOptions: { fontStyle: 'Roboto' }
            }

            new faceapi.draw.DrawBox(resizedDetection.detection.box, drawOptionsStranger).draw(canvas)

        })

    }, 1000);
})

// /**
//  * Detectar los rostros y etiquetarlos
//  * 
//  * @param null
//  * @returns {FaceMatcher}
//  *  
//  */
// const labelsMatchers = async() => {

//     // face detection
//     const labels = ['erwing'];


//     const labeledFaceDescriptors = await Promise.all(
//         labels.map(async(label, index) => {

//             // convertir en un HTMLImageElement
//             const imgUrl = `Images/${label}${index+1}.jpg`;
//             const img = await faceapi.fetchImage(imgUrl);

//             // detecta la cara con la puntuación más alta en la imagen 
//             //y calcula sus puntos de referencia y el descriptor de la cara
//             const fullFaceDescription = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();

//             if (!fullFaceDescription) {
//                 throw new error(`no se han detectado rostros para ${label}`);
//             }

//             const faceDescriptors = [fullFaceDescription.descriptor];
//             console.log(fullFaceDescription)
//             return new faceapi.LabeledFaceDescriptors(label, faceDescriptors);
//         }))


//     const maxDescriptorDistance = 0.7;
//     return new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance);

// };


// // capturamos el evento play
// video.addEventListener('play', async() => {

// // creamos un canvas
// const canvas = faceapi.createCanvasFromMedia(video);
// document.body.append(canvas);

// // le damos un tamaño
// const displaySize = { width: video.width, height: video.height };
// faceapi.matchDimensions(canvas, displaySize);

// // traemos las detecciones
// faceMatcher = await labelsMatchers();

// // detecciones cada 100 mls
// setInterval(async() => {
// // detectamos los rostros
// const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//     .withFaceLandmarks().withFaceDescriptors();
// // redimencionamos las predicciones al tamaño del video
// const resizeDetections = faceapi.resizeResults(detections, displaySize);
// // limpiamos el canvas anteior
// canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
// // dibujamos las predicciones
// // faceapi.draw.drawDetections(canvas, resizeDetections)
// // faceapi.draw.drawFaceExpressions(canvas, resizeDetections)

// // Detección de rostros
// const results = resizeDetections.map(fd => faceMatcher.findBestMatch(fd.descriptor))

// results.forEach((bestMatch, i) => {
//     const box = resizeDetections[i].detection.box
//     const text = bestMatch.toString()
//     const drawBox = new faceapi.draw.DrawBox(box, { label: text })
//     drawBox.draw(canvas)
// })

// }, 50)
// })
// }, 50)
// })