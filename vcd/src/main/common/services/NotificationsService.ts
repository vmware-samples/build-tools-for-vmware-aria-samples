/*-
 * #%L
 * vcd
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
import { Injectable, EventEmitter } from "@angular/core";
import { Message } from "../../models/onboarding";

const messageDefaults: Message = {
	text: "",
	level: "info",
	isAppLevel: true,
	dismissible: true,
	dismissed: false
};

@Injectable()
export class NotificationsService {

	private dispatcher: EventEmitter<Message> = new EventEmitter();

	public constructor() {}
	
	public publishMessage(message: Message|string) {
		const contents: Message = { ...messageDefaults };
		if (typeof message === "string") {
			contents.text = message;
		} else {
			contents.text = message?.text || contents?.text;
			contents.level = message?.level || contents?.level;
			contents.isAppLevel = message?.isAppLevel || contents?.isAppLevel;
			contents.dismissible = message?.dismissible || contents?.dismissible;
		}
		this.dispatcher.next(contents);
	}

	public publishError(message: Message|string) {
		if (typeof message === "string") {
			this.publishMessage({
				text: message,
				level: "danger"
			});
		} else {
			this.publishMessage({
				...message,
				level: "danger"
			});
		}
	}

	public subscribe(generatorOrNext?: any, error?: any, complete?: any) {
		return this.dispatcher.subscribe(generatorOrNext, error, complete);
	}
	
}
