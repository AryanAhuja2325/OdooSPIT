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
        setForm({ ...form, [e.target.name]: e.target.value } as SignupForm);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/user/register", form, { withCredentials: true });
            window.location.href = "/login";
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-center">Create Account</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full border rounded-md p-2"
                        onChange={handleChange}
                        required
                    />

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

                    <select
                        name="role"
                        className="w-full border rounded-md p-2"
                        onChange={handleChange}
                        value={form.role}
                    >
                        <option value="WAREHOUSE_STAFF">Warehouse Staff</option>
                        <option value="INVENTORY_MANAGER">Inventory Manager</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition">
                        Sign Up
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    Already have an account? <a href="/login" className="text-blue-600">Login</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
