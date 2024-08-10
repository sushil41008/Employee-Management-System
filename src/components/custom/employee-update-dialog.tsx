import { isEmployeeUnderManager } from "@/lib/common";
import { cn } from "@/lib/utils";
import { Employee } from "@/model/employee";
import { Pencil } from "lucide-react";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "../ui/use-toast";

function EmployeeUpdateDialog({
    employees,
    employee,
    setEmployees,
    setHoverCardOpen,
}: {
    employees: Employee[];
    employee: Employee;
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
    setHoverCardOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [updateEmployeeModalOpen, setUpdateEmployeeModalOpen] = React.useState<boolean>(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<Employee>();

    React.useEffect(() => {
        if (!updateEmployeeModalOpen) {
            setHoverCardOpen(false);
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateEmployeeModalOpen]);

    const { toast } = useToast();

    const handleUpdateEmployee = async (newEmployee: Employee) => {
        newEmployee.id = employee.id;
        if (!newEmployee.managerId) {
            newEmployee.managerId = employee.managerId;
        }
        if (newEmployee.managerId === -1) {
            newEmployee.managerId = null;
        }
        if (
            employee.name === newEmployee.name &&
            employee.designation === newEmployee.designation &&
            employee.team === newEmployee.team &&
            employee.managerId === newEmployee.managerId
        ) {
            setUpdateEmployeeModalOpen(false);
            return;
        }
        const response = await fetch(import.meta.env.VITE_BASE_URL + "/api/employee/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newEmployee),
        });
        const updatedEmployee = await response.json();
        if (!updatedEmployee || updatedEmployee.error) {
            toast({ title: "Error ❌", description: "Failed to update employee", variant: "destructive" });
            setUpdateEmployeeModalOpen(false);
            return;
        }
        const updatedEmployees = employees.map((emp) =>
            emp.id === updatedEmployee.id ? updatedEmployee : emp
        );
        setEmployees(updatedEmployees);
        setUpdateEmployeeModalOpen(false);
        toast({
            title: "Success ✅",
            description: "Employee information has been updated successfully",
        });
    };
    const onSubmit: SubmitHandler<Employee> = (data) => handleUpdateEmployee(data);

    return (
        <Dialog open={updateEmployeeModalOpen} onOpenChange={(open) => setUpdateEmployeeModalOpen(open)}>
            <DialogTrigger asChild>
                <Button variant='ghost' size='icon' className='ml-auto hidden h-4 w-4 group-hover:block'>
                    <Pencil className='h-4 w-4' />
                    <span className='sr-only'>Update Employee</span>
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Update Employee</DialogTitle>
                    <DialogDescription>
                        Fill in the details below to update the employee information
                    </DialogDescription>
                </DialogHeader>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit(onSubmit)} id='updateEmployee'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='name' className='text-left'>
                            Name
                        </Label>
                        <Input
                            id='name'
                            defaultValue={employee.name}
                            placeholder={employee.name}
                            className={cn("col-span-3", errors.name ? "border-red-400" : "")}
                            {...register("name", { required: true })}
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='designation' className='text-left'>
                            Designation
                        </Label>
                        <Input
                            id='desingation'
                            defaultValue={employee.designation}
                            placeholder={employee.designation}
                            className={cn("col-span-3", errors.designation ? "border-red-400" : "")}
                            {...register("designation", { required: true })}
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='team' className='text-left'>
                            Team
                        </Label>
                        <Input
                            id='team'
                            defaultValue={employee.team}
                            placeholder={employee.team}
                            className={cn("col-span-3", errors.team ? "border-red-400" : "")}
                            {...register("team", { required: true })}
                        />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='manager' className='text-left'>
                            Manager
                        </Label>
                        <Controller
                            name='managerId'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(value) => field.onChange(Number(value))}
                                    defaultValue={employee.managerId?.toString()}
                                    value={field.value?.toString()}>
                                    <SelectTrigger id='managerId' className='col-span-3'>
                                        <SelectValue placeholder='Select Employee' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={"-1"}>None</SelectItem>
                                        {employees.map((e) => {
                                            if (
                                                isEmployeeUnderManager({
                                                    employees,
                                                    employeeId: e.id,
                                                    managerId: employee.id,
                                                })
                                            )
                                                return null;
                                            if (e.id === employee.id) return null;
                                            return (
                                                <SelectItem key={e.id} value={e.id.toString()}>
                                                    {e.name}
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    {Object.keys(errors).length > 1 && (
                        <p className='mt-3 text-center text-xs text-red-500'>
                            * Please fill in all the required fields
                        </p>
                    )}
                </form>
                <DialogFooter>
                    <Button type='submit' form='updateEmployee'>
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default EmployeeUpdateDialog;
