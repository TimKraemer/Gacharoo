import { describe, expect, it } from "bun:test"

describe("toolchain smoke", () => {
	it("runs tests", () => {
		expect(1 + 1).toBe(2)
	})
})
