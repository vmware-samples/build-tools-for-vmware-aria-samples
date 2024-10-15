/*-
 * #%L
 * vro
 * %%
 * Copyright (C) 2024 VMWARE
 * %%
 * Copyright 2023 VMware, Inc.
 * 
 * This product is licensed to you under the BSD 2 clause (the "License"). You may not use this product except in compliance with the License.
 * 
 * This product may include a number of subcomponents with separate copyright notices and license terms. Your use of these subcomponents is subject to the terms and conditions of the subcomponent's license, as noted in the LICENSE file.
 * #L%
 */
import { Workflow, Out, In } from "vrotsc-annotations";
import { getDefaultGateway } from "../../actions/getDefaultGateway";
import { getIpAddress } from "../../actions/getIpAddress";

@Workflow({
    name: "NetworkConfigure",
    path: "PSCoE/vRBT Demo/Subscription/",
    id: "240bd8c6-d488-42f1-ab95-7f1be420c053",
    description: "Network Configure",
    input: {
        inputProperties: {
            type: "Properties"
        }
    },
    output: {
        addresses: { type: "Array" },
        dnsServers: { type: "Array" },
        gateways: { type: "Array" },
        skipIPAllocations: { type: "Array" },
        cidrs: { type: "Array" },
    }
})
export class NetworkConfigure {
    execute(
        @In inputProperties: Properties,
        @Out addresses: string[][],
        @Out dnsServers: string[][][],
        @Out gateways: string[][][],
        @Out skipIPAllocations: boolean[][],
        @Out cidrs: string[][],
    ): void {


        const resourceIds = inputProperties.get<string[]>("resourceIds");
		for (let resId = 0; resId < resourceIds.length; resId++) {
			const vmName = inputProperties.get<string>("externalIds")[resId];
			const networkIds = inputProperties.get<string[]>("networkSelectionIds")[resId];
			for (let netId = 0; netId < networkIds.length; netId++) {
				// dimension 1 - for each resource (machine)
				// dimension 2 - for each NIC in the resource
				addresses = new Array();
				addresses[resId] = new Array();
				addresses[resId][netId] = getIpAddress()

				gateways = new Array();
				gateways[resId] = new Array();
				gateways[resId][netId] = new Array();
				gateways[resId][netId][0] = getDefaultGateway();

				dnsServers = new Array();
				dnsServers[resId] = new Array();
				dnsServers[resId][netId] = ["192.168.0.253"];

				skipIPAllocations = new Array();
				skipIPAllocations[resId] = new Array();
				skipIPAllocations[resId][netId] = true;

				cidrs = new Array();
				cidrs[resId] = new Array();
				cidrs[resId][netId] = "10.99.65.0/24";
			}
		}
    }
}
