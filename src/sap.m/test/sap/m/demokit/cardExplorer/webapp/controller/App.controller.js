sap.ui.define([
		"sap/ui/demo/cardExplorer/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/Device",
		"../model/DocumentationNavigationModel",
		"../model/ExploreNavigationModel"
	], function (BaseController,
				 JSONModel,
				 Device,
				 documentationNavigationModel,
				 exploreNavigationModel) {
		"use strict";

		return BaseController.extend("sap.ui.demo.cardExplorer.controller.App", {
			/**
			 * Called when the app is started.
			 */
			onInit : function () {
				this._setToggleButtonTooltip(!sap.ui.Device.system.desktop);

				// apply content density mode to root view
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

				this.getRouter().attachRouteMatched(this.onRouteChange.bind(this));

				Device.media.attachHandler(this.onDeviceSizeChange, this, Device.media.RANGESETS.SAP_STANDARD);
			},

			onExit: function () {
				Device.media.detachHandler(this.onDeviceSizeChange, this, Device.media.RANGESETS.SAP_STANDARD);
			},

			onTabSelect: function (oEvent) {
				var item = oEvent.getParameter('item');

				if (item.getKey() === "exploreSamples") { // TODO implement in generic way
					// there is no home page for exploreSamples, so navigate to first example
					this.getRouter().navTo("exploreSamples", {key: "list"});
					return;
				}

				this.getRouter().navTo(item.getKey());
			},

			onSideNavigationItemSelect: function (oEvent) {
				var item = oEvent.getParameter('item'),
					itemConfig = this.getView().getModel().getProperty(item.getBindingContext().getPath());

				if (itemConfig.target) {
					this.getRouter().navTo(
						itemConfig.target,
						{
							key: itemConfig.key
						}
					);
				} else {
					this.getRouter().navTo(itemConfig.key);
				}
			},

			onSideNavButtonPress : function() {
				var toolPage = this.byId('toolPage');
				var sideExpanded = toolPage.getSideExpanded();

				this._setToggleButtonTooltip(sideExpanded);

				toolPage.setSideExpanded(!toolPage.getSideExpanded());
			},

			onRouteChange: function (oEvent) {
				var routeConfig = oEvent.getParameter('config');
				var routeArgs = oEvent.getParameter("arguments");
				var routeName = routeConfig.name;
				var sideNavigation = this.getView().byId('sideNavigation');
				var iconTabHeader = this.getView().byId('iconTabHeader');
				var model = documentationNavigationModel;

				if (routeName.indexOf('explore') === 0) {
					model = exploreNavigationModel;
					iconTabHeader.setSelectedKey("exploreSamples");
				}

				this.getView().setModel(model);

				if (routeArgs["key"]) {
					sideNavigation.setSelectedKey(routeArgs["key"]);
				} else if (routeConfig.name !== "default") {
					sideNavigation.setSelectedKey(routeConfig.name);
				}
			},

			onDeviceSizeChange: function (mParams) {
				var toolPage = this.byId('toolPage');
				switch (mParams.name) {
					case "Phone":
					case "Tablet":
						toolPage.setSideExpanded(false);
						break;
					case "Desktop":
						toolPage.setSideExpanded(true);
						break;
				}
			},

			_setToggleButtonTooltip : function(bLarge) {
				var toggleButton = this.byId('sideNavigationToggleButton');
				if (bLarge) {
					toggleButton.setTooltip('Large Size Navigation');
				} else {
					toggleButton.setTooltip('Small Size Navigation');
				}
			}
		});
	}
);