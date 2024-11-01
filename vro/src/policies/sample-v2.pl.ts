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
import { PolicyTemplate } from "vrotsc-annotations";

@PolicyTemplate({
	name: "Sample Policy",
	path: "MyOrg/MyProject",
	templateVersion: "v2",
	variables: {
		sample: {
			type: "string",
			value: "",
			description: "Description"
		}
	},
	elements: {
		sample: {
			type: "AMQP:Subscription",
			events: {
				onMessage: "onMessage"
			}
		}
	}
})
export class SamplePolicy {
	onMessage(self: AMQPSubscription, event: any) {
		let message = self.retrieveMessage(event);
		System.log(`Received message ${message.bodyAsText}`);
	}
}
