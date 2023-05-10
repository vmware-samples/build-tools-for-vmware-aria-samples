/*-
 * #%L
 * abx-all_abxps1
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
export async function handler(context: any, inputs: any, callback: Function) {

	try {
		await delay(() => {
			console.log('Inputs were ' + JSON.stringify(inputs));
		})
		callback(null, { 'done': "doneval" });
	} catch (err) {
		callback(new Error(err.message));
	}

}

async function delay(func: () => void, ms: number = 1) {
	await new Promise((resolve, reject) => {
		setTimeout(() => {
			try {
				func();
				resolve();
			} catch (e) {
				reject(e.message);
			}
		}, ms);
	});
}
