import { describe, it, expect } from "vitest";
import { validateLoginForm } from "./validation";

describe("validation utility", () => {
  describe("validateLoginForm", () => {
    it("should return an empty array for valid credentials", () => {
      const credentials = {
        email: "admin@test.com",
        password: "password123",
      };
      const errors = validateLoginForm(credentials);
      expect(errors).toHaveLength(0);
    });

    it("should return error for invalid email format", () => {
      const credentials = {
        email: "invalid-email",
        password: "password123",
      };
      const errors = validateLoginForm(credentials);
      expect(errors).toContainEqual({
        field: "email",
        message: "Please enter a valid email address",
      });
    });

    it("should return error for short password", () => {
      const credentials = {
        email: "admin@test.com",
        password: "123",
      };
      const errors = validateLoginForm(credentials);
      expect(errors).toContainEqual({
        field: "password",
        message: "Password must be at least 6 characters",
      });
    });
  });
});
