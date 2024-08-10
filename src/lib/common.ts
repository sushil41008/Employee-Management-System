import { Employee } from "@/model/employee";
import { ExtendedEmployee } from "@/model/extended-employee";

function employeeFinder({ employees, id }: { employees: Employee[]; id: number }) {
    return employees.find((employee) => employee.id === id);
}

// function to check if an employee is under a manager (max depth) - to check for circular references
function isEmployeeUnderManager({
    employees,
    employeeId,
    managerId,
}: {
    employees: Employee[];
    employeeId: number;
    managerId: number;
}) {
    let employee = employeeFinder({ employees, id: employeeId });
    while (employee) {
        if (employee.managerId === managerId) {
            return true;
        }
        employee = employeeFinder({ employees, id: employee.managerId! });
    }
    return false;
}

// function to check if an employee is under any manager in a list
function isEmployeeUnderManagerInList({
    employees,
    employeeId,
}: {
    employees: Employee[];
    employeeId: number;
}) {
    const employee = employeeFinder({ employees, id: employeeId });
    if (!employee) {
        return false;
    }
    const managerIds = employees.map((emp) => emp.id);
    if (managerIds.includes(employee!.managerId!)) {
        return true;
    }
    return false;
}

// function to calculate depth of an employee
function calculateDepthOfEmployee({ employees, employeeId }: { employees: Employee[]; employeeId: number }) {
    let employee = employeeFinder({ employees, id: employeeId });
    let depth = 0;
    while (employee) {
        depth++;
        employee = employeeFinder({ employees, id: employee.managerId! });
    }
    return depth;
}

function employeeToExtendedEmployee(employees: Employee[]) {
    return employees.map(
        (employee): ExtendedEmployee => ({
            id: employee.id,
            name: employee.name,
            team: employee.team,
            designation: employee.designation,
            managerId: employee.managerId,
            reporters: employees.filter((emp) => emp.managerId === employee.id),
            depth: calculateDepthOfEmployee({ employees, employeeId: employee.id }),
        })
    );
}

export {
    employeeFinder,
    isEmployeeUnderManager,
    isEmployeeUnderManagerInList,
    calculateDepthOfEmployee,
    employeeToExtendedEmployee,
};
