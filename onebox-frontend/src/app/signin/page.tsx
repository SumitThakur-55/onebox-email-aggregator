"use client"
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React from 'react';

function Page() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    // Redirect if already authenticated
    useEffect(() => {
        if (session) {
            router.replace('/dashboard');
        }
    }, [session, router]);

    const handleLogin = async () => {
        const result = await signIn("google", { callbackUrl: "/dashboard" });
        if (!result?.ok) {
            console.error("Google sign-in failed", result);
        }
    };

    const handleManualLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                alert(result.error);
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-evenly bg-black text-white p-4">
            {/* Logo */}
            <div className="w-full max-w-md flex justify-center mb-8">
                <img src="/logo.svg" alt="" />
                <h1 className='pl-2 font-bold text-3xl'>ONE BOX</h1>
            </div>

            {/* Sign In Card */}
            <div className="w-full max-w-md space-y-6 bg-[#111111] p-8 rounded-2xl">
                <h1 className="text-3xl font-semibold text-center mb-6">Sign In</h1>

                {/* Google Sign In */}
                <button
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors"
                    onClick={handleLogin}
                >
                    <img
                        src="/google-logo.svg"
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
                            OR, SIGN IN WITH YOUR EMAIL
                        </span>
                    </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                    <label className="block text-md font-medium text-gray-200">Email</label>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#1A1A1A] rounded-lg border border-gray-600 text-gray-300 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                    <label className="block text-md font-medium text-gray-200">Password</label>
                    <div className="relative">
                        <input
                            type={passwordVisible ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-[#1A1A1A] rounded-lg border border-gray-600 text-gray-300 focus:outline-none focus:border-blue-500"
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

                {/* Forgot Password */}
                <div className="text-right">
                    <a href="#" className="text-md text-gray-300 hover:text-white">
                        Forgot Password?
                    </a>
                </div>

                {/* Sign In Button */}
                <button
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                    onClick={handleManualLogin}
                    disabled={loading}
                >
                    {loading ? "Signing In..." : "Sign In"}
                </button>

                {/* Sign Up Link */}
                <div className="text-center text-lg text-gray-400">
                    Don't have an account?
                    <a href="#" className="text-white hover:underline"> Sign Up</a>
                </div>

                {/* Terms and Privacy */}
                <div className="text-center text-sm text-gray-400">
                    By creating an account, you agree to Onebox's<br></br>
                    <a href="#" className="text-white hover:underline">Terms of Service</a> &
                    <a href="#" className="text-white hover:underline"> Privacy Policy</a>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-sm text-gray-500">
                © 2025 Onebox. All rights reserved.
            </div>
        </div>
    );
}

export default Page;
