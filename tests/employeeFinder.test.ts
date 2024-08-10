import { employeeFinder } from "@/lib/common";
import { Employee } from "@/model/employee";
import { expect, test } from "vitest";

const employees: Employee[] = [
    { id: 1, name: "John Doe", designation: "Software Engineer", team: "Engineering", managerId: null },
    {
        id: 2,
        name: "Jane Smith",
        designation: "Product Manager",
        team: "Product Management",
        managerId: null,
    },
    { id: 3, name: "Alice Johnson", designation: "QA Engineer", team: "Quality Assurance", managerId: 2 },
];


test("Finding an Employee by ID", () => {
    const idToFind = 2;
    const result = employeeFinder({ employees, id: idToFind });

    expect(result).toEqual({
        id: 2,
        name: "Jane Smith",
        designation: "Product Manager",
        team: "Product Management",
        managerId: null,
    });
});

test("Finding an Employee by ID Not Present", () => {
    const idToFind = 4;
    const result = employeeFinder({ employees, id: idToFind });
    expect(result).toBeUndefined();
});

test("Finding an Employee by ID with Manager", () => {
    const idToFind = 3;

    const result = employeeFinder({ employees, id: idToFind });

    expect(result).toEqual({
        id: 3,
        name: "Alice Johnson",
        designation: "QA Engineer",
        team: "Quality Assurance",
        managerId: 2,
    });
});
