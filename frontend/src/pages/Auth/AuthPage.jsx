import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LoginForm from "@/components/auth/LoginForm";
import AdminRegisterForm from "@/components/auth/AdminRegisterForm";

const AuthPage = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleError = (message) => {
        setError(message);
        setSuccess("");
    };

    const handleSuccess = (message) => {
        setSuccess(message);
        setError("");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
            <Tabs defaultValue="login" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register Admin</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Login</CardTitle>
                            <CardDescription>
                                Enter your credentials to access the admin dashboard.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LoginForm onError={handleError} />
                            {error && (
                                <Alert variant="destructive" className="mt-4">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="register">
                    <Card>
                        <CardHeader>
                            <CardTitle>Admin Registration</CardTitle>
                            <CardDescription>
                                Create a new administrator account. For authorized use only.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AdminRegisterForm onError={handleError} onSuccess={handleSuccess} />
                            {error && (
                                <Alert variant="destructive" className="mt-4">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            {success && (
                                <Alert className="mt-4">
                                    <AlertDescription>{success}</AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AuthPage; 