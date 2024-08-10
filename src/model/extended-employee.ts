import { Employee } from "./employee";

export interface ExtendedEmployee extends Employee {
    reporters: Employee[] | null;
    depth: number;
}
