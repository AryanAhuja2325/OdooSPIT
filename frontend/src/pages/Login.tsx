import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/user/login", form, {
                withCredentials: true,
            });

            login(res.data.token, res.data.user);
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-white font-display">

            {/* LEFT SIDE FORM */}
            <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8 sm:p-12">
                <div className="w-full max-w-md">

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-teal-500 p-2 rounded-lg">
                            <span className="material-symbols-outlined text-white text-3xl">
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="w-7 h-7 object-contain"
                                />
                            </span>
                        </div>
                        <h1 className="text-gray-800 text-2xl font-bold">Stock Master</h1>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-500 text-base pt-2 pb-6">
                            Sign in to access your portfolio
                        </p>

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <label className="flex flex-col w-full">
                                <p className="text-gray-700 text-sm pb-1">Login ID</p>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your login ID"
                                    className="border border-gray-300 rounded-lg h-12 px-4"
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <label className="flex flex-col w-full">
                                <p className="text-gray-700 text-sm pb-1">Password</p>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="border border-gray-300 rounded-lg h-12 px-4"
                                    onChange={handleChange}
                                    required
                                />
                            </label>

                            <div className="flex justify-start">
                                <a className="text-teal-600 text-sm hover:underline">
                                    Forgot Password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="h-12 w-full rounded-lg bg-gradient-to-r from-teal-500 to-green-600 text-white font-bold hover:opacity-90 transition"
                            >
                                Sign In
                            </button>

                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        </form>
                    </div>

                    <div className="pt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{" "}
                            <a href="/signup" className="font-bold text-teal-600 hover:underline">
                                Sign Up
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE IMAGE PANEL */}
            <div className="hidden lg:flex w-1/2 relative">
                <img
                    src="/invest.png"
                    alt="Right Panel"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

        </div>
    );
};

export default Login;