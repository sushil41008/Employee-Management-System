import { expect, test } from 'vitest';
import { Employee } from '@/model/employee';
import { isEmployeeUnderManager } from '@/lib/common';


const employees: Employee[] = [
    { id: 1, name: "John Doe", designation: "Manager", team: "Management", managerId: null },
    { id: 2, name: "Alice Smith", designation: "Team Lead", team: "Development", managerId: 1 },
    { id: 3, name: "Bob Johnson", designation: "Developer", team: "Development", managerId: 2 },
    { id: 4, name: "Sarah Brown", designation: "Developer", team: "Development", managerId: 2 },
    { id: 8, name: "Jessica Garcia", designation: "Team Lead", team: "Sales", managerId: 1 },
    { id: 10, name: "Emma Rodriguez", designation: "Sales Representative", team: "Sales", managerId: 8 },
];


test('Employee is directly under manager', () => {
  const employeeId = 2;
  const managerId = 1;

  const result = isEmployeeUnderManager({ employees, employeeId, managerId });

  expect(result).toBe(true);
});

test('Employee is indirectly under manager', () => {
  const employeeId = 8;
  const managerId = 1;

  const result = isEmployeeUnderManager({ employees, employeeId, managerId });

  expect(result).toBe(true);
});

test('Employee is not under manager', () => {
  const employeeId = 10;
  const managerId = 2;

  const result = isEmployeeUnderManager({ employees, employeeId, managerId });

  expect(result).toBe(false);
});
