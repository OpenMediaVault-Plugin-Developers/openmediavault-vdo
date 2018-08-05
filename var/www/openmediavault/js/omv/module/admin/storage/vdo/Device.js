/**
 * Copyright (C) 2018 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// require("js/omv/WorkspaceManager.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")
// require("js/omv/form/field/plugin/FieldInfo.js")

Ext.define('OMV.module.admin.storage.vdo.Target', {
    extend: 'OMV.workspace.window.Form',
    requires: [
        'OMV.form.field.plugin.FieldInfo',
        'OMV.workspace.window.plugin.ConfigObject'
    ],

    plugins: [{
        ptype: 'configobject'
    }],

    hideResetButton: true,

    rpcService: 'VDO',
    rpcGetMethod: 'getDevice',
    rpcSetMethod: 'setDevice',

    getFormItems: function() {
        var me = this;
        return [{
            xtype: "combo",
            name: "device",
            fieldLabel: _("Device"),
            emptyText: _("Select a device ..."),
            store: Ext.create("OMV.data.Store", {
                autoLoad: true,
                model: OMV.data.Model.createImplicit({
                    idProperty: "devicefile",
                    fields: [
                        { name: "devicefile", type: "string" },
                        { name: "description", type: "string" }
                    ]
                }),
                proxy: {
                    type: "rpcbg",
                    appendSortParams: false,
                    rpcData: {
                        service: "FileSystemMgmt",
                        method: "getCandidatesBg"
                    }
                },
                sorters: [{
                    direction: "ASC",
                    property: "devicefile"
                }]
            }),
            displayField: "description",
            valueField: "devicefile",
            allowBlank: false,
            editable: false,
            triggerAction: "all"
        },{
            xtype: "textfield",
            name: "name",
            fieldLabel: _("Name"),
            allowBlank: false
        },{
            xtype: "textfield",
            name: "size",
            fieldLabel: _("Logical Size"),
            allowBlank: false
        },{
            xtype: "combo",
            name: "policy",
            fieldLabel: _("Write policy"),
            emptyText: _("Select a write policy ..."),
            queryMode: "local",
            store: [
                [ "async", "Async" ],
                [ "sync", "Sync" ],
                [ "auto", "Auto" ]
            ],
            allowBlank: false,
            editable: false,
            triggerAction: "all",
            value: "async"
        }];
    }
});
