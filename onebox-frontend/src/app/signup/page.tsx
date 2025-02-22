"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { signIn } from "next-auth/react";

const SignupPage: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [manualFormData, setManualFormData] = useState<{
        firstName: string;
        lastName: string;
        email: string;
        password: string;
    }>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState<boolean>(false);

    // Handle Google Sign-In
    const handleLogin = async () => {
        const result = await signIn("google", { callbackUrl: "/dashboard" });
        if (!result?.ok) {
            console.error("Google sign-in failed", result);
        }
    };

    // Update manual form state
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setManualFormData({ ...manualFormData, [e.target.name]: e.target.value });
    };

    // Handle manual signup form submission
    const handleManualSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...manualFormData,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Signup successful!");
                window.location.href = "/dashboard";
            } else {
                console.error("Signup error:", data);
                // Convert the error object to a string for display
                alert("Signup failed: " + JSON.stringify(data.error));
            }
        } catch (error) {
            console.error("An error occurred during signup:", error);
            alert("An error occurred during signup.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-evenly bg-black text-white p-4">
            {/* Logo */}
            <div className="w-full max-w-md flex justify-center mb-8">
                <img src="/logo.svg" alt="Logo" />
                <h1 className="pl-2 font-bold text-3xl">ONE BOX</h1>
            </div>

            {/* Sign Up Card */}
            <div className="w-full max-w-md space-y-6 bg-[#111111] p-8 rounded-2xl">
                <h1 className="text-3xl font-semibold text-center mb-6">Sign Up</h1>

                {/* Google Sign Up */}
                <button
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors"
                    onClick={handleLogin}
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                        alt="Google Logo"
                        className="w-6 h-6"
                    />
                    <span className="text-gray-200">Sign up with Google</span>
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-md">
                        <span className="px-4 bg-[#111111] text-gray-400">
                            OR, SIGN UP WITH YOUR EMAIL
                        </span>
                    </div>
                </div>

                {/* Manual Signup Form */}
                <form onSubmit={handleManualSignup} className="space-y-4">
                    {/* Name Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-md font-medium text-gray-200">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={manualFormData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#1A1A1A] rounded-lg border border-gray-600 text-gray-300 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-md font-medium text-gray-200">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={manualFormData.lastName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#1A1A1A] rounded-lg border border-gray-600 text-gray-300 focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="block text-md font-medium text-gray-200">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={manualFormData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#1A1A1A] rounded-lg border border-gray-600 text-gray-300 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="block text-md font-medium text-gray-200">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={manualFormData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-[#1A1A1A] rounded-lg border border-gray-600 text-gray-300 focus:outline-none focus:border-blue-500"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                                {passwordVisible ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* Manual Sign Up Button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                {/* Sign In Link */}
                <div className="text-center text-lg text-gray-400">
                    Already have an account?{" "}
                    <a href="#" className="text-white hover:underline">
                        Sign In
                    </a>
                </div>

                {/* Terms and Privacy */}
                <div className="text-center text-sm text-gray-400">
                    By signing up, you agree to Onebox's
                    <br />
                    <a href="#" className="text-white hover:underline">
                        Terms of Service
                    </a>{" "}
                    &amp;
                    <a href="#" className="text-white hover:underline">
                        Privacy Policy
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-sm text-gray-500">
                © 2025 Onebox. All rights reserved.
            </div>
        </div>
    );
};

export default SignupPage;
