import { isEmployeeUnderManagerInList } from '@/lib/common';
import { Employee } from '@/model/employee';
import { expect, test } from 'vitest';

const employees: Employee[] = [
  { id: 1, name: "John Doe", designation: "Software Engineer", team: "Engineering", managerId: 2 },
  { id: 2, name: "Jane Smith", designation: "Product Manager", team: "Product Management", managerId: 4 },
  { id: 3, name: "Alice Johnson", designation: "QA Engineer", team: "Quality Assurance", managerId: null },
];

test('Employee is directly under a manager in the list', () => {
  const employeeId = 1;
  const result = isEmployeeUnderManagerInList({ employees, employeeId });
  expect(result).toBe(true);
});

test('Employee is not directly under a manager in the list', () => {
  const employeeId = 2;
  const result = isEmployeeUnderManagerInList({ employees, employeeId });
  expect(result).toBe(false);
});

test('Employee ID not found in the list', () => {
  const employeeId = 4; // Employee ID not present in the list
  const result = isEmployeeUnderManagerInList({ employees, employeeId });
  expect(result).toBe(false);
});