/*-
 * #%L
 * actions
 * %%
 * Copyright (C) 2023 TODO: Enter Organization name
 * %%
 * TODO: Define header text
 * #L%
 */
describe("sample", function() {
    var sample = System.getModule("com.vmware.pscoe.templates.buildtoolsforvmwareariasamples.actions").sample;
    it("should add two numbers", function() {
        expect(sample(5, 2)).toBe(7);
    });
});
