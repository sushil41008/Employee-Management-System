import { calculateDepthOfEmployee } from "@/lib/common";
import { Employee } from "@/model/employee";
import { expect, test } from "vitest";

const employees: Employee[] = [
    { id: 1, name: "John Doe", designation: "Manager", team: "Management", managerId: null },
    { id: 8, name: "Jessica Garcia", designation: "Team Lead", team: "Sales", managerId: 1 },
    { id: 10, name: "Emma Rodriguez", designation: "Sales Representative", team: "Sales", managerId: 8 },
];
test("Calculate depth of employee with direct manager", () => {
    const employeeId = 1;

    const result = calculateDepthOfEmployee({ employees, employeeId });

    expect(result).toBe(1); // Employee with ID 1 has a direct manager
});

test("Calculate depth of employee with indirect manager", () => {
    const employeeId = 10;

    const result = calculateDepthOfEmployee({ employees, employeeId });

    expect(result).toBe(3);
});
