import { Input } from "@/components/ui/input";
import { Employee } from "@/model/employee";
import { Building, Github, ListFilter, Search } from "lucide-react";
import React from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import EmployeeCreateDialog from "./components/custom/employee-create-dialog";
import { EmployeeHoverCard } from "./components/custom/employee-hover-card";
import EmployeeTree from "./components/custom/employee-tree";
import { Button } from "./components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { DraggableContext } from "./hooks/draggable-provider";

const App: React.FC = () => {
    const [fetching, setFetching] = React.useState<boolean>(false);
    const [employees, setEmployees] = React.useState<Employee[]>([]);
    const [filteredTeam, setFilteredTeam] = React.useState<string[]>([]);
    const [search, setSearch] = React.useState<string>("");
    const { dragging } = React.useContext(DraggableContext);

    const filteringTeam = (team: string) => {
        if (filteredTeam.includes(team)) {
            setFilteredTeam(filteredTeam.filter((t) => t !== team));
        } else {
            setFilteredTeam([...filteredTeam, team]);
        }
    };

    const resetData = async () => {
        const response = await fetch(import.meta.env.VITE_BASE_URL + "/api/employees/reset");
        const data = await response.json();
        setEmployees(data);
        const teams = data.map((employee: Employee) => employee.team);
        setFilteredTeam(teams);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            setFetching(true);
            const response = await fetch(import.meta.env.VITE_BASE_URL + "/api/employees");
            const data = await response.json();
            setEmployees(data);
            const teams = data.map((employee: Employee) => employee.team);
            setFilteredTeam(teams);
            setFetching(false);
        };
        fetchData();
    }, []);

    React.useEffect(() => {
        const teams = employees.map((employee) => employee.team);
        setFilteredTeam(teams);
    }, [employees]);

    return (
        <div className='grid min-h-screen w-full grid-cols-[300px_1fr] lg:grid-cols-[350px_1fr]'>
            <div className='border-r bg-muted/40 md:block'>
                <div className='flex h-full max-h-screen flex-col gap-2'>
                    <div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
                        <a href='/' className='flex items-center gap-2 font-semibold'>
                            <Building className='h-6 w-6' />
                            <span className=''>OMS</span>
                        </a>
                    </div>
                    <div className='flex-1'>
                        <nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
                            <div className='relative my-2 flex w-full items-center gap-2'>
                                <Search className='absolute left-2.5 top-3 h-4 w-4 text-muted-foreground' />
                                <Input
                                    type='search'
                                    placeholder='Search employees...'
                                    className='w-full appearance-none bg-background pl-8 shadow-none'
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <EmployeeCreateDialog employees={employees} setEmployees={setEmployees} />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='outline' size='sm' className='mb-2 h-8 gap-1'>
                                        <ListFilter className='h-3.5 w-3.5' />
                                        <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
                                            Filter by Team
                                        </span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align='center' className='w-80'>
                                    {employees
                                        .map((employee) => employee.team)
                                        .filter((team, index, self) => self.indexOf(team) === index)
                                        .map((team) => (
                                            <DropdownMenuCheckboxItem
                                                key={team}
                                                onClick={() => filteringTeam(team)}
                                                checked={filteredTeam.includes(team)}>
                                                <DropdownMenuLabel>{team}</DropdownMenuLabel>
                                            </DropdownMenuCheckboxItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {fetching ? (
                                <div className='mt-2 flex flex-col items-center gap-1 text-center'>
                                    <p className='text-sm text-muted-foreground'>
                                        Fetching employees... <br /> Please wait
                                    </p>
                                </div>
                            ) : employees.length > 0 ? (
                                employees.map((employee) => {
                                    if (filteredTeam.includes(employee.team)) {
                                        if (
                                            employee.name.toLowerCase().includes(search.toLowerCase()) ||
                                            employee.team.toLowerCase().includes(search.toLowerCase())
                                        ) {
                                            return (
                                                <EmployeeHoverCard
                                                    key={employee.id}
                                                    employee={employee}
                                                    employees={employees}
                                                    setEmployees={setEmployees}
                                                />
                                            );
                                        }
                                    }
                                })
                            ) : (
                                <div className='mt-4 flex flex-col items-center gap-1 text-center'>
                                    <p className='text-sm text-muted-foreground'>
                                        No employees found. <br /> Please add employees to your organization
                                    </p>
                                </div>
                            )}
                            {employees.length > 0 && filteredTeam.length === 0 && !fetching && (
                                <div className='mt-2 flex flex-col items-center gap-1 text-center'>
                                    <p className='text-sm text-muted-foreground'>
                                        Please select a team to view employees
                                    </p>
                                </div>
                            )}
                        </nav>
                    </div>
                </div>
            </div>
            <div className='flex flex-col'>
                <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
                    <div className='flex items-center justify-between'>
                        <h1 className='text-lg font-semibold md:text-2xl'>Employee Org Chart</h1>
                        <div className='flex gap-5'>
                            <Button variant='outline' className='ml-auto' onClick={resetData}>
                                Reset
                            </Button>
                            <Button
                                variant='outline'
                                size='icon'
                                className='ml-auto h-10 w-10'
                                onClick={() =>
                                    window.open("https://github.com/The-Robin-Hood/oms", "_blank")
                                }>
                                <Github className='h-4 w-4' />
                                <span className='sr-only'>Create Employee</span>
                            </Button>
                        </div>
                    </div>
                    <div className='flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm'>
                        <TransformWrapper
                            smooth
                            limitToBounds={false}
                            maxScale={2}
                            minScale={0.5}
                            initialPositionX={50}
                            initialPositionY={100}
                            disabled={dragging}>
                            <TransformComponent contentClass='w-full' wrapperClass='!w-full !h-full'>
                                <div className='flex flex-col items-center gap-1 text-center'>
                                    <EmployeeTree
                                        setEmployees={setEmployees}
                                        employees={
                                            filteredTeam.length > 0
                                                ? employees.filter((emp) => filteredTeam.includes(emp.team))
                                                : employees
                                        }
                                    />
                                </div>
                            </TransformComponent>
                        </TransformWrapper>
                    </div>
                </main>
            </div>
        </div>
    );
};
export default App;
