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
export class Organization {
	identifier?: string = "";
	name?: string = "";
	allocationModel?: AllocationModel;
}

enum AllocationModel {
	FLEX = "Flex",
	PAY_AS_YOU_GO = "AllocationVApp"
}

export class User {
	fullName?: string = "";
	email?: string = "";
	phone?: string = "";
	IM?: string = "";
}

export class VirtualDatacenter {
	providerVdcReference?: EntityReference = {};
	cpuQuota?: number = 0;
	cpuGuaranteed?: number = 0;
	memoryQuota?: number = 0;
	memoryGuaranteed?: number = 0;
	providerVdcStorageProfile?: string = "";
	storageProfileLimit?: number = 0;
	networkPoolReference?: EntityReference = {};
	networkQuota: number;
	externalNetwork?: EntityReference;
	alocationModel?: string = "AllocationVApp";
	location?: string = "";
	storageProfile?: any;
}

export interface CustomersListResponse {
	paging: {
		total: number;
		pageSize: number;
	};
	records: OrganizationReference[];
}

export interface OrganizationReference {
	otherAttributes?: any;
	href?: string;
	id?: string;
	name?: string;
	displayName?: string;
	type?: string;
	metadata?: any;
	vCloudExtension?: any;
	isSecondDaySelected: boolean;
	[index: string]: any;
}

export interface OrganizationFilter {
	name?: string;
	id?: string;
	page?: number;
	pageSize?: number;
}

export interface EntityReference {
	id?: string;
	name?: string;
	href?: string;
	type?: string;
	otherAttributes?: Record<string, any>;
	vCloudExtension?: Record<string, any>[];
}

export interface IMessage {
	type?: "info" | "error";
	text: string;
}

export interface ValidationConfig {
	min?: number
	max?: number
	pattern?: string
}
export interface DefaultValueValidationConfig extends ValidationConfig {
	default?: number
}
export interface FormConfiguration {
	organization?: {
		name?: ValidationConfig,
		identifier?: ValidationConfig,
		sfIdentifier?: ValidationConfig
	},
	adminUser?: {
		fullName?: ValidationConfig,
		email?: ValidationConfig,
		phoneNumber?: ValidationConfig,
		IM?: ValidationConfig
	},
	vdc?: {
		providers?: Array<{
			value: any,
			label: string,
			storageProfiles?: SelectionOption[],
			networkPools?: SelectionOption[]
		}>,
		networkQuota: DefaultValueValidationConfig,
		cpu?: DefaultValueValidationConfig,
		cpuGuaranteed?: DefaultValueValidationConfig,
		memory?: DefaultValueValidationConfig,
		memoryGuaranteed?: DefaultValueValidationConfig,
		storageProfileLimit?: DefaultValueValidationConfig,
		defaultLocation?: string,
		locations?: string[]
	}
}

export interface SelectionOption {
	value: any;
	label: string;
	[index: string]: any;
}

export type MessageLevel = "success" | "info" | "danger" | "warning";

export class Message implements IMessage {
	type?: "info" | "error";
	text: string;
	level?: MessageLevel;
	isAppLevel?: boolean;
	dismissible?: boolean;
	dismissed?: boolean;
}
