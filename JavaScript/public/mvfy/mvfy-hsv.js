class MvfyHsv {

    /**
     * Main model builder
     * @constructor
     * @param {Object} args
     * @param {*} args.server - Backend server for the websocket. 
     * @param {Object} args.options - options for the websocket.
     * @param {String} args.type_service - type of the listen server.
     * @param {Array} args.min_date_knowledge [min_date_knowledge=null] - minimum interval to determine a known user.
     * @param {Number} args.min_frequency [min_frequency=0.7] - minimum frequency between days detectioned.
     * @param {String} args.features [features=null] - characteristics that will be saved in each detection.
     * @param {String} args.decoder [decoder='utf-8'] - data decoder.
     * @param {String} args.max_descriptor_distance [max_descriptor_distance=null] - max distance of diference between detections.
     * @param {String} args.type_system [type_system=null] - type of system.
     */
    constructor(args) {

        (async() => {
            await $.getScript('mvfy/socket.io.min.js')
            await $.getScript('mvfy/face-api.js')
        })();

        this._require_create = true
        this.type_service = otherInfo.type_service //*required
        this.id = null
        this.features = null
        this.min_date_knowledge = null
        this.min_frequency = 0.7
        this.decoder = 'utf-8'
        this.max_descriptor_distance = null
        this.type_system = null
        this.execution = false
        this.type_model_detection = null

        this.id = null
        this.min_date_knowledge = MIN_DATE_KNOWLEDGE
        this.features = ALLOWED_FEATURES[0]
        this.type_system = TYPE_SYSTEM[0]
        this._execution = false;
        this.type_model_detection = ""
        this.streamVideo = args.streamVideo;
        this.max_descriptor_distance = 0.7;
        this.matches = null;
        this.faceMatcher = null;
        this.url_ws_service = null;

        //validate instance
        this.validateInstance(args);
        // init websocket
        this.ws = io(this.url_ws_service)
        this._configWebSocket()

    }

    _configWebSocket() {
        this.ws.on('connect', () => {
            console.log("System connect")
            this._execution = true;

        })
        this.ws.on('disconnect', () => {
            console.log('System disconnected');
            this._execution = false;
        });
        this.ws.on("connect_error", (error) => {
            throw new Error(error)
        })
        this.ws.on("message", ws => this.on_service(ws));
    }

    /**
     * Function for return actual status of system
     * @return {Object} objeto con algunos atributos del sistema
     */
    get attributes() {

        return {
            minimum_date_of_knowledge: this.min_date_knowledge,
            features: this.features,
            type_system: this.type_system,
            execution: (this._execution) ? 'System on' : 'System off'
        };
    }

    /**
     * Validaciones
     * @param {String} type el tipo de dato necesario o argumento requerido
     * @return {Error} mensaje de error indicando el tipo erroneo o falta de variable
     *  
     */
    isRequired(type = null) {

        throw new Error(
            (type !== null) ? `Missing parameter. Expected ${type}` : `Missing parameter`
        );
    }

    /**
     * Function for validate instance of class
     * @param {Object} args argumentos de la instancia de MvfyHsv
     * @return {Array} contiene la validacion y el valor ej: [[true,'nuevo sistema'], ...]
     *  
     */
    validateInstance(args = {}) {

        const validator = {
            validate_url_ws_service: (url) => {
                if (typeof(url) === 'string') {

                    return [true, url];
                }
                this.isRequired('url_ws_service [String]');
                return [false];
            },
            validate_max_descriptor_distance: (distance) => {
                if (typeof(distance) === "number" && (distance > 0 && distance < 1)) {
                    return [true, distance];
                }
                this.isRequired('max_descriptor_distance [Number] (min:0.1, max:0.9)');
                return [false];
            },
            validate_min_date_knowledge: (date) => {
                if (Array.isArray(date)) {
                    if (parseInt(date[0]) !== NaN && date[1].search(/(week|month|year)/g) >= 0) {

                        date = [date[0], date[1]];
                        return [true, date];
                    }

                } else if (typeof(date) === 'string') {
                    date = date.match(/(^\d+)|(day|week|month|year)+/g) || MIN_DATE_KNOWLEDGE;
                    return [true, date];
                }

                this.isRequired('min_date_knowledge [String or Array], permissible: ["1", "month"] or "1 week"');
                return [false];
            },
            validate_features: (features) => {
                if ((typeof(features) === 'string' || Array.isArray(features)) && ALLOWED_FEATURES.includes(features)) {
                    return [true, features];
                }
                this.isRequired('features [String or Array], permissible [all, ageAndgender, expressions, none]');
                return [false];
            },
            validate_type_system(type_system) {
                if (typeof(type_system) === 'string' && TYPE_SYSTEM.includes(type_system)) {
                    return [true, type_system];
                }
                this.isRequired('type_system [String], permissible [optimized, precise]');
                return [false];
            }
        }

        let total_validations = {};
        let validate_args = [];
        const keys_validator = Object.keys(validator);

        keys_validator.forEach((v, i) => {
            let name = v.split("validate_")[1];
            let value = (args[`${name}`]) ? validator[`${v}`](args[`${name}`]) : validator[`${v}`]("");
            total_validations[`${name}`] = value[1];
            validate_args.push(value[0])
        });

        if (validate_args.reduce((acc, el) => acc && el)) {
            console.log(total_validations);
            ({
                min_date_knowledge: this.min_date_knowledge = this.min_date_knowledge,
                features: this.features = this.features,
                type_system: this.type_system = this.type_system,
                decoder: this.decoder = this.decoder,
                url_ws_service: this.url_ws_service
            } = {...total_validations });

        } else {
            return new Error('Instancia no valida, verfique las caracteristicas del modelo')
        }

    }

    /**
     * Init user's webcam
     */
    startVideo() {
        let streamVideo = this.streamVideo;
        // Pedimos permiso al usuario para acceder
        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webKitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        // capturamos el video
        navigator.getUserMedia({ video: {} },
            stream => streamVideo.srcObject = stream,
            err => console.log(err));
    }

    /**
     * Function for load user's label faces and their detections
     */
    labelFaceDescriptors() {
        if (this.matches) {
            const labeledFaceDescriptors =
                this.matches.map(match => {

                    if (match.descriptor != null && match.label != null) {
                        return new faceapi.LabeledFaceDescriptors(match.label, [new Float32Array(match.descriptor)]);
                    }

                })

            this.faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, this.max_descriptor_distance);
        }

    };

    /**
     * Function for load models
     */
    async loadModels() {

        let url = `../${MODELS_URL}`;

        try {

            await faceapi.loadFaceRecognitionModel(url)

            if (this.type_system == 'optimized') {
                await faceapi.nets.tinyFaceDetector.loadFromUri(url);
                this.type_model_detection = 'TinyFaceDetectorOptions'
            } else {
                await faceapi.nets.ssdMobilenetv1.loadFromUri(url);
                this.type_model_detection = 'SsdMobilenetv1Options'
            }

            let array_features = (Array.isArray(this.features)) ? this.features : [this.features]

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
     * Function for init detection 
     */
    async initDetections() {

        let streamVideo = this.streamVideo

        streamVideo.addEventListener('play', async() => {

            // Create a canvas object
            const canvas = faceapi.createCanvasFromMedia(streamVideo);
            document.body.append(canvas);

            // assign dimensions of display images
            const displaySize = { width: streamVideo.width, height: streamVideo.height };
            faceapi.matchDimensions(canvas, displaySize);



            //Interval of detections
            setInterval(async() => {

                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                let detections = await this.loadDetectionsAndFeatures();

                detections.map(detection => {
                    console.log(detection)

                    let resizedDetection = faceapi.resizeResults(detection, displaySize)
                    let uniqueName = Math.floor(Date.now() / 1000)
                    console.log(this.faceMatcher)
                    if (this.faceMatcher) {
                        const results = faceMatcher.findBestMatch(resizedDetection.descriptor)
                        const drawOptionsStranger = {}
                        if (results) {
                            let array_features = (Array.isArray(this.features)) ? this.features : [this.features]

                            array_features.forEach(async v => {
                                if (v == 'all') {
                                    await faceapi.nets.faceExpressionNet.loadFromUri(url)
                                    await faceapi.nets.ageGenderNet.loadFromUri(url)
                                } else if (v == 'ageandgender') {
                                    await faceapi.nets.ageGenderNet.loadFromUri(url)
                                } else if (v == 'expressions') {
                                    await faceapi.nets.faceExpressionNet.loadFromUri(url)
                                } else {

                                }
                            })
                            drawOptionsStranger = {
                                label: `gvgfgrg`,
                                lineWidth: 2,
                                boxColor: 'green',
                                drawLabelOptions: { fontStyle: 'Roboto' }
                            }
                        } else {
                            drawOptionsStranger = {
                                label: 'Desconocido',
                                lineWidth: 2,
                                boxColor: 'red',
                                drawLabelOptions: { fontStyle: 'Roboto' }
                            }
                        }
                        new faceapi.draw.DrawBox(resizedDetection.detection.box, drawOptionsStranger).draw(canvas)
                    }

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

                })

            }, 5000);
        })
    }

    /**
     * Function for detect faces
     */
    loadDetectionsAndFeatures() {
        let streamVideo = this.streamVideo;

        if (streamVideo !== null) {
            let detections = faceapi.detectAllFaces(streamVideo, new faceapi[`${this.type_model_detection}`]()).withFaceLandmarks().withFaceDescriptors()

            let array_features = (Array.isArray(this.features)) ? this.features : [this.features]

            array_features.forEach(v => {
                if (v == 'all') {
                    detections = detections.withAgeAndGender().withFaceExpressions()
                } else if (v == 'ageandgender') {
                    detections = detections.withAgeAndGender()
                } else if (v == 'expressions') {
                    detections = detections.withFaceExpressions()
                }
            })

            return detections

        } else {
            console.error('Atribute streamVideo not found')
        }

    }

    async connect() {
        this.startVideo();
        this.insertInstance();
        await this.loadModels();
        await this.initDetections();
        await this.labelFaceDescriptors();
    }

    on_service(data) {
        console.log(data)
        let json = JSON.parse(data);
        if (typeof json.data !== "undefined" && json.data != null) {
            console.log(json)
            switch (json.action) {
                case REQUEST.GET_INITIALIZED_SYSTEM:
                    this.initialize(json.data)
                    break;
                case REQUEST.ERROR:
                    console.error(`${json.error}`)
                    break;
            }

        }

    }

    initialize(data) {
        if (data.error != null) {
            throw new Error(`Error found in initialized system ${data.error}`)
        } else {
            let { id, matches } = data
            if (id == null || matches == null) {
                throw new Error(`Expected values id and matches`)
            }
            this.id = id
            this.matches = matches
        }
    }

    setDetection(data) {
        this.ws.send(JSON.stringify({
            action: ACTIONS.SET_DETECTION,
            data: {
                id: this.id,
                _label: data.label,
                _description: data.label
            }
        }))
    }

    insertInstance() {
        this.ws.send(JSON.stringify({
            action: ACTIONS.INIT_SYSTEM,
            data: {
                id: this.id,
                min_date_knowledge: this.min_date_knowledge,
                features: this.features,
                type_system: this.type_system,
                max_descriptor_distance: this.max_descriptor_distance
            }
        }))
    }

    saveMatch() {
        this.ws.send(JSON.stringify({
            action: ACTIONS.INIT_SYSTEM,
            data: {
                id: this.id,
                min_date_knowledge: this.min_date_knowledge,
                features: this.features,
                type_system: this.type_system,
                max_descriptor_distance: this.max_descriptor_distance
            }
        }))
    }
}



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
// }) 50)
// })