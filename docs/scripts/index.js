const LOCAL = 1;
const URL = (LOCAL == 1) ? 'http://127.0.0.1:5500/docs/' : '';
const htmlContent = $.get(`${URL}pages/introduccion.html`);
const _ = undefined;
let structure = null

/**
 * Obtener la estructura del sistema
 * @return json objeto con los valores de la estructura
 */
const getEstructure = async() => {
    if (structure==null){
        structure = await $.getJSON(`${URL}scripts/estructure.json`);
    }
    
    return structure;
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

    if (all) {
        for (let clave in ESTRUCTURE) {

            if (ESTRUCTURE[clave].hasOwnProperty(option)) {
                let html = await $.get(`${URL}pages/${ESTRUCTURE[clave][option]}.html`);

                $("#principalContainer").html(html);
            }
        }
    } else {

        let html = $.get(`${URL}pages/${ESTRUCTURE[key][option]}.html`);
        $("#principalContainer").html(html);

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

$("#estructureSystemNav").on('click', 'li a', async(event) => {

    let optionSelect = event.target.textContent;
    $("#estructureSystemNav li a").each((idx, el) => {
        if ($(el).text() == optionSelect) {
            $(el).attr({ 'active': true });
        } else {
            $(el).attr({ 'active': false });
        }
    });

    await selectOption(_, optionSelect, true);

})