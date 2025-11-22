import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface SignupForm {
    name: string;
    email: string;
    password: string;
    role: "WAREHOUSE_STAFF" | "INVENTORY_MANAGER";
}

const Signup = () => {
    const [form, setForm] = useState<SignupForm>({
        name: "",
        email: "",
        password: "",
        role: "WAREHOUSE_STAFF",
    });

    const [error, setError] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/user/register", form, {
                withCredentials: true,
            });
            window.location.href = "/login";
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="font-display bg-white text-gray-800 min-h-screen flex">

            {/* LEFT SIDE PANEL */}
            <div className="flex w-full flex-col p-6 lg:w-1/2 lg:p-16">
                <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center">

                    {/* Branding */}
                    <div className="flex items-center gap-3 self-start">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
                            <span className="material-symbols-outlined text-white" style={{ fontSize: 28 }}>
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="w-7 h-7 object-contain"
                                />
                            </span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                            Stock Master
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="mt-8 mb-6">
                        <p className="text-3xl font-bold tracking-tight text-gray-900">Create Account</p>
                        <p className="mt-2 text-base text-gray-500">Register to continue</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-center text-sm mb-3">{error}</p>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium text-gray-700">Full Name</p>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                onChange={handleChange}
                                className="h-12 rounded-lg border border-gray-300 px-4 text-gray-900 
                                    focus:border-green-500 focus:ring-2 focus:ring-green-300"
                                required
                            />
                        </label>

                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium text-gray-700">Email</p>
                            <input
                                type="email"
                                name="email"
                                placeholder="example@gmail.com"
                                onChange={handleChange}
                                className="h-12 rounded-lg border border-gray-300 px-4 text-gray-900 
                                    focus:border-green-500 focus:ring-2 focus:ring-green-300"
                                required
                            />
                        </label>

                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium text-gray-700">Password</p>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                onChange={handleChange}
                                className="h-12 rounded-lg border border-gray-300 px-4 text-gray-900 
                                    focus:border-green-500 focus:ring-2 focus:ring-green-300"
                                required
                            />
                        </label>

                        <label className="flex flex-col">
                            <p className="pb-2 text-sm font-medium text-gray-700">Role</p>
                            <select
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                className="h-12 rounded-lg border border-gray-300 px-4 text-gray-900 
                                    focus:border-green-500 focus:ring-2 focus:ring-green-300"
                            >
                                <option value="WAREHOUSE_STAFF">Warehouse Staff</option>
                                <option value="INVENTORY_MANAGER">Inventory Manager</option>
                            </select>
                        </label>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 
                                rounded-md text-lg font-semibold transition"
                        >
                            Sign Up
                        </button>
                    </form>

                    {/* Login Redirect */}
                    <p className="text-center mt-5 text-sm text-gray-600">
                        Already have an account?{" "}
                        <a href="/login" className="text-green-600 font-medium">Login</a>
                    </p>

                </div>
            </div>

            {/* RIGHT SIDE PANEL */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden">
                <img
                    src="/ine.png"
                    alt="Right Panel"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

        </div>
    );
};

export default Signup;