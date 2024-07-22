 // Configuración del mapa
 let zoomInicial = 5
 let longLatInicial = [-3, 40]
 const zoom_p = M.config.MAP_VIEWER_ZOOM || zoomInicial;
 const center_p = M.config.MAP_VIEWER_CENTER || ol.proj.fromLonLat(longLatInicial);

 M.proxy(false) // Necesario para ejecutar el visualizador en local.
 const mapajs = M.map({
     container: 'mapaJS_div',
     controls: ['backgroundlayers'],
     bbox: [-7711689.624538593, 2583849.10320135, 6722971.85545639, 6327793.722126087]
 });

 const layers_p = M.config.MAP_VIEWER_LAYERS || [];
 mapajs.addLayers(layers_p)


 mapajs.addTMS(
     new M.layer.TMS({
         url: 'https://tms-relieve.idee.es/1.0.0/relieve/{z}/{x}/{-y}.jpeg',
         name: 'Relieve',
         visibility: true,
         legend: 'Relieve',
     })
 );
 mapajs.getLayers().filter((layer) => layer.legend == "Relieve")[0].setZIndex(100)


 let mp_selectorCapa = new M.plugin.Layerswitcher({
     position: 'TR',
     collapsed: false,
     collapsible: true,
     https: true,
     http: true,
     tooltip: 'Selector de capa superpuesta',
     showCatalog: true,
     displayLabel: false,
     addLayers: true,
     statusLayers: true,
     modeSelectLayers: 'eyes', // opciones: 'eyes', 'radio'
     tools: ['transparency', 'legend', 'zoom', 'information', 'style', 'delete']
 });
 mapajs.addPlugin(mp_selectorCapa);