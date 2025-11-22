import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // 👈 make sure this is correct

interface LoginForm {
    email: string;
    password: string;
}

const Login = () => {
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();
    const { login } = useAuth(); // 👈 IMPORTANT

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/api/user/login", form, {
                withCredentials: true,
            });

            // Passing user & token to context
            login(res.data.token, res.data.user); // 👈 Now works
            navigate("/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full border rounded-md p-2"
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full border rounded-md p-2"
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
                        Login
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    Don't have an account? <a href="/signup" className="text-blue-600">Create one</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
