const LOCAL = 0;
const URL = (LOCAL == 1) ? 'http://127.0.0.1:5500/docs/' : '';
const htmlContent = $.get(`${URL}pages/introduccion.html`);
const _ = undefined;

/**
 * Obtener la estructura del sistema
 * @return json objeto con los valores de la estructura
 */
const getEstructure = async() => {

    let response = await $.getJSON(`${URL}scripts/estructure.json`);
    return response;
}


/**
 * Agregar la estructura html de los componentes con contenido
 * @returns null
 */
const estructureSystem = async(parentDivNav, parentDivContent) => {
    let ESTRUCTURE = await getEstructure();
    let htmlNav = '';

    for (let clave in ESTRUCTURE) {
        if (ESTRUCTURE.hasOwnProperty(clave)) {
            htmlNav = `${htmlNav}<p class="nav-tabs text-light nav-item">${clave}</p>`;

            for (let subClave in ESTRUCTURE[clave]) {
                if (ESTRUCTURE[clave].hasOwnProperty(subClave)) {

                    if (subClave == 'Introducción') {
                        htmlNav = `${htmlNav}<li class="nav-item">
                                <a class="nav-link active " href="# ">${subClave}</a>
                            </li>`;

                    } else {
                        htmlNav = `${htmlNav}<li class="nav-item">
                                <a class="nav-link" href="# ">${subClave}</a>
                            </li>`;
                    }
                }

            }
        }
    }

    $(parentDivContent).html(htmlContent.responseText);
    $(parentDivNav).html(htmlNav);


}

/**
 * Agregar al contenido el texto del seleccionado
 * @param {String} key grupo principal al que pertenece la opcion
 * @param {String} option opcion seleccionada del navegador vertical
 * @param {Boolean} all recorrer todas las llaves
 * @returns null
 */
const selectOption = async(key, option, all = false) => {
    let ESTRUCTURE = await getEstructure();
    console.log(option)
    if (all) {
        for (let clave in ESTRUCTURE) {

            if (ESTRUCTURE[clave].hasOwnProperty(option)) {
                let html = $.get(`${URL}pages/${ESTRUCTURE[clave][option]}.html`);

                $("#principalContainer").html(html.responseText);
            }
        }
    } else {

        let html = $.get(`${URL}pages/${ESTRUCTURE[key][option]}.html`);
        $("#principalContainer").html(html.responseText);
    }

}

const searchContent = (value) => {

    $("#estructureSystemNav").children("li")
    $("#inputSearchPrincipal")

}

/**
 * Inicializar las funciones de la pagina
 * @returns null
 */
$(document).ready(() => {
    // Javascript method's body can be found in assets/js/demos.js
    // demo.initDashboardPageCharts();

    //Estructura html 
    estructureSystem("#estructureSystemNav", "#principalContainer");

    if (LOCAL == 1) {
        $('video').each((idx, value) => {
            let srcValue = $(this).attr('src');
            $(this).attr('src', `${URL}/docs/${srcValue}`)
        })
    }


    // MODEL = MvfyHsv({
    //     video_label: 'video_demo',
    //     min_date_knowledge: '1 day',
    //     file_extension: 'xlsx',
    //     features: 'all',
    //     type_system: 'optimized'
    // });


});

$("#estructureSystemNav").on('click', 'li', () => {

    let optionSelect = $(this).text();
    console.log(optionSelect)
    selectOption(_, optionSelect, true);
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

//     // creamos un canvas
//     const canvas = faceapi.createCanvasFromMedia(video);
//     document.body.append(canvas);

//     // le damos un tamaño
//     const displaySize = { width: video.width, height: video.height };
//     faceapi.matchDimensions(canvas, displaySize);

//     // traemos las detecciones
//     faceMatcher = await labelsMatchers();

//     // detecciones cada 100 mls
//     setInterval(async() => {
//         // detectamos los rostros
//         const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
//             .withFaceLandmarks().withFaceDescriptors();
//         // redimencionamos las predicciones al tamaño del video
//         const resizeDetections = faceapi.resizeResults(detections, displaySize);
//         // limpiamos el canvas anteior
//         canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
//         // dibujamos las predicciones
//         // faceapi.draw.drawDetections(canvas, resizeDetections)
//         // faceapi.draw.drawFaceExpressions(canvas, resizeDetections)

//         // Detección de rostros
//         const results = resizeDetections.map(fd => faceMatcher.findBestMatch(fd.descriptor))

//         results.forEach((bestMatch, i) => {
//             const box = resizeDetections[i].detection.box
//             const text = bestMatch.toString()
//             const drawBox = new faceapi.draw.DrawBox(box, { label: text })
//             drawBox.draw(canvas)
//         })

//     }, 50)
// })