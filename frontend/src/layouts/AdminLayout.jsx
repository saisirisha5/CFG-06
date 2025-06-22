import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home, Users, BarChart3, Settings, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import React from 'react';

const AdminLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <TooltipProvider>
            <div className="flex min-h-screen w-full overflow-hidden">
                <aside className={`flex flex-col border-r bg-background transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
                    <div className="flex h-16 items-center border-b px-4 lg:px-6 justify-between">
                        {!isSidebarCollapsed && (
                            <Link to="/" className="flex items-center gap-2 font-semibold">
                                <span className="">Admin Panel</span>
                            </Link>
                        )}
                        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-muted">
                            {isSidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                        </button>
                    </div>
                    <nav className="flex-1 overflow-y-auto py-4">
                        <ul className="space-y-2">
                            <li><NavItem icon={Home} label="Dashboard" to="/dashboard" isCollapsed={isSidebarCollapsed} /></li>
                            <li><NavItem icon={Plus} label="Sessions" to="/admin/sessions" isCollapsed={isSidebarCollapsed} /></li>
                            <li><NavItem icon={Users} label="Counsellors" to="/counsellors" isCollapsed={isSidebarCollapsed} /></li>
                            <li><NavItem icon={BarChart3} label="Analytics" to="/analytics" isCollapsed={isSidebarCollapsed} /></li>
                        </ul>
                    </nav>
                    <div className="mt-auto border-t p-4">
                        <NavItem icon={Settings} label="Settings" to="/settings" isCollapsed={isSidebarCollapsed} />
                    </div>
                </aside>

                <div className="flex flex-col flex-1 min-w-0">
                    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:px-6">
                        {/* Header content can go here, e.g., user menu, search bar */}
                        <div className="w-full flex-1">
                            <h1 className="text-lg font-semibold">Dashboard</h1>
                        </div>
                    </header>
                    <main className="flex-1 p-4 lg:p-6 overflow-auto">
                        <Outlet />
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
};

const NavItem = ({ icon, label, to, isCollapsed }) => {
    const content = (
        <Link to={to} className="flex items-center gap-4 rounded-lg px-4 py-2 text-muted-foreground transition-colors hover:text-foreground">
            {React.createElement(icon, { className: "h-5 w-5" })}
            {!isCollapsed && <span className="truncate">{label}</span>}
        </Link>
    );

    if (isCollapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    {content}
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        );
    }

    return content;
};


export default AdminLayout; 