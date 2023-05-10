/*-
 * #%L
 * vro
 * %%
 * Copyright (C) 2023 VMWARE
 * %%
 * Copyright 2023 VMware, Inc.
 * 
 * This product is licensed to you under the BSD 2 clause (the "License"). You may not use this product except in compliance with the License.
 * 
 * This product may include a number of subcomponents with separate copyright notices and license terms. Your use of these subcomponents is subject to the terms and conditions of the subcomponent's license, as noted in the LICENSE file.
 * #L%
 */
import { Workflow } from "vrotsc-annotations";

@Workflow({
	name: "Install vRBT Demo",
	path: "VMware/PSCOE",
	id: "d71711e4-81e5-410e-a7f4-2f885cf478e9",
	description: "Solution Install Workflow",
	input: {
		jsonString: {
			type: "string",
			required: true
		},
		tags: {
			type: "Array/string",
			required: false
		},
		blacklist: {
			type: "Array/string",
			required: false
		},
		environment: {
			type: "string",
			required: false
		}
	},
	presentation: ""
})
export class InstallWorkflow {
	public install(jsonString: string, tags: string, blacklist: string, environment: string): void {
		System.log("Output from installation workflow ---- START");
		System.log("jsonString=" + jsonString);
		System.log("tags=" + tags);
		System.log("blacklist=" + blacklist);
		System.log("environment=" + environment);
		System.log("Output from installation workflow ---- END");
	}
}
