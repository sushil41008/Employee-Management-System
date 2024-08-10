import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { employeeFinder } from "@/lib/common";
import { Employee } from "@/model/employee";
import { BriefcaseBusiness, CircleUser, Component, FileBadge2, Fingerprint } from "lucide-react";
import React from "react";

import EmployeeUpdateDialog from "./employee-update-dialog";

function EmployeeHoverCard({
    employees,
    employee,
    setEmployees,
}: {
    employees: Employee[];
    employee: Employee;
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}) {
    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <HoverCard open={open}>
            <HoverCardTrigger asChild>
                <p
                    className='group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary'
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}>
                    <CircleUser className='h-4 w-4' />
                    {employee.name}
                    <EmployeeUpdateDialog
                        employee={employee}
                        employees={employees}
                        setEmployees={setEmployees}
                        setHoverCardOpen={setOpen}
                    />
                </p>
            </HoverCardTrigger>
            <HoverCardContent className='w-80' side='right' sideOffset={20}>
                <div className='flex justify-between space-x-4'>
                    <div className='space-y-1'>
                        <h4 className='text-sm font-semibold'>{employee.name}</h4>
                        <div className='flex items-center pt-2'>
                            <Fingerprint className='mr-2 h-4 w-4 opacity-70' />{" "}
                            <span className='text-muted-foreground'>Emp Id: {employee.id}</span>
                        </div>

                        <div className='flex items-center pt-2'>
                            <BriefcaseBusiness className='mr-2 h-4 w-4 opacity-70' />{" "}
                            <span className='text-muted-foreground'>Designation: {employee.designation}</span>
                        </div>

                        <div className='flex items-center pt-2'>
                            <Component className='mr-2 h-4 w-4 opacity-70' />{" "}
                            <span className='text-muted-foreground'>Team: {employee.team}</span>
                        </div>

                        {employee.managerId && (
                            <div className='flex items-center pt-2'>
                                <FileBadge2 className='mr-2 h-4 w-4 opacity-70' />{" "}
                                <span className='text-muted-foreground'>
                                    Reporting Manager :{" "}
                                    {
                                        employeeFinder({
                                            employees,
                                            id: employee.managerId,
                                        })?.name
                                    }
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

export { EmployeeHoverCard };
