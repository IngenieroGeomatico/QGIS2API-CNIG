# -*- coding: utf-8 -*-
"""
/***************************************************************************
 QGIS2APICNIG
                                 A QGIS plugin
 Complemento que crea un visualizador cartográfico con el contenido del lieno de QGIS
 Generated by Plugin Builder: http://g-sherman.github.io/Qgis-Plugin-Builder/
                              -------------------
        begin                : 2023-12-16
        git sha              : $Format:%H$
        copyright            : (C) 2023 by IngenieroGeomatico
        email                : aurearagon@gmail.com
 ***************************************************************************/

/***************************************************************************
 *                                                                         *
 *   This program is free software; you can redistribute it and/or modify  *
 *   it under the terms of the GNU General Public License as published by  *
 *   the Free Software Foundation; either version 2 of the License, or     *
 *   (at your option) any later version.                                   *
 *                                                                         *
 ***************************************************************************/
"""
from PyQt5 import QtWidgets, QtCore
from PyQt5.QtCore import *
from PyQt5.QtGui import *
from PyQt5.QtWidgets import *

from qgis.PyQt.QtCore import QSettings, QTranslator, QCoreApplication
from qgis.PyQt.QtGui import QIcon
from qgis.PyQt.QtWidgets import QAction, QWidget, QDialog, QTableWidgetItem, QAbstractItemView, QCheckBox

# Initialize Qt resources from file resources.py
from .resources import *
# Import the code for the dialog
from .QGIS2APICNIG_dialog import QGIS2APICNIGDialog
import os.path

# Importación cosas pyQGIS
from qgis.core import QgsProject, QgsMapLayer, QgsWkbTypes


