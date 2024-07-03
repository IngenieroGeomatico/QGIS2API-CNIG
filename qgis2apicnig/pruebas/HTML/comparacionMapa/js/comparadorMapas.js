// Comparación
listaMapas = []
mapaJS_OL = mapajs.getMapImpl()

listaMapas.push({ 'titulo': 'Mapa Principal', 'mapa': mapaJS_OL })


mapajs2 = createMapWithExistingView('mapaJS_div_2', mapajs);

mapaJS_OL_2 = mapajs2.getMapImpl()
mapaJS_OL_2.setTarget('mapaJS_div_2')
listaMapas.push({ 'titulo': 'Mapa 2', 'mapa': mapaJS_OL_2 })



// Select interaction
var select1 = new ol.interaction.Select({ condition: ol.events.condition.click });
mapaJS_OL.addInteraction(select1);
var select2 = new ol.interaction.Select({ condition: ol.events.condition.click });
mapaJS_OL_2.addInteraction(select2);


// Synchronize the maps 
// mapaJS_OL.addInteraction(new ol.interaction.Synchronize({ maps: [mapaJS_OL_2] }));
// mapaJS_OL_2.addInteraction(new ol.interaction.Synchronize({ maps: [mapaJS_OL] }));

var Synchronize_1 = new ol.interaction.Synchronize({ maps: [mapaJS_OL_2] })
var Synchronize_2 = new ol.interaction.Synchronize({ maps: [mapaJS_OL] })

SynchronizeList=[Synchronize_1,Synchronize_2]

mapaJS_OL.addInteraction(Synchronize_1)
mapaJS_OL_2.addInteraction(Synchronize_2)


// Tools
/* * /
/*/
var clip = new ol.interaction.ClipMap({ radius: 150 });
var swipe = new ol.control.SwipeMap({ right: true });
/**/





