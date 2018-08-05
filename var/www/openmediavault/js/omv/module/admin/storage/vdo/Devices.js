/**
 * @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
 * @author    OpenMediaVault Plugin Developers <plugins@omv-extras.org>
 * @copyright Copyright (c) 2018 OpenMediaVault Plugin Developers
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
// require("js/omv/workspace/grid/Panel.js")
// require("js/omv/workspace/window/Form.js")
// require("js/omv/workspace/window/plugin/ConfigObject.js")
// require("js/omv/util/Format.js")
// require("js/omv/Rpc.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")

Ext.define('OMV.module.admin.storage.vdo.Devices', {
    extend: 'OMV.workspace.grid.Panel',
    requires: [
        'OMV.Rpc',
        'OMV.data.Store',
        'OMV.data.Model',
        'OMV.data.proxy.Rpc',
        'OMV.util.Format'
    ],

    hidePagingToolbar: false,
    hideEditButton: true,
    autoReload: false,
    stateful: true,
    stateId: 'a93e57f8-98d6-11e8-ae96-975363265839',
    columns: [{
        xtype: 'textcolumn',
        text: _('Device'),
        sortable: true,
        dataIndex: 'device',
        stateId: 'device'
    },{
        xtype: 'textcolumn',
        text: _('Size'),
        sortable: true,
        dataIndex: 'size',
        stateId: 'size'
    },{
        xtype: 'textcolumn',
        text: _('Used'),
        sortable: true,
        dataIndex: 'used',
        stateId: 'used'
    },{
        xtype: 'textcolumn',
        text: _('Available'),
        sortable: true,
        dataIndex: 'available',
        stateId: 'available'
    },{
        xtype: 'textcolumn',
        text: _('Use %'),
        sortable: true,
        dataIndex: 'use',
        stateId: 'use'
    },{
        xtype: 'textcolumn',
        text: _('Space Saving %'),
        sortable: true,
        dataIndex: 'saving',
        stateId: 'saving'
    }],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            store: Ext.create('OMV.data.Store', {
                autoLoad: true,
                model: OMV.data.Model.createImplicit({
                    idProperty: 'devname',
                    fields: [
                        { name: 'device', type: 'string' },
                        { name: 'size', type: 'string' },
                        { name: 'used', type: 'string' },
                        { name: 'available', type: 'string' },
                        { name: 'use', type: 'string' },
                        { name: 'saving', type: 'string' }
                    ]
                }),
                proxy: {
                    type: 'rpc',
                    rpcData: {
                        service: 'VDO',
                        method: 'getDeviceList'
                    }
                }
            })
        });
        me.callParent(arguments);
    }
});

OMV.WorkspaceManager.registerPanel({
    id: 'devices',
    path: '/storage/vdo',
    text: _('Devices'),
    position: 10,
    className: 'OMV.module.admin.storage.vdo.Devices'
});
