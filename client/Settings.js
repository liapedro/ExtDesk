/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */

Ext.define('MyDesktop.Settings', {
    extend: 'Ext.window.Window',

    uses: [
        'Ext.tree.Panel',
        'Ext.tree.View',
        'Ext.form.field.Checkbox',
        'Ext.layout.container.Anchor',
        'Ext.layout.container.Border',

        'Ext.ux.desktop.Wallpaper',

        'MyDesktop.WallpaperModel'
    ],

    layout: 'fit',
    title: userStore.strings().findRecord("alias","changeSettings").data.string,
    modal: true,
    width: 640,
    height: 480,
    border: false,
    lang:Array,

    initComponent: function () {
        var me = this;
		
        /**Languaje**/
        this.lang["wallpaper"]			= userStore.strings().findRecord("alias","wallpaper").data.string;
        this.lang["wallpaper_label"]	= userStore.strings().findRecord("alias","wallpaper_label").data.string;
        this.lang["selectImage"]		= userStore.strings().findRecord("alias","selectImage").data.string;
        this.lang["stretch"]			= userStore.strings().findRecord("alias","stretch").data.string;        
        this.lang["preview"]			= userStore.strings().findRecord("alias","preview").data.string;        
        this.lang["shortcut"]			= userStore.strings().findRecord("alias","shortcut").data.string;
        this.lang["shortcut_label"]		= userStore.strings().findRecord("alias","shortcut_label").data.string;
        this.lang["quicklaunch"]		= userStore.strings().findRecord("alias","quicklaunch").data.string;
        this.lang["quicklaunch_label"]	= userStore.strings().findRecord("alias","quicklaunch_label").data.string;
        this.lang["settings"]			= userStore.strings().findRecord("alias","settings").data.string;
        
        
		/**
		* Define de top Menu :)
		**/
		Ext.regModel('Image', {
		Fields: [
				{ name : 'id', 	type : 'string'},
				{ name : 'src', 	type : 'string'},
				{ name : 'title', 	type : 'string'},
				{ name : 'caption',	type : 'string'}
			]
		});

		me.store=Ext.create('Ext.data.Store', {
			id:'imagesStore',
			model: 'Image',
			data: [
				{id : 'wallpaper', src:'resources/images/tango/preferences-desktop-wallpaper_48x48.png', 		title :this.lang["wallpaper"],	caption : this.lang["wallpaper_label"]},
				{id : 'shortcut',  src:'resources/images/tango/preferences-desktop-shorcut_48x48.png',		title : this.lang["shortcut"],		caption : this.lang["shortcut_label"]},
				{id : 'qLaunch', src:'resources/images/tango/preferences-desktop-quick-launch_48x48.png', 	title : this.lang["quicklaunch"],		caption : this.lang["quicklaunch_label"]}
				]
		});

		me.imageTpl = new Ext.XTemplate(
			'<tpl for=".">',
				'<div id="{id}" class="thumb-wrap">',
				  '<img src="{src}" />',
				  '<span class="title">{title}</span><br/>',
				  '<span class="caption">{caption}</span>',
				'</div>',
			'</tpl><br/>'
		);
		
 		me.items = [
			{	
               	id:'settingsTabPanel',
				xtype: 'tabpanel',				
                activeTab:0,
                bodyStyle: 'padding: 5px;',
                layout:'border',				
				items:[
						{	// tab z
							id : 'SettingsTab',
							title: this.lang["settings"],
							header:false,
							border:false,
							layout:'anchor',
							bodyStyle: "background-image:url(blue.jpg) !important",
							items :
								Ext.create('Ext.view.View', {
									//xtype:'dataview',
									store: me.store,//Ext.data.StoreManager.lookup('imagesStore'),
									tpl: me.imageTpl,
									itemSelector: 'div.thumb-wrap',
									emptyText: 'No images available',
									overClass: 'x-view-over',
									singleSelect: true, 
									listeners: {
										itemclick:function(view,record,item,index,e,options){

											switch(index) {
												case 0 : me.openTabWallpaper();
														break;
												case 1 : me.openTabShortcuts();
														break;											
												case 2 : me.openTabQuickLaunch();
														break;
											}					
										}
									}		
								
							})
	
						}					]
			}
	
		]

        me.callParent();
    },
	
	openTabWallpaper : function(){
		var me = this;

		me.selected = me.desktop.getWallpaper();
        me.stretch = me.desktop.wallpaper.stretch;

        me.preview = Ext.create('widget.wallpaper');
        me.preview.setWallpaper(me.selected);
        me.tree = me.createTree();
		
		var tw=Ext.getCmp('preferTabWallpaper');
		if (tw==undefined){
			
			me.tabWallpaper= Ext.create('Ext.Panel', {
				id : 'preferTabWallpaper',
				title: this.lang["wallpaper"],
				closable : true,
				header:false,
				border:false,
				layout:'anchor',		
				items:							
					[
						{
							anchor: '0 -30',
							border: false,
							layout: 'border',
							items: [
								me.tree,
								{
									xtype: 'panel',
									title: this.lang["preview"],
									region: 'center',
									layout: 'fit',
									items: [ me.preview ]
								}
							]
						},
						{
							xtype: 'checkbox',
							boxLabel: this.lang["stretch"],
							checked: me.stretch,
							listeners: {
								change: function (comp) {
									me.stretch = comp.checked;
								}
							}
						}
				],
				dockedItems: [
                    {
                        xtype: 'toolbar',
                        dock: 'bottom',
                        statusAlign: 'right',
                        items: [
                            '->',
                            {
                                // FIXME : ExtDesk/Settings : Cambiar por una cadena literal.
                                xtype: 'button',
                                text: 'Guardar',
                                handler: me.onOK, 
                                scope: me
                            },
                            {
                                // FIXME : ExtDesk/Settings : Cambiar por una cadena literal.
                                xtype: 'button',
                                text: 'Cancelar',
                                handler:me.close, 
                                scope: me
                            }
                        ]
                    }
                ]
				
			});			
 	
			var sp = Ext.getCmp('settingsTabPanel');
			var tw = Ext.getCmp('preferTabWallpaper')
			sp.add(tw);
		}
		tw.show();
				
	},
    
	openTabShortcuts : function(){
		var me = this;
		var ts=Ext.getCmp('preferTabShortcutsForm');
		me.userStore=userStore;
		
		if (ts==undefined){
			me.tabShortcutForm= Ext.create('Ext.form.Panel', {
				id : 'preferTabShortcutsForm',
				title : 'Shortcuts',
				closable:true
				/*header:true*/							
			});
									
			this.userStore.modules().each(function(module) {
				if (module.get("shorcut")){
					var checked=true;
				}else{
					var checked=false;				
				}
					var id="id_check_sc_"+module.get("module");
					me.tabShortcutForm.add({
	 						id : id,
	 						xtype: 'checkboxfield',
	    					fieldLabel: '',
	    					boxLabel: module.get("name"),
	    					anchor: '100%',
	    					checked: checked,
	    					handler: me.clickOnShortcut
						}					
					);
				
			});
			
			var sp = Ext.getCmp('settingsTabPanel');
			var ts = Ext.getCmp('preferTabShortcutsForm')
			sp.add(ts);
			
		}
		ts.show();

	},
		
	openTabQuickLaunch : function(){
		var me = this;
		var tq=Ext.getCmp('preferTabQuickLaunchForm');
		
		me.userStore=userStore;
		
		if (tq==undefined){
			me.tabQLaunchForm= Ext.create('Ext.form.Panel', {	//tabs 2
				id : 'preferTabQuickLaunchForm',
				title : 'QuickLaunch',
				closable : true,
				header:false,
				//html: '<p>Panel to admin quickLaunch.</p>',
				border:false						
			});

			this.userStore.modules().each(function(module) {
				if (module.get("qLaunch")){
					var checked=true;
				}else{
					var checked=false;				
				}
					var id="id_check_ql_"+module.get("module");
					me.tabQLaunchForm.add({
						id:id,
						xtype: 'checkboxfield',
						fieldLabel: '',
						boxLabel: module.get("name"),
						anchor: '100%',
						checked:checked,
						handler: me.clickOnQLaunch
					}					
			);
				
			});

			
			var sp = Ext.getCmp('settingsTabPanel');
			var tq = Ext.getCmp('preferTabQuickLaunchForm')
			sp.add(tq);
			
		}
		tq.show();

	
	},
	
/*
 * Wallpaer methods
 */
	
	createTree : function() {
        var me = this;

        function child (img) {
            return { img: img, text: me.getTextOfWallpaper(img), iconCls: me.getTextOfIcoWallpaper(img), leaf: true };
        }

        var tree = new Ext.tree.Panel({
            title: this.lang['selectImage'],
            rootVisible: false,
            lines: false,
            autoScroll: true,
            width: 150,
            region: 'west',
            split: true,
            minWidth: 100,
            listeners: {
                afterrender: { fn: this.setInitialSelection, delay: 100 },
                select: this.onSelect,
                scope: this
            },
            store: new Ext.data.TreeStore({
                model: 'MyDesktop.WallpaperModel',
                root: {
                    text:'Wallpaper',
                    expanded: true,
                    children:[
                        { text: "None", iconCls: 'ico-None', leaf: true },
                        child('Blue-Sencha.jpg'),
                        child('Dark-Sencha.jpg'),
                        child('Wood-Sencha.jpg'),
                        child('blue.jpg'),
                        child('desk.jpg'),
                        child('desktop.jpg'),
                        child('desktop2.jpg'),
                        child('sky.jpg')
                    ]
                }
            })
        });

        return tree;
    },

    getTextOfWallpaper: function (path) {
        var text = path, slash = path.lastIndexOf('/');
        if (slash >= 0) {
            text = text.substring(slash+1);
        }
        var dot = text.lastIndexOf('.');
        text = Ext.String.capitalize(text.substring(0, dot));
        text = text.replace(/[-]/g, ' ');
        
		return text;
    },

	getTextOfIcoWallpaper: function (path) {
        var text = path, slash = path.lastIndexOf('/');
        if (slash >= 0) {
            text = text.substring(slash+1);
        }
        var dot = text.lastIndexOf('.');
        text = Ext.String.capitalize(text.substring(0, dot));
        text = 'ico-'+text.replace(/[-]/g, '-');
        
		return text;
    },
	
    onOK: function () {
        var me = this;
        if (me.selected) {
            me.desktop.setWallpaper(me.selected, me.stretch);
        }
        me.destroy();
    },

    onSelect: function (tree, record) {
        var me = this;

        if (record.data.img) {
            me.selected = 'resources/wallpapers/' + record.data.img;
        } else {
            me.selected = Ext.BLANK_IMAGE_URL;
        }

        me.preview.setWallpaper(me.selected);
    },

    setInitialSelection: function () {
        var s = this.desktop.getWallpaper();
        if (s) {
            var path = '/resources/wallpapers/' + this.getTextOfWallpaper(s);
            this.tree.selectPath(path, 'text');
        }
    },

/*
 * Other Methods
 * */
	
    clickOnShortcut: function(e){
    	
    	// Checkbox is checked..?
    	var checked=Ext.getCmp(e.id).getValue();
    	// Find in the user store, the module was clicked 
    	var module=userStore.modules().findRecord("name",e.boxLabel);
    	    	
    	if (!checked){	// delete shortcut, the user doesn't want see this shortcut....
			
    		// save the state of this shorcut...
    		module.set('shorcut',false); 
    		// find and delete the shorcut of the dataview...
    		var record=Ext.data.StoreManager.lookup('id-shortcutsstore').findRecord("name",e.boxLabel);
			Ext.data.StoreManager.lookup('id-shortcutsstore').remove(record);
    		
    	}else{			// add shortcut, please sorry i want this shortcut

			// save the state of this shorcut...
			module.set('shorcut',true);
			// add the shortcut to de dateview.... 
    		Ext.data.StoreManager.lookup('id-shortcutsstore').add(
    			{
    				name : module.get('name'),
    				iconCls : module.get('iconCls'),
    				module : module.get('module')
    			}
    		);    		
    	}
    },
   
    clickOnQLaunch: function(e){
     	
    	// Checkbox is checked..?
    	var checked=Ext.getCmp(e.id).getValue();
    	// Find in the user store, the module was clicked 
    	var module=userStore.modules().findRecord("name",e.boxLabel);   	
    	    	
    	// delete qlaunch, the user doesn't want see this shortcut....
    	if (!checked){				
    		// save the state of this shorcut...
    		module.set('qLaunch',false); 
       	// add qlaunch, please sorry i want this shortcut       	
       	}else{				
       		// save the state of this shorcut...
			module.set('qLaunch',true);
		}   	
		// we need some more simple here
    	//myDesktopApp.init();
		myDesktopApp.desktop.app.init();
    	
    	
    
    }	

});
