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
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: "config-input",
    templateUrl: "./config-input.component.html",
    styleUrls: ["./config-input.component.scss"],
})
export class ConfigInput implements OnInit {

    @Input() private readonly name: string = "";
    @Input() private readonly type: string = "text";
    @Input() private readonly label: string = "";
    @Input() private readonly placeholder: string = "";
    @Input() private readonly required: boolean = false;
    @Input() private configuration: any = {};
    @Input() private readonly step: number = undefined;

    @Output() valueChange = new EventEmitter();
    @Input() value: any;

    get valueHander() {
        return this.value;
    }

    set valueHander(val) {
        this.value = val;
        this.valueChange.emit(val);
    }

    public ngOnInit() {
        this.configuration = this.configuration || {};
    }

    get minLength() {
        return ["text", "email"].indexOf(this.type) !== -1 ? this.configuration.min : undefined;
    }

    get maxLength() {
        return ["text", "email"].indexOf(this.type) !== -1 ? this.configuration.max : undefined;
    }

    get minVal() {
        return ["text", "email"].indexOf(this.type) !== -1 ? undefined : this.configuration.min;
    }

    get maxVal() {
        return ["text", "email"].indexOf(this.type) !== -1 ? undefined : this.configuration.max;
    }

    private validationHint(value) {
        if (!this.configuration) {
            return
        }

        let errorMessage = ''
        if (this.required && !value) {
            errorMessage = 'Please specify a value for this field';
        } else if (["text", "email"].indexOf(this.type) !== -1) {
            if (value.length < this.configuration.min) {
                errorMessage = `The minimum length of the value is ${this.configuration.min}`
            } else if (value.length > this.configuration.max) {
                errorMessage = `The maximum length of the value is ${this.configuration.max}`
            } else if (!(new RegExp(this.configuration.pattern).test(value))) {
                errorMessage = `The value should match the following pattern ${this.configuration.pattern}`
            }
        } else if (this.type === "number") {
            if (value < this.configuration.min) {
                errorMessage = `The minimum value is ${this.configuration.min}`
            } else if (value > this.configuration.max) {
                errorMessage = `The maximum value is ${this.configuration.max}`
            }
        }
        return errorMessage
    }

    private fixVal(event: any) {
        if (this.type !== "number") {
            return;
        }

        let val = parseInt(`${event.target.value || 0}`);

        const min: number = this.configuration.min;
        if (typeof min !== "undefined" && val < min) {
            val = min;
        }

        const max: number = this.configuration.max;
        if (typeof max !== "undefined" && val > max) {
            val = max;
        }

        event.target.value = val;
    }
}
