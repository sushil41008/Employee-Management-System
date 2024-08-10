import { cn } from "@/lib/utils";
import { Employee } from "@/model/employee";
import { Plus } from "lucide-react";
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

function EmployeeCreateDialog({
    employees,
    setEmployees,
}: {
    employees: Employee[];
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
}) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<Employee>();

    const [addEmployeeModalOpen, setAddEmployeeModalOpen] = React.useState<boolean>(false);
    const { toast } = useToast();

    React.useEffect(() => {
        if (!addEmployeeModalOpen) {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addEmployeeModalOpen]);

    const handleAddEmployee = async (newEmployee: Employee) => {
        const response = await fetch(import.meta.env.VITE_BASE_URL + "/api/employee/new", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newEmployee),
        });
        const data = await response.json();
        if (data) {
            const updatedEmployees = [...employees, data];
            toast({
                title: "Success ✅",
                description: `Employee "${data.name}" has been added`,
            });
            setEmployees(updatedEmployees);
            setAddEmployeeModalOpen(false);
        } else {
            toast({ title: "Error ❌", description: "Failed to add employee" });
        }
    };

    const onSubmit: SubmitHandler<Employee> = (data) => handleAddEmployee(data);

    return (
        <Dialog open={addEmployeeModalOpen} onOpenChange={(open) => setAddEmployeeModalOpen(open)}>
            <DialogTrigger asChild>
                <Button variant='outline' size='icon' className='ml-auto h-10 w-10'>
                    <Plus className='h-4 w-4' />
                    <span className='sr-only'>Create Employee</span>
                </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Create Employee</DialogTitle>
                    <DialogDescription>Fill in the details below to create a new employee</DialogDescription>
                </DialogHeader>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit(onSubmit)} id='createEmployee'>
                    <div className='grid grid-cols-4 items-center gap-4'>
                        <Label htmlFor='name' className='text-left'>
                            Name
                        </Label>
                        <Input
                            id='name'
                            placeholder='RobinHood'
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
                            placeholder='Software Developer'
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
                            placeholder='Engineering'
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
                                    defaultValue={field.value?.toString()}
                                    value={field.value?.toString()}>
                                    <SelectTrigger id='managerId' className='col-span-3'>
                                        <SelectValue placeholder='Select Employee' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((employee) => (
                                            <SelectItem key={employee.id} value={employee.id.toString()}>
                                                {employee.name}
                                            </SelectItem>
                                        ))}
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
                    <Button type='submit' form='createEmployee'>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default EmployeeCreateDialog;
