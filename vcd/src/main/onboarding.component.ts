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
import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { NotificationsService } from "./common/services/NotificationsService";
import { OnboardingService } from "./common/services/OnboardingService";
import { Message } from "./models/onboarding";

@Component({
    selector: "onboarding",
    templateUrl: "./onboarding.component.html",
    host: { "class": "content-container" },
    styleUrls: ["onboarding.component.scss"]
})
export class OnboardingComponent implements OnInit {

    private loading: boolean = true;
    private noVroService = false;
    private messages: Message[] = [];
    private notificationsSubscription: Subscription;

    public constructor(onboardingService: OnboardingService, notificationService: NotificationsService) {
        this.notificationsSubscription = notificationService.subscribe((message: Message) => this.onMessageReceived(message));

        onboardingService.checkVroService().then((isOnline) => {
            this.loading = false;
            if (!isOnline) {
                this.noVroService = true;
                this.messages.push({
                    text: "Cannot enable the extensibility module! vRO service is not reachable!",
                    level: "danger",
                    isAppLevel: true,
                    dismissible: false
                });
            }
        });
    }

    public ngOnInit() { }

    public onMessageReceived(message: Message) {
        if (message.level === "info" || message.level === "success") {
            setTimeout(() => {
                message.dismissed = true;
            }, 5000);
        }

        this.messages.push(message);
    }

    public ngOnDestroy() {
        this.messages.forEach(m => m.dismissed = true)
        this.notificationsSubscription.unsubscribe();
    }

}