// Change mode
var currentMode;
function setMode(mode) {
    if (["addMap", "settings", "info"].includes(mode)) {
        document.getElementById("mapaJS_div").querySelector(".m-areas").style.position = "";
        document.getElementById("mapaJS_div_2").querySelector(".m-areas").style.position = "";
    } else {
        document.getElementsByClassName("activeSVG")[0].classList.remove("activeSVG")
        document.getElementById(mode).classList.add("activeSVG")

        document.getElementsByClassName("activeTable")[0].classList.remove("activeTable")
        document.getElementById("table_"+mode).classList.add("activeTable")
    }

    if (mode) {
        currentMode = mode;
        // Remove tools

        for (const mapa of listaMapas) {
            mapa.mapa.removeControl(swipe);
            mapa.mapa.removeInteraction(clip);
        }
        // mapaJS_OL.removeControl(swipe);
        // mapaJS_OL.removeInteraction(clip);
        // mapaJS_OL_2.removeInteraction(clip);
        // mapaJS_OL_2.removeControl(swipe);

        document.getElementById("mapaJS_div").style.zIndex = 1;
        document.getElementById("mapaJS_div").querySelector(".m-areas").style.position = "";
        document.getElementById("mapaJS_div_2").querySelector(".m-areas").style.position = "";

        mapaJS_OL.setTarget('mapaJS_div')
        mapaJS_OL_2.setTarget('mapaJS_div_2')

        // Set interactions
        // console.log('mode:',mode)
        switch (mode) {

            case 'info': {
                var modal = document.getElementById("myModal");
                // Get the <span> element that closes the modal
                var span = document.getElementsByClassName("close")[0];
                modal.style.display = "block";
                span.onclick = function () {
                    modal.style.display = "none";
                }
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }
                break;
            }

            case 'settings': {
                Sidenav = document.getElementById("mySidenav")
                oriSidenavWidth = Sidenav.style.width
                isClose = (oriSidenavWidth == '0px' || oriSidenavWidth == "") ? true : false;

                if (isClose) {
                    Sidenav.style.width = "350px";
                    Sidenav.style.borderStyle = "solid";
                    Sidenav.style.borderColor = "#ff6600 ";
                    isClose = false
                    oriClose = true

                }
                else {
                    Sidenav.style.width = "0";
                    Sidenav.style.borderStyle = "None";
                    isClose = true
                    oriClose = false
                }

                var span = document.getElementsByClassName("closebtn")[0];
                span.onclick = function () {
                    Sidenav.style.width = "0";
                    Sidenav.style.borderStyle = "None";
                    isClose = true
                    oriClose = false
                }


                valueMapaUnico = document.getElementById("selectorMapasUnico")

                if (listaMapas.length != valueMapaUnico.options.length) {

                    selectionOptionsFunction()  

                }

                botonAceptar = document.getElementById("idAceptar");
                botonAceptar.onclick = function () {
                    // console.log('currentMode : ',currentMode)
                    // console.log('mode : ',mode)
                    for (const mapa of listaMapas) {
                        mapa.mapa.removeControl(swipe);
                        mapa.mapa.removeInteraction(clip);
                    }

                    if(currentMode == 'addMap'){
                        currentMode = mode
                    }

                    if(currentMode == 'view1'){
                        view1Function() 
                    }

                    else if (currentMode == 'compare') {
                        document.getElementById("compareMaps").className = mode;
                        compareFunction() 

                    }

                    else if (currentMode == 'swipev') {
                        swipeVFunction(mode) 

                    }

                    else if (currentMode == 'swipeh') {
                        swipeHFunction(mode) 

                    }

                    else if (currentMode == 'clip') {
                        clipFunction()
                    }

                }

                mode = document.getElementsByClassName("activeSVG")[0].id
                setMode(mode)
                break;
            }

            case 'compare': {
                document.getElementById("compareMaps").className = mode;
                compareFunction() 
                break;
            }

            case 'view1': {
                view1Function() 
                break;
            }

            case 'swipev': {
                swipeVFunction(mode) 
                break;
            }

            case 'swipeh': {
                swipeHFunction(mode) 
                break;
            }

            case 'clip': {
                clipFunction()
                break;
            }

            case 'addMap': {
                M.dialog.info(`
                        <label for="fname">Nombre vista:</label><input type="text" id="nombreVistaID" name="fname"><br><br>
                    `,
                    "Crear nueva vista"
                );
                buttonAceptar = document.getElementsByClassName("m-content")[0].querySelector("button")
                buttonAceptar.id = "buttonModalID"
                nombreMpapa = document.getElementById("nombreVistaID")
                nombreMpapa.onchange = function () {
                    nombreMApavalue = nombreMpapa.value
                };

                document.getElementsByClassName("m-content")[0].querySelector("button").onclick = function () {
                    // console.log(nombreMApavalue)
                    nMapa = listaMapas.length +1
                    window['mapajs'+ nMapa] = createMapWithExistingView('mapaJS_div_n', mapajs);
                    window['mapaJS_OL_'+ nMapa] = window['mapajs'+ nMapa].getMapImpl()
                    window['mapaJS_OL_'+ nMapa].setTarget('mapaJS_div_n')
                    
                    mapasOL = listaMapas.map(e=>e.mapa) 
                    window['Synchronize_'+ nMapa] = new ol.interaction.Synchronize({ maps: mapasOL})
                    
                    window['mapaJS_OL_'+ nMapa].addInteraction(window['Synchronize_'+ nMapa] )

                    listaMapas.push({ 'titulo': nombreMApavalue, 'mapa': window['mapaJS_OL_'+ nMapa]})

                    SynchronizeList.forEach(
                        (element) => {
                            element.set('maps', element.maps.push(window['mapaJS_OL_'+ nMapa]));
                        }
                    );

                    SynchronizeList.push(window['Synchronize_'+ nMapa] )
                    
                    selectionOptionsFunction() 
                    document.getElementById("selectorMapasUnico").selectedIndex = document.getElementById("selectorMapasUnico").length -1
                    setMode('view1')

                }

            }

        }
        // Update position
        document.getElementById("compareMaps").className = mode;

    }
    SynchronizeSelectors(mode)
    for (const mapa of listaMapas) {
        mapa.mapa.updateSize();
    }


}

