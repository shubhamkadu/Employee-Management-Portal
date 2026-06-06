import { describe, it, expect, vi } from "vitest";
import { formatDate, isValidEmail, debounce } from "./helpers";

describe("helpers utility", () => {
  describe("formatDate", () => {
    it("should format a date string correctly", () => {
      const date = "2023-12-25";
      expect(formatDate(date)).toBe("Dec 25, 2023");
    });
  });

  describe("isValidEmail", () => {
    it("should return true for valid emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name+label@domain.co.uk")).toBe(true);
    });

    it("should return false for invalid emails", () => {
      expect(isValidEmail("plainaddress")).toBe(false);
      expect(isValidEmail("@missingusername.com")).toBe(false);
      expect(isValidEmail("username@.com")).toBe(false);
    });
  });

  describe("debounce", () => {
    it("should only call the function once after the specified wait time", () => {
      vi.useFakeTimers();
      const func = vi.fn();
      const debouncedFunc = debounce(func, 100);

      debouncedFunc();
      debouncedFunc();
      debouncedFunc();

      expect(func).not.toBeCalled();

      vi.runAllTimers();
      expect(func).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });
  });
});
