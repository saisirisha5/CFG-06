import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CounsellorRegisterPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        address: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        console.log("Submitting counsellor registration with data:", formData);

        try {
            const response = await fetch("http://localhost:5000/api/auth/counsellor/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok) {
                setSuccess("Counsellor account created successfully!");
                // Clear form
                setFormData({ email: "", phone: "", address: "", password: "" });
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                // Show the specific error message from the backend
                setError(data.message || `Registration failed (${response.status})`);
                console.error("Registration error:", data);
            }
        } catch (error) {
            console.error("Network error:", error);
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
            <Card className="mx-auto max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl">Counsellor Registration</CardTitle>
                    <CardDescription>
                        Enter your information to create a new counsellor account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="counsellor@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input 
                                id="phone" 
                                type="tel" 
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="address">Full Address</Label>
                            <Input 
                                id="address" 
                                type="text" 
                                placeholder="123 Health St, Wellness City" 
                                value={formData.address}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                type="password" 
                                value={formData.password}
                                onChange={handleChange}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating Account..." : "Create Counsellor Account"}
                        </Button>
                    </form>
                    
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
                    
                    <div className="mt-4 text-center text-sm">
                        <Link to="/" className="underline">
                            Back to Admin Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CounsellorRegisterPage; 