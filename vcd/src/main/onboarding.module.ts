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
import { CommonModule } from "@angular/common";
import { Inject, NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { EXTENSION_ROUTE, ExtensionNavRegistration } from "@vcd/sdk/common";
import { VcdApiClient, VcdSdkModule } from "@vcd/sdk";
import { PluginModule } from "@vcd/sdk/core";
import { TranslateService } from "@vcd/sdk/i18n";
import { ClarityModule } from "@clr/angular";
import { OnboardingComponent } from "./onboarding.component";
import { OnboardingService } from "./common/services/OnboardingService";
import { MessageComponent } from "./common/message/message.component";
import { NotificationsService } from "./common/services/NotificationsService";
import { CustomerOnboardingWizard } from "./customers/customer-onboarding-wizard.component";
import { ManageCustomersComponent } from "./customers/manage-customers.component";
import { ConfigInput } from "./common/form/config-input.component";
import { VcdQueryService } from "./common/services/VcdQueryService";
import { OrgCreateWizardExtensionPointComponent } from "./customers/org.create.wizard.action.component";

const ROUTES: Routes = [
    { path: "", component: OnboardingComponent, children: [
        { path: "", redirectTo: "list", pathMatch: "full" },
        { path: "list", component: ManageCustomersComponent },
        { path: "onboard-new-customer", component: CustomerOnboardingWizard },
        { path: "vdc-form", component: OrgCreateWizardExtensionPointComponent },
    ] },
];

@NgModule({
    imports: [
        ClarityModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        VcdSdkModule,
        RouterModule.forChild(ROUTES),
        ReactiveFormsModule
    ],
    declarations: [
        MessageComponent,
        OnboardingComponent,
        ConfigInput,
        CustomerOnboardingWizard,
        ManageCustomersComponent,
        OrgCreateWizardExtensionPointComponent
    ],
    bootstrap: [OnboardingComponent],
    entryComponents: [
    ],
    exports: [],
    providers: [
        VcdApiClient,
        VcdQueryService,
        OnboardingService,
        NotificationsService,
    ],
})
export class OnboardingModule extends PluginModule {
    constructor(appStore: Store<any>, @Inject(EXTENSION_ROUTE) extensionRoute: string, translate: TranslateService) {
        super(appStore, translate);

        let registrations: ExtensionNavRegistration[] = [
            {
                path: `${extensionRoute}`,
                nameCode: "pscoe.ri.onboarding.nav.onboarding-module-name",
                descriptionCode: "pscoe.ri.onboarding.nav.onboarding-module-description"
            },

        ];

        registrations.forEach(registration => this.registerExtension(registration));
    }
}
