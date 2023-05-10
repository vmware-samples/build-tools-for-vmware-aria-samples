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
import { Injectable } from "@angular/core";
import { VcdApiClient } from "@vcd/sdk";
import { Observable } from "rxjs";
import { IMessage } from "../../models/onboarding";
import { VRO_API_BASE_PATH } from "../config";

@Injectable()
export class OnboardingService {
	private readonly basePath: string;

	public constructor(private client: VcdApiClient) {
		this.basePath = VRO_API_BASE_PATH;
	}

	public pickMessages(): Observable<IMessage[]> {
		return this.client.get(`${this.basePath}/messages`);
	}

	public async checkVroService(): Promise<boolean> {
		return new Promise(resolve => {
			const subscription = this.client.get(`${this.basePath}/ping`).subscribe(
				() => {
					resolve(true);
				},
				(error: any) => {
					console.error(`Pinging vRO service failed with error: ${error.message}`);
					resolve(false);
				},
				() => {
					subscription.unsubscribe();
				}
			);
		});
	}

	public async getOnboardingFormConfiguration(): Promise<any> {
		return new Promise((resolve, reject) => {
			const subscription = this.client.get(`${this.basePath}/form/configuration`).subscribe(
				configuration => {
					resolve(configuration);
				},
				(error: any) => {
					console.error(`Pinging vRO service failed with error: ${error.message}`);
					reject(
						`Failed to load onboarding form configuration! Original error: ${error.message}`
					);
				},
				() => {
					subscription.unsubscribe();
				}
			);
		});
	}

	public async onboardNewCustomer(customerData: any) {
		return new Promise((resolve, reject) => {
			const subscription = this.client.createSync(this.basePath, customerData).subscribe(
				response => {
					resolve(response);
				},
				(error: any) => {
					console.error(`Customer onboarding failed with error: ${error.message}`);
					reject(`Failed to onboard customer! Original error: ${error.message}`);
				},
				() => {
					subscription.unsubscribe();
				}
			);
		});
	}

	public async offboardCustomer(customerId: string) {
		return new Promise((resolve, reject) => {
			const subscription = this.client.deleteSync(`${this.basePath}/${customerId}`).subscribe(
				response => {
					resolve(response);
				},
				(error: any) => {
					console.error(`Customer offboarding failed with error: ${error.message}`);
					reject(`Failed to offboard customer! Original error: ${error.message}`);
				},
				() => {
					subscription.unsubscribe();
				}
			);
		});
	}
}