// 
// Sección de funciones
// 

// Check click and dispatch to map
mapaJS_OL.on('click', function (e) {
    // console.log(e)
    if (/swipe/.test(currentMode)) {
        if (!ol.extent.containsCoordinate(swipe.getRectangle(), e.pixel)) {
            // Simulate map1 selection
            e.map = map;
            e.stopPropagation();
            select2.getFeatures().clear();
            select1.handleEvent(e);
        } else {
            select1.getFeatures().clear();
        }
    }
});


// Función crear mapa
function createMapWithExistingView(idDiv, mapajs) {
    controlesAPI = []
    for (const property in M.control) {
        controlesAPI.push(`${property}`.toLowerCase())
    }
    // console.log(controlesAPI)

    controles = []
    for (let i = 0; i < mapajs.getControls().map(a => a.name).length; i++) {
        name = mapajs.getControls()[i].name
        // console.log(name)
        // console.log(controlesAPI.includes(name))

        if (controlesAPI.includes(name)) {
            controles.push(name)
        }
    }

    let mapObj = M.map({
        container: idDiv,
        controls: controles,
        bbox: [mapajs.getBbox().x.min, mapajs.getBbox().y.min, mapajs.getBbox().x.max, mapajs.getBbox().y.max],
    });

    extensiones = []
    for (let i = 0; i < mapajs.getPlugins().map(a => a.name).length; i++) {
        name = mapajs.getPlugins()[i].name

        if (name == 'layerswitcher') {
            let mp_selectorCapa = new M.plugin.Layerswitcher(mapajs.getPlugins()[i].options);
            mapObj.addPlugin(mp_selectorCapa);
        }
    }


    return mapObj;
}

// Función view1
function view1Function() {
    var valueMapaUnico = document.getElementById("selectorMapasUnico").value;
    // console.log(valueMapaUnico)
    if(!valueMapaUnico){
        listaMapas[0].mapa.setTarget('mapaJS_div')
    } else {
        for (const mapa of listaMapas) {
            if (mapa.titulo == valueMapaUnico) {
                mapa.mapa.setTarget('mapaJS_div')
            } else {
                mapa.mapa.setTarget('mapaJS_div_2')
            }
        }
    }

    for (const mapa of listaMapas) {
        mapa.mapa.updateSize();
    }

    return ;
}

// Función compare
function compareFunction() {
    
    var mapaDerechoPrincipal = document.getElementById("selectorMapasEspejoDer").value;
    var mapaIzquierdo = document.getElementById("selectorMapasEspejoIzq").value;

    if(!mapaDerechoPrincipal){
        listaMapas[0].mapa.setTarget('mapaJS_div')
        listaMapas[1].mapa.setTarget('mapaJS_div_2')
    } else {

        for (const mapa of listaMapas) {
            if (mapa.titulo == mapaDerechoPrincipal) {
                mapa.mapa.setTarget('mapaJS_div')
            } else if (mapa.titulo == mapaIzquierdo) {
                mapa.mapa.setTarget('mapaJS_div_2')
            } else {
                mapa.mapa.setTarget('mapaJS_div_n')
            }
        }
    }
    for (const mapa of listaMapas) {
        mapa.mapa.updateSize();
    }

    return ;
}

