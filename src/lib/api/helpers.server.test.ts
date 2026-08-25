import { describe, expect, it } from "vitest";
import { getPagination, methodNotAllowed, requireLeadAccess } from "./helpers.server";
import type { AuthedUser } from "./helpers.server";
import type { createServiceClient } from "../supabase.server";

const employee: AuthedUser = {
  userId: "employee-id",
  profileId: "profile-id",
  role: "employee",
  fullName: "Test Mitarbeiter",
  email: "test@example.de",
};

function fakeClient(assignedTo: string | null) {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: { id: "lead-id", assigned_to: assignedTo }, error: null }),
        }),
      }),
    }),
  } as unknown as ReturnType<typeof createServiceClient>;
}

describe("getPagination", () => {
  it("falls back for invalid query values", () => {
    expect(getPagination(new Request("https://example.de/api?page=x&pageSize=none"), 25)).toEqual({
      page: 1,
      pageSize: 25,
      from: 0,
      to: 24,
    });
  });
});

describe("methodNotAllowed", () => {
  it("returns a JSON 405 response with an Allow header", async () => {
    const response = methodNotAllowed(["POST"]);
    expect(response.status).toBe(405);
    expect(response.headers.get("Allow")).toBe("POST");
    await expect(response.json()).resolves.toEqual({ error: "Method Not Allowed" });
  });
});

describe("requireLeadAccess", () => {
  it("allows an assigned employee", async () => {
    expect(await requireLeadAccess(fakeClient(employee.userId), employee, "lead-id")).toEqual({
      ok: true,
    });
  });

  it("blocks an employee assigned to another lead", async () => {
    const result = await requireLeadAccess(fakeClient("other-id"), employee, "lead-id");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.response.status).toBe(403);
  });
});