class QGIS2APICNIG:
    """QGIS Plugin Implementation."""

    def __init__(self, iface):
        """Constructor.

        :param iface: An interface instance that will be passed to this class
            which provides the hook by which you can manipulate the QGIS
            application at run time.
        :type iface: QgsInterface
        """
        # Save reference to the QGIS interface
        self.iface = iface
        # initialize plugin directory
        self.plugin_dir = os.path.dirname(__file__)
        # initialize locale
        locale = QSettings().value('locale/userLocale')[0:2]
        locale_path = os.path.join(
            self.plugin_dir,
            'i18n',
            'QGIS2APICNIG_{}.qm'.format(locale))

        if os.path.exists(locale_path):
            self.translator = QTranslator()
            self.translator.load(locale_path)
            QCoreApplication.installTranslator(self.translator)

        # Declare instance attributes
        self.actions = []
        self.menu = self.tr(u'&QGIS2API-CNIG')

        # Check if plugin was started the first time in current QGIS session
        # Must be set in initGui() to survive plugin reloads
        self.first_start = None

    # noinspection PyMethodMayBeStatic
    def tr(self, message):
        """Get the translation for a string using Qt translation API.

        We implement this ourselves since we do not inherit QObject.

        :param message: String for translation.
        :type message: str, QString

        :returns: Translated version of message.
        :rtype: QString
        """
        # noinspection PyTypeChecker,PyArgumentList,PyCallByClass
        return QCoreApplication.translate('QGIS2APICNIG', message)


    def add_action(
        self,
        icon_path,
        text,
        callback,
        enabled_flag=True,
        add_to_menu=True,
        add_to_toolbar=True,
        status_tip=None,
        whats_this=None,
        parent=None):
        """Add a toolbar icon to the toolbar.

        :param icon_path: Path to the icon for this action. Can be a resource
            path (e.g. ':/plugins/foo/bar.png') or a normal file system path.
        :type icon_path: str

        :param text: Text that should be shown in menu items for this action.
        :type text: str

        :param callback: Function to be called when the action is triggered.
        :type callback: function

        :param enabled_flag: A flag indicating if the action should be enabled
            by default. Defaults to True.
        :type enabled_flag: bool

        :param add_to_menu: Flag indicating whether the action should also
            be added to the menu. Defaults to True.
        :type add_to_menu: bool

        :param add_to_toolbar: Flag indicating whether the action should also
            be added to the toolbar. Defaults to True.
        :type add_to_toolbar: bool

        :param status_tip: Optional text to show in a popup when mouse pointer
            hovers over the action.
        :type status_tip: str

        :param parent: Parent widget for the new action. Defaults None.
        :type parent: QWidget

        :param whats_this: Optional text to show in the status bar when the
            mouse pointer hovers over the action.

        :returns: The action that was created. Note that the action is also
            added to self.actions list.
        :rtype: QAction
        """

        icon = QIcon(icon_path)
        action = QAction(icon, text, parent)
        action.triggered.connect(callback)
        action.setEnabled(enabled_flag)

        if status_tip is not None:
            action.setStatusTip(status_tip)

        if whats_this is not None:
            action.setWhatsThis(whats_this)

        if add_to_toolbar:
            # Adds plugin icon to Plugins toolbar
            self.iface.addToolBarIcon(action)

        if add_to_menu:
            self.iface.addPluginToWebMenu(
                self.menu,
                action)

        self.actions.append(action)

        return action

    def initGui(self):
        """Create the menu entries and toolbar icons inside the QGIS GUI."""

        icon_path = ':/plugins/QGIS2APICNIG/icon.png'
        self.add_action(
            icon_path,
            text=self.tr(u'QGIS2APICNIG'),
            callback=self.run,
            parent=self.iface.mainWindow())

        # will be set False in run()
        self.first_start = True


    def unload(self):
        """Removes the plugin menu item and icon from QGIS GUI."""
        for action in self.actions:
            self.iface.removePluginWebMenu(
                self.tr(u'&QGIS2API-CNIG'),
                action)
            self.iface.removeToolBarIcon(action)


    def run(self):
        """Run method that performs all the real work"""

        # Create the dialog with elements (after translation) and keep reference
        # Only create GUI ONCE in callback, so that it will only load when the plugin is started
        if self.first_start == True:
            self.first_start = False
            self.dlg = QGIS2APICNIGDialog()

        # show the dialog
        self.dlg.show()

        # Carga de funciones propias del complemento
        self.loadLayers()


        # Run the dialog event loop
        result = self.dlg.exec_()
        # See if OK was pressed
        if result:
            # Do something useful here - delete the line containing pass and
            # substitute with your code.
            pass

    
    def loadLayers(self):
        """
            Load layers in table
        """

        tablaCapas = self.dlg.tableWidget_capas
        tablaCapas.setEditTriggers(QAbstractItemView.NoEditTriggers)
        tablaCapas.setRowCount(0)

        for layer in QgsProject.instance().layerTreeRoot().findLayers():
            from console import console
            console.show_console()
            
            layer = QgsProject.instance().mapLayersByName(layer.name())[0]

            print('-----------------')
            print('layer.name():', layer.name() )
            print('dataSourceUri():', layer.dataProvider().dataSourceUri())
            try:
                print('storageType():', layer.dataProvider().storageType())
            except:
                print('storageType():', '---')
            print('-----------------')
            
            
            
            # Sacar la posición de la tupla en la tabla
            rowPosition = tablaCapas.rowCount()
            tablaCapas.insertRow(rowPosition)

            # Crear y añadir a la tabla el selector de capa superpuesta
            checkCapa = QCheckBox()
            checkCapa.setChecked(True)
            checkbox_layout_checkCapas = QHBoxLayout()
            checkbox_layout_checkCapas.addWidget(checkCapa)
            checkbox_layout_checkCapas.setAlignment(checkCapa, QtCore.Qt.AlignCenter)
            checkbox_widget_checkCapas = QWidget()
            checkbox_widget_checkCapas.setLayout(checkbox_layout_checkCapas)
            tablaCapas.setCellWidget(rowPosition , 0, checkbox_widget_checkCapas)

            # Crear y añadir el selector de capa visible
            checkCapaVisible = QCheckBox()
            checkCapaVisible.setChecked(True)
            checkbox_layout_CapaVisible = QHBoxLayout()
            checkbox_layout_CapaVisible.addWidget(checkCapaVisible)
            checkbox_layout_CapaVisible.setAlignment(checkCapaVisible, QtCore.Qt.AlignCenter)
            checkbox_widget_CapaVisible = QWidget()
            checkbox_widget_CapaVisible.setLayout(checkbox_layout_CapaVisible)
            tablaCapas.setCellWidget(rowPosition , 1, checkbox_widget_CapaVisible)

            
            # Condicional para obtener el tipo de capa
            if layer.type() == QgsMapLayer.VectorLayer:
                item = QTableWidgetItem("Vector")# create the item
            elif layer.type() == QgsMapLayer.RasterLayer:
                item = QTableWidgetItem("Ráster")# create the item
            else:
                item = QTableWidgetItem("---") # create the item
            item.setTextAlignment(QtCore.Qt.AlignCenter) # change the alignment
            tablaCapas.setItem(rowPosition , 2, item)

            # Condicional para saber el tipo de fuente de la capa
            uri = layer.dataProvider().dataSourceUri()
            if layer.type() == QgsMapLayer.VectorLayer:
                storageType = layer.dataProvider().storageType()
            elif layer.type() == QgsMapLayer.RasterLayer:
                if "%7By%7D" in uri:
                    storageType = "XYZ"
                elif "%7B-y%7D" in uri:
                    storageType = "TMS"
                elif "tileMatrixSet" in uri:
                    storageType = "WMTS"
                elif layer.providerType() == 'wms':
                    storageType = "WMS"
            else:
                storageType = "---"
            item =  QTableWidgetItem(storageType)
            item.setTextAlignment(QtCore.Qt.AlignCenter)
            tablaCapas.setItem(rowPosition , 3, item)


            # Obtener el nombre de la capa
            item =  QTableWidgetItem(layer.name())# create the item
            item.setTextAlignment(QtCore.Qt.AlignCenter) # change the alignment
            tablaCapas.setItem(rowPosition , 4, item)

            
            