// Función clip
function clipFunction() {
    
    var mapaPrincipalFondo = document.getElementById("selectorMapasCirculoFondo").value;
    var mapaCirculo = document.getElementById("selectorMapasCirculoCir").value;

    if(!mapaPrincipalFondo){
        listaMapas[0].mapa.setTarget('mapaJS_div')
        listaMapas[1].mapa.setTarget('mapaJS_div_2')
        listaMapas[1].mapa.addInteraction(clip)
    } else{
        
        for (const mapa of listaMapas) {
            if (mapa.titulo == mapaPrincipalFondo) {
                mapa.mapa.setTarget('mapaJS_div')
            } else if (mapa.titulo == mapaCirculo) {
                mapa.mapa.setTarget('mapaJS_div_2')
                mapa.mapa.addInteraction(clip);
            } else {
                mapa.mapa.setTarget('mapaJS_div_n')
            }
        }
    }
    
    document.getElementById("mapaJS_div").style.zIndex = 0;
    document.getElementById("mapaJS_div").querySelector(".m-areas").style.position = "absolute";
    document.getElementById("mapaJS_div_2").querySelector(".m-areas").style.position = "";

    for (const mapa of listaMapas) {
        mapa.mapa.updateSize();
    }

    return ;
}

// Función swipeV
function swipeVFunction(mode) {
    var mapaDerechoPrincipal = document.getElementById("selectorMapasHCortinillaDer").value;
    var mapaIzquierdo = document.getElementById("selectorMapasHCortinillaIzq").value;

    // console.log('swipev:  ',!mapaDerechoPrincipal,mapaDerechoPrincipal)
    if(!mapaDerechoPrincipal){
        listaMapas[0].mapa.setTarget('mapaJS_div')
        listaMapas[0].mapa.addControl(swipe)
        listaMapas[1].mapa.setTarget('mapaJS_div_2')
    }
    else {
        for (const mapa of listaMapas) {
            if (mapa.titulo == mapaDerechoPrincipal) {
                mapa.mapa.setTarget('mapaJS_div')
                mapa.mapa.addControl(swipe)
            } else if (mapa.titulo == mapaIzquierdo) {
                mapa.mapa.setTarget('mapaJS_div_2')
            } else {
                mapa.mapa.setTarget('mapaJS_div_n')
            }
        }

    }

    document.getElementById("mapaJS_div_2").querySelector(".m-areas").style.position = "absolute";
    swipe.set('orientation', (mode === 'swipeh' ? 'horizontal' : 'vertical'));
    swipe.set('right', true);

    for (const mapa of listaMapas) {
        mapa.mapa.updateSize();
    }

    return;
}

// Función swipeH
function swipeHFunction(mode) {
    var mapaDerechoPrincipal = document.getElementById("selectorMapasVCortinillaIzq").value;
    var mapaIzquierdo = document.getElementById("selectorMapasVCortninillaDer").value;

    // console.log('swipeh:  ',!mapaDerechoPrincipal,mapaDerechoPrincipal)
    if(!mapaDerechoPrincipal){
        listaMapas[0].mapa.setTarget('mapaJS_div')
        listaMapas[0].mapa.addControl(swipe)
        listaMapas[1].mapa.setTarget('mapaJS_div_2')
    }
    else {
        for (const mapa of listaMapas) {
            if (mapa.titulo == mapaDerechoPrincipal) {
                mapa.mapa.setTarget('mapaJS_div')
                mapa.mapa.addControl(swipe)
            } else if (mapa.titulo == mapaIzquierdo) {
                mapa.mapa.setTarget('mapaJS_div_2')
            } else {
                mapa.mapa.setTarget('mapaJS_div_n')
            }
        }

    }

    document.getElementById("mapaJS_div_2").querySelector(".m-areas").style.position = "absolute";
    swipe.set('orientation', (mode === 'swipev' ? 'vertical' : 'horizontal'));
    swipe.set('right', false);

    for (const mapa of listaMapas) {
        mapa.mapa.updateSize();
    }

    return;
}

