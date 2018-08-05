<?php
/**
 * Copyright (C) 2009-2018 Volker Theile <volker.theile@openmediavault.org>
 * Copyright (C) 2018 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

class OMVRpcServiceVdo extends \OMV\Rpc\ServiceAbstract
{
    public function getName()
    {
        return 'VDO';
    }

    public function initialize()
    {
        $this->registerMethod('getDeviceList');
        $this->registerMethod('createDevice');
        $this->registerMethod('removeDevice');
    }

    public function getDeviceList($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.common.getlist');
        // Get output of vdostats
        $cmd = new \OMV\System\Process('vdostats --human-readable | tail -n+2');
        $cmd->setQuiet(true);
        $cmd->execute($output);
        $devices = [];
        foreach ($output as $line) {
            $pieces = preg_split('/\s+/', $line);
            $devices[] = [
                'device'    => $pieces[0],
                'size'      => $pieces[1],
                'used'      => $pieces[2],
                'available' => $pieces[3],
                'use'       => $pieces[4],
                'saving'    => $pieces[5]
            ];
        }
        // Filter the result.
        return $this->applyFilter($devices, $params['start'], $params['limit'],
            $params['sortfield'], $params['sortdir']);
    }

    public function createDevice($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.vdo.settarget');
        // Verify that name is not in use
        $cmdArgs = sprintf('vdo list --all | grep -q %s', $params['name']);
        $cmd = new \OMV\System\Process($cmdArgs);
        $cmd->setQuiet(true);
        $cmd->execute($output, $result);
        if ($result == 0) {
            throw new \OMV\Exception(
                "Device name %s already in use.", $params['name']
            );
        }
        // create the device
        $cmdArgs = [];
        $cmdArgs[] = "create";
        $cmdArgs[] = sprintf("--name=%s", $params['name']);
        $cmdArgs[] = sprintf("--device=%s", $device);
        $cmdArgs[] = sprintf("--vdoLogicalSize=%s", $params['size']);
        $cmdArgs[] = sprintf("--writePolicy=%s", $params['policy']);
        $cmd = new \OMV\System\Process("vdo", $cmdArgs);
        $cmd->execute($output, $result);
    }

    public function removeDevice($params, $context)
    {
        // Validate the RPC caller context.
        $this->validateMethodContext($context, ['role' => OMV_ROLE_ADMINISTRATOR]);
        // Validate the parameters of the RPC service method.
        $this->validateMethodParams($params, 'rpc.vdo.deletedevice');
        // remove the device
        $cmdArgs = [];
        $cmdArgs[] = "remove";
        $cmdArgs[] = sprintf("--name %s", $params['name']);
        $cmd = new \OMV\System\Process("vdo", $cmdArgs);
        $cmd->execute($output, $result);
    }
}
