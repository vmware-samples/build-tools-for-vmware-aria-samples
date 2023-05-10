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
import { Component, OnInit, Input } from "@angular/core";
import { MessageLevel } from "../../models/onboarding";

@Component({
    selector: "message",
    templateUrl: "./message.component.html",
})
export class MessageComponent implements OnInit {
	@Input() text: string = "";
	@Input() level: MessageLevel = "info";
	@Input() isAppLevel: boolean = false;
	@Input() dismissible: boolean = true;
	@Input() dismissed: boolean = true;

    public constructor() {}

    public ngOnInit() {}

}
