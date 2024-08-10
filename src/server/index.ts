import { Employee } from "@/model/employee";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
// allow all origins
app.use(
    "/*",
    cors({
        origin: "*",
    })
);

const employees: Employee[] = [
    { id: 1, name: "John Doe", designation: "Manager", team: "Management", managerId: null },
    { id: 2, name: "Alice Smith", designation: "Team Lead", team: "Development", managerId: 1 },
    { id: 3, name: "Bob Johnson", designation: "Developer", team: "Development", managerId: 2 },
    { id: 4, name: "Sarah Brown", designation: "Developer", team: "Development", managerId: 2 },
    { id: 5, name: "Emily Davis", designation: "Team Lead", team: "Marketing", managerId: 1 },
    { id: 6, name: "Michael Wilson", designation: "Marketing Specialist", team: "Marketing", managerId: 5 },
    { id: 7, name: "Chris Lee", designation: "Marketing Specialist", team: "Marketing", managerId: 5 },
    { id: 8, name: "Jessica Garcia", designation: "Team Lead", team: "Sales", managerId: 1 },
    { id: 9, name: "David Martinez", designation: "Sales Representative", team: "Sales", managerId: 8 },
    { id: 10, name: "Emma Rodriguez", designation: "Sales Representative", team: "Sales", managerId: 8 },
];

const copyEmployees = [...employees];

// fetches all employees
app.get("/api/employees", (cxt) => {
    return cxt.json(employees);
});

// create a new employee
app.post("/api/employee/new", async (cxt) => {
    const newEmployee: Employee = await cxt.req.json();
    newEmployee.id = employees.length + 1;
    if (newEmployee.managerId === undefined) {
        newEmployee.managerId = null;
    }
    employees.push(newEmployee);
    return cxt.json(newEmployee);
});

// update an employee
app.post("/api/employee/update", async (cxt) => {
    const updatedEmployee: Employee = await cxt.req.json();
    const index = employees.findIndex((employee) => employee.id === updatedEmployee.id);
    if (index !== -1) {
        employees[index] = updatedEmployee;
        return cxt.json(updatedEmployee);
    } else {
        return cxt.json({ error: "Employee not found" }, 404);
    }
});

// reset all employees to original data
app.get("/api/employees/reset", (cxt) => {
    employees.splice(0, employees.length, ...copyEmployees);
    return cxt.json(employees);
});

export default app;
