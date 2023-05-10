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
import { Component, Inject, Input, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import {
	FormConfiguration,
	Organization,
	SelectionOption,
	User,
	ValidationConfig,
	VirtualDatacenter
} from "../models/onboarding";
import { OnboardingService } from "../common/services/OnboardingService";
import { NotificationsService } from "../common/services/NotificationsService";
import { Router } from "@angular/router";
import { EXTENSION_ROUTE, SESSION_ORGANIZATION } from "@vcd/sdk/common";
import { ClrWizard } from "@clr/angular";

export class StringValidator {
	constructor(private readonly value: string, private readonly config: ValidationConfig) {}

	validate(): boolean {
		if (!this.config) {
			return true;
		}
		if (
			this.value?.length < this.config.min ||
			this.value?.length > this.config.max ||
			(this.config.pattern && !new RegExp(this.config.pattern).test(this.value))
		) {
			return false;
		}
		return true;
	}
}

@Component({
	selector: "customer-onboarding-wizard",
	templateUrl: "./customer-onboarding-wizard.component.html",
	styleUrls: ["./customer-onboarding-wizard.component.scss"],
	host: { class: "content-container" }
})
export class CustomerOnboardingWizard implements OnInit {
	@ViewChild("wizard", { static: false }) wizard: ClrWizard;
	@Input() private formConfiguration: FormConfiguration = {};

	private readonly loading: boolean = true;
	private submitted: boolean = false;
	private extensionRoute: string;

	public organization: Organization = new Organization();
	public adminUser: User = new User();
	public virtualDatacenter: VirtualDatacenter = new VirtualDatacenter();

	public pvdcPoolOptions: SelectionOption[] = [];

	public selectedLocation: string;

	public opened: boolean;

	public constructor(
		private onboardingService: OnboardingService,
		private notificationService: NotificationsService,
		private router: Router,
		@Inject(EXTENSION_ROUTE) extensionRoute: string,
		@Inject(SESSION_ORGANIZATION) private readonly orgId: string
	) {
		this.extensionRoute = extensionRoute;
	}

	ngOnChanges(changes: SimpleChanges) {
		this.formConfiguration = changes.formConfiguration.currentValue;

		if (!Object.values(this.formConfiguration).length) {
			return;
		}
		this.pvdcPoolOptions = this.formConfiguration?.vdc.providers;
		this.selectedLocation = this.formConfiguration?.vdc.defaultLocation;
		this.virtualDatacenter.location = this.formConfiguration?.vdc.defaultLocation;
		this.virtualDatacenter.networkQuota = this.formConfiguration?.vdc.networkQuota.default;
		this.virtualDatacenter.cpuQuota = this.formConfiguration?.vdc.cpu.default;
		this.virtualDatacenter.cpuGuaranteed = this.formConfiguration?.vdc.cpuGuaranteed.default;
		this.virtualDatacenter.memoryQuota = this.formConfiguration?.vdc.memory.default;
		this.virtualDatacenter.memoryGuaranteed =
			this.formConfiguration?.vdc.memoryGuaranteed.default;
	}

	ngOnInit(): void {}

	get networkPoolOptions(): SelectionOption[] {
		return this.currentPvdc()?.networkPools || [];
	}

	get storageProfileOptions(): SelectionOption[] {
		return this.currentPvdc()?.storageProfiles || [];
	}

	selectedProviderVdcReference: any;

	set selectedProviderVdcHref(value: any) {
		const newVdcRef = this.pvdcPoolOptions.find(p => p.value.href === value).value;

		if (this.selectedProviderVdcReference !== newVdcRef) {
			this.selectedProviderVdcReference = newVdcRef;
			this.virtualDatacenter.providerVdcReference = newVdcRef;
			this.virtualDatacenter.location = this.formConfiguration.vdc.defaultLocation;
			this.virtualDatacenter.cpuQuota = this.formConfiguration.vdc.cpu.default;
			this.virtualDatacenter.cpuGuaranteed = this.formConfiguration.vdc.cpuGuaranteed.default;
			this.virtualDatacenter.memoryQuota = this.formConfiguration.vdc.memory.default;
			this.virtualDatacenter.memoryGuaranteed =
				this.formConfiguration.vdc.memoryGuaranteed.default;
			this.virtualDatacenter.networkQuota = this.formConfiguration.vdc.networkQuota.default;
			this.virtualDatacenter.storageProfileLimit =
				this.formConfiguration.vdc.storageProfileLimit.default;

			this.virtualDatacenter.networkPoolReference = undefined;
			this.virtualDatacenter.storageProfile = undefined;
		}
	}

	private currentPvdc(safe: boolean = true): any {
		const pvdc = this.pvdcPoolOptions.find(
			p => p.value.href === this.virtualDatacenter.providerVdcReference.href
		);
		return pvdc ? pvdc : safe ? {} : undefined;
	}

	public open() {
		this.opened = true;
	}

	public onWizardCancelled() {
		this.wizard.forceFinish();
		this.opened = false;
	}
	public onWizardFinish() {
		this.submit();
		this.wizard.forceFinish();
		this.opened = false;
	}
	public onWizardNext() {
		this.wizard.forceNext();
	}

	public submit() {
		this.submitted = true;
		this.notificationService.publishMessage({
			text: `Started onboarding of customer "${this.organization.name}". Status message will be presented upon completion.`,
			level: "info",
			isAppLevel: true,
			dismissible: true
		});
		this.onboardingService
			.onboardNewCustomer({
				organization: this.organization,
				adminUser: this.adminUser,
				virtualDatacenter: this.virtualDatacenter
			})
			.catch(error => {
				this.notificationService.publishMessage({
					text: `Failed to onboard customer "${this.organization.name}"! Error: ${error.message}`,
					level: "danger",
					isAppLevel: true,
					dismissible: true
				});
				this.submitted = false;
			});
	}

	public isVdcValid(): boolean {
		return (
			this.formConfiguration.vdc &&
			this.checkIsValid(this.virtualDatacenter.cpuQuota, this.formConfiguration.vdc.cpu) &&
			this.checkIsValid(
				this.virtualDatacenter.cpuGuaranteed,
				this.formConfiguration.vdc.cpuGuaranteed
			) &&
			this.checkIsValid(
				this.virtualDatacenter.memoryGuaranteed,
				this.formConfiguration.vdc.memoryGuaranteed
			) &&
			this.checkIsValid(
				this.virtualDatacenter.memoryQuota,
				this.formConfiguration.vdc.memory
			) &&
			this.checkIsValid(
				this.virtualDatacenter.networkQuota,
				this.formConfiguration.vdc.networkQuota
			)
		);
	}
	public isAdminUserValid(): boolean {
		return (
			this.formConfiguration.adminUser &&
			this.checkIsValid(this.adminUser.fullName, this.formConfiguration.adminUser.fullName) &&
			this.checkIsValid(this.adminUser.email, this.formConfiguration.adminUser.email) &&
			(!this.adminUser.IM ||
				this.checkIsValid(this.adminUser.IM, this.formConfiguration.adminUser.IM)) &&
			this.checkIsValid(this.adminUser.phone, this.formConfiguration.adminUser.phoneNumber)
		);
	}
	public isOrganizationDetailsValid(): boolean {
		return (
			this.formConfiguration.organization &&
			this.checkIsValid(this.organization?.name, this.formConfiguration.organization.name) &&
			this.checkIsValid(
				this.organization?.identifier,
				this.formConfiguration.organization.identifier
			)
		);
	}

	private checkIsValid(value: any, config: ValidationConfig): boolean {
		return new StringValidator(value, config).validate();
	}
}
