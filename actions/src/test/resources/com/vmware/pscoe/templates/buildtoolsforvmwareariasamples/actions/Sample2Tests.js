/*-
 * #%L
 * actions
 * %%
 * Copyright (C) 2023 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
describe("sample2", function() {
    var sample2 = System.getModule("com.vmware.pscoe.templates.buildtoolsforvmwareariasamples.actions2").sample2;
    it("should add two numbers", function() {
        expect(sample2(5, 2)).toBe(7);
    });
});
