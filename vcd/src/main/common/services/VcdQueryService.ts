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
import { Query, VcdApiClient } from "@vcd/sdk";
import { Observable, Subscriber } from "rxjs";
import { QueryResultRecordsType } from "@vcd/bindings/vcloud/api/rest/schema_v1_5";

export interface VcdQueryOptions {
	filter?: string;
	page?: number;
	pageSize?: number;
	format?: "references" | "records" | "idrecords";
	multisite?: boolean;
}

@Injectable()
export class VcdQueryService {
	constructor(private apiClient: VcdApiClient) {}

	getAll<T>(type: string, options?: VcdQueryOptions): Observable<T> {
		options = options || {};
		return new Observable<T>(observer => {
			let queryBuilder = Query.Builder.ofType(type)
				.format(options.format || "idrecords")
				.pageSize(options.pageSize || 128);

			if (options.filter) {
				queryBuilder.filter(options.filter);
			}

			this.queryFirst(observer, queryBuilder, options.multisite);
		});
	}

	private queryFirst<T>(
		observer: Subscriber<T>,
		queryBuilder: Query.Builder,
		multisite: boolean
	): void {
		this.apiClient.query(queryBuilder, multisite).subscribe(queryRecords => {
			this.pushRecords(observer, queryRecords);
			this.queryNext(observer, multisite, queryRecords);
		});
	}

	private queryNext<T>(
		observer: Subscriber<T>,
		multisite: boolean,
		prev: QueryResultRecordsType
	): void {
		if (this.apiClient.hasNextPage(prev)) {
			this.apiClient.nextPage(prev, multisite).subscribe(queryRecords => {
				this.pushRecords(observer, queryRecords);
				this.queryNext(observer, multisite, queryRecords);
			});
		} else {
			observer.complete();
		}
	}

	private pushRecords<T>(observer: Subscriber<T>, queryRecords: QueryResultRecordsType) {
		const items = queryRecords.record || queryRecords["reference"] || [];
		items.forEach(rec => observer.next(<T>rec));
	}
}