// Función rellenar selectores
function selectionOptionsFunction() {
    var selectorMapas = document.getElementsByClassName("selectorMapasClase");
    for (const selector of selectorMapas) {
        // console.log(selector, selector.value)

        for (const mapa of listaMapas) {
            continueLoop = true
            selector.childNodes.forEach(
                (element) => {
                    if (element.value == mapa.titulo){
                        continueLoop = false
                    }
                }
            );

            if (!continueLoop) {
                continue;
            } 

            var opt = document.createElement('option');
            if (!selector.value) {
                opt.selected = true
            } else if (selector.value == mapa.titulo) {
                opt.selected = true
            }
            else {
                if (selector.id == "selectorMapasEspejoIzq") {
                    selectorMapasEspejoIzq = document.getElementById("selectorMapasEspejoDer").value

                    if (selectorMapasEspejoIzq == mapa.titulo) {
                        opt.selected = false
                    } else if (!selector.value) {
                        opt.selected = true
                    } else {
                        opt.selected = true
                    }
                }

                else if (selector.id == "selectorMapasHCortinillaIzq") {
                    selectorMapasEspejoIzq = document.getElementById("selectorMapasHCortinillaDer").value

                    if (selectorMapasEspejoIzq == mapa.titulo) {
                        opt.selected = false
                    } else if (!selector.value) {
                        opt.selected = true
                    } else {
                        opt.selected = true
                    }
                }

                else if (selector.id == "selectorMapasVCortninillaDer") {
                    selectorMapasEspejoIzq = document.getElementById("selectorMapasVCortinillaIzq").value

                    if (selectorMapasEspejoIzq == mapa.titulo) {
                        opt.selected = false
                    } else if (!selector.value) {
                        opt.selected = true
                    } else {
                        opt.selected = true
                    }
                }


                else if (selector.id == "selectorMapasCirculoCir") {
                    selectorMapasEspejoIzq = document.getElementById("selectorMapasCirculoFondo").value

                    if (selectorMapasEspejoIzq == mapa.titulo) {
                        opt.selected = false
                    } else if (!selector.value) {
                        opt.selected = true
                    } else {
                        opt.selected = true
                    }
                }
            }

            opt.value = mapa.titulo;
            opt.innerHTML = mapa.titulo;
            selector.appendChild(opt);
        }

    }
    return;
}

// Función sincronizar Selectores
function SynchronizeSelectors(mode){
    // console.log(mode)
    selectorMapasUnico = document.getElementById("selectorMapasUnico")

    selectorMapasEspejoDer = document.getElementById("selectorMapasEspejoDer")
    selectorMapasEspejoIzq = document.getElementById("selectorMapasEspejoIzq")

    selectorMapasHCortinillaDer = document.getElementById("selectorMapasHCortinillaDer")
    selectorMapasHCortinillaIzq = document.getElementById("selectorMapasHCortinillaIzq")

    selectorMapasVCortinillaIzq = document.getElementById("selectorMapasVCortinillaIzq")
    selectorMapasVCortninillaDer = document.getElementById("selectorMapasVCortninillaDer")

    selectorMapasCirculoFondo = document.getElementById("selectorMapasCirculoFondo")
    selectorMapasCirculoCir = document.getElementById("selectorMapasCirculoCir")

    if (mode =='view1'){
        value2 = selectorMapasUnico.value
        value1 = selectorMapasEspejoDer.value
    } else if (mode =='compare'){

    }else if (mode =='swipev'){

    }else if (mode =='swipeh'){

    }else if (mode =='clip'){

    }else {
        value1 = selectorMapasUnico.value
    }


    listSelectPrincipal = [ 
                            selectorMapasEspejoDer, 
                            selectorMapasHCortinillaDer, 
                            selectorMapasVCortinillaIzq,
                            selectorMapasCirculoFondo
    ]
    listSelectSecundary = [
                            selectorMapasUnico,
                            selectorMapasEspejoIzq, 
                            selectorMapasHCortinillaIzq,
                            selectorMapasVCortninillaDer,
                            selectorMapasCirculoCir
    ]
    console.log(value1)
    console.log(value2)
    // TODO:
    /*/
        - Sincronizar los select para que se mantengan las selecciones
    /*/
    listSelectPrincipal.forEach((selector) => {
        selector.value = value1
    });
    listSelectSecundary.forEach((selector) => {
        selector.value = value2
    });

    // document.getElementById("selectorMapasUnico").value = "Mapa 2"
    // setMode('view1')
    return;
}