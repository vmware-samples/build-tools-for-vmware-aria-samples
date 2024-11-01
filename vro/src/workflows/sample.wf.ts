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
import { Workflow, Out } from "vrotsc-annotations";

@Workflow({
    name: "Sample Workflow",
    path: "MyOrg/MyProject",
    id: "",
    description: "Sample workflow description",
    attributes: {
    },
    input: {
        foo: {
            type: "string",
            availableValues: ["a", "b"],
            defaultValue: "а",
            description: "foo Value",
            required: true,
            title: "Foo"
        },
        bar: { type: "string" }
    },
    output: {
        result: { type: "Any" }
    },
    presentation: ""
})
export class SampleWorkflow {
    public install(foo: string, bar: string, @Out result: any): void {
        System.log(`foo=${foo}, bar=${bar}`);
        result = "result value";
    }
}
