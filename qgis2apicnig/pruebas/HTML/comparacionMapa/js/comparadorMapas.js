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
mapaJS_OL.addInteraction(new ol.interaction.Synchronize({ maps: [mapaJS_OL_2] }));
mapaJS_OL_2.addInteraction(new ol.interaction.Synchronize({ maps: [mapaJS_OL] }));


// Tools
/* Use layer clipping * /
var clip = new ol.interaction.Clip({ radius: 150, layers: map2.getLayers().getArray() });
var swipe = new ol.control.Swipe({ rightLayers: map2.getLayers().getArray(),  });
/*/
var clip = new ol.interaction.ClipMap({ radius: 150 });
var swipe = new ol.control.SwipeMap({ right: true });
/**/



// Change mode
var currentMode;
function setMode(mode) {
    if (["addMap", "settings", "info"].includes(mode)) {
        document.getElementById("mapaJS_div").querySelector(".m-areas").style.position = "";
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
                // Update position
                document.getElementById("compareMaps").className = mode;
                select1.getFeatures().clear();
                select2.getFeatures().clear();

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

                    var selectorMapas = document.getElementsByClassName("selectorMapasClase");

                    for (const selector of selectorMapas) {

                        // console.log(selector, selector.value)

                        for (const mapa of listaMapas) {
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


                }

                botonAceptar = document.getElementById("idAceptar");
                botonAceptar.onclick = function () {
                    // console.log('currentMode : ',currentMode)
                    for (const mapa of listaMapas) {
                        mapa.mapa.removeControl(swipe);
                        mapa.mapa.removeInteraction(clip);
                    }

                    if(currentMode == 'view1'){
                        var valueMapaUnico = document.getElementById("selectorMapasUnico").value;
                        for (const mapa of listaMapas) {
                            if (mapa.titulo == valueMapaUnico) {
                                mapa.mapa.setTarget('mapaJS_div')
                            } else {
                                mapa.mapa.setTarget('mapaJS_div_2')
                            }
                        }
                    }
                    else if (currentMode == 'compare') {

                    }
                    else if (currentMode == 'swipev') {
                        var mapaDerechoPrincipal = document.getElementById("selectorMapasHCortinillaDer").value;
                        var mapaIzquierdo = document.getElementById("selectorMapasHCortinillaIzq").value;

                        for (const mapa of listaMapas) {
                            if (mapa.titulo == mapaDerechoPrincipal) {
                                mapa.mapa.setTarget('mapaJS_div')
                                mapa.mapa.addControl(swipe)
                            } else if (mapa.titulo == mapaIzquierdo) {
                                mapa.mapa.setTarget('mapaJS_div_2')
                            }
                        }

                        document.getElementById("mapaJS_div").querySelector(".m-areas").style.position = "";
                        document.getElementById("mapaJS_div_2").querySelector(".m-areas").style.position = "absolute";
                        swipe.set('orientation', (currentMode === 'swipeh' ? 'horizontal' : 'vertical'));
                        swipe.set('right', true);

                    }
                    else if (currentMode == 'swipeh') {
                        var mapaDerechoPrincipal = document.getElementById("selectorMapasVCortinillaIzq").value;
                        var mapaIzquierdo = document.getElementById("selectorMapasVCortninillaDer").value;

                        for (const mapa of listaMapas) {
                            if (mapa.titulo == mapaDerechoPrincipal) {
                                mapa.mapa.setTarget('mapaJS_div')
                                mapa.mapa.addControl(swipe)
                            } else if (mapa.titulo == mapaIzquierdo) {
                                mapa.mapa.setTarget('mapaJS_div_2')
                            }
                        }

                        document.getElementById("mapaJS_div").querySelector(".m-areas").style.position = "";
                        document.getElementById("mapaJS_div_2").querySelector(".m-areas").style.position = "absolute";
                        swipe.set('orientation', (currentMode === 'swipev' ? 'vertical' : 'horizontal'));
                        swipe.set('right', false);

                    }
                    else if (currentMode == 'clip') {

                    }

                   

                }

                setMode(document.getElementsByClassName("activeSVG")[0].id)
                mode = document.getElementsByClassName("activeSVG")[0].id
                break;
            }

            case 'compare': {
                document.getElementById("compareMaps").className = mode;
                mapaJS_OL.setTarget('mapaJS_div')
                mapaJS_OL_2.setTarget('mapaJS_div_2')

                mapaJS_OL.updateSize();
                mapaJS_OL_2.updateSize();
                break;
            }

            case 'view1': {
                var valueMapaUnico = document.getElementById("selectorMapasUnico").value;
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
                
                break;
            }

            case 'swipev': {

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
                        }
                    }
    
                }

                document.getElementById("mapaJS_div_2").querySelector(".m-areas").style.position = "absolute";
                swipe.set('orientation', (mode === 'swipeh' ? 'horizontal' : 'vertical'));
                swipe.set('right', true);
                break;
            }

            case 'swipeh': {
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
                        }
                    }
    
                }

                document.getElementById("mapaJS_div_2").querySelector(".m-areas").style.position = "absolute";
                swipe.set('orientation', (mode === 'swipev' ? 'vertical' : 'horizontal'));
                swipe.set('right', false);
                break;
            }

            case 'clip': {
                // mapaJS_OL_2.setTarget('mapaJS_div')
                // mapaJS_OL.setTarget('mapaJS_div_2')
                document.getElementById("mapaJS_div").style.zIndex = 0;
                document.getElementById("mapaJS_div_2").querySelector(".m-areas").style.position = "absolute";
                mapaJS_OL_2.addInteraction(clip);
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
                    mapajsn = createMapWithExistingView('mapaJS_div_2', mapajs);
                    mapaJS_OL_n = mapajsn.getMapImpl()
                    mapaJS_OL_n.setTarget('mapaJS_div_2')
                    listaMapas.push({ 'titulo': nombreMApavalue, 'mapa': mapaJS_OL_n })
                }


            }

        }
        // Update position
        document.getElementById("compareMaps").className = mode;

    }
    mapaJS_OL.updateSize();
    mapaJS_OL_2.updateSize();

}
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