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
import {
	Component,
	OnInit,
	OnDestroy,
	ViewChild,
	AfterViewInit,
	ViewChildren,
	QueryList
} from "@angular/core";
import { OnboardingService } from "../common/services/OnboardingService";
import { NotificationsService } from "../common/services/NotificationsService";
import { FormConfiguration, Organization, OrganizationReference } from "../models/onboarding";
import { CustomerOnboardingWizard } from "./customer-onboarding-wizard.component";
import { ClrDatagridColumn } from "@clr/angular";
import { toArray } from "rxjs/operators";
import { VcdQueryService } from "../common/services/VcdQueryService";

@Component({
	selector: "manage-customers",
	templateUrl: "./manage-customers.component.html",
	host: { class: "content-container" },
	styleUrls: ["manage-customers.component.scss"]
})
export class ManageCustomersComponent implements OnInit, OnDestroy, AfterViewInit {
	@ViewChild("onboardingWizard", { static: true }) onboardingWizard: CustomerOnboardingWizard;
	@ViewChildren(ClrDatagridColumn) columns: QueryList<ClrDatagridColumn>;

	public formConfiguration: FormConfiguration = {};
	intervalHandle: any;
	isLoading: boolean = false;

	public customers: Organization[];

	public paging = {
		total: 0,
		pageSize: 25,
		currentPage: 1,
		lastPage: 1,
		displayPages: [1]
	};

	public showRemoveModal: boolean = false;
	public selectedCustomer: OrganizationReference = null;

	public constructor(
		private onboardingService: OnboardingService,
		private readonly notificationService: NotificationsService,
		private readonly vcdQueryService: VcdQueryService
	) {}

	private loadCustomersList() {
		this.isLoading = true;

		this.vcdQueryService
			.getAll<Organization>("organization")
			.pipe(toArray())
			.subscribe(organizations => {
				this.customers = organizations;
			})
			.add(() => {
				this.isLoading = false;
			});
	}

	public ngOnInit() {
		this.selectedCustomer = null;
	}

	ngAfterViewInit(): void {
		this.loadCustomersList();
		this.startMessagePoll();

		this.onboardingService
			.getOnboardingFormConfiguration()
			.then((configuration: FormConfiguration) => {
				this.formConfiguration = configuration;
			})
			.catch(error => {
				alert(error);
			});
	}

	public ngOnDestroy() {
		clearInterval(this.intervalHandle);
	}

	public onboardNewCustomer() {
		this.onboardingWizard.open();
	}

	public deleteCustomer() {
		this.selectedCustomer.isSecondDaySelected = true;
		this.showRemoveModal = false;
		this.onboardingService.offboardCustomer(this.selectedCustomer.id);
	}

	public onRefreshClick() {
		this.loadCustomersList();
	}

	private startMessagePoll() {
		this.intervalHandle = setInterval(() => {
			this.fetchBehaviourSubjects();
		}, 10 * 1000);
	}

	private fetchBehaviourSubjects(): void {
		this.onboardingService.pickMessages().subscribe(data => {
			data.forEach(m => {
				if (m.type === "info") {
					this.notificationService.publishMessage(m.text);
				} else {
					this.notificationService.publishError(m.text);
				}
			});
		});
	}
}
