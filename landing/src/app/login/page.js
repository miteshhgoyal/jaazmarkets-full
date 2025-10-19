"use client";
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login attempt:', { email, password, keepSignedIn });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">Q</span>
                        </div>
                        <span className="text-2xl font-semibold text-gray-900">Jazz Markets</span>
                    </div>
                </div>

                {/* Welcome Back Title */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Welcome Back</h2>
                </div>

                {/* Login Form */}
                <div className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <div className="block text-sm font-medium text-gray-700 mb-2">
                            Email Or Username
                        </div>
                        <input
                            type="text"
                            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                            placeholder="Enter your email address or username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* reCAPTCHA */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            checked={captchaVerified}
                            onChange={(e) => setCaptchaVerified(e.target.checked)}
                        />
                        <div className="text-sm text-gray-700">
                            Im not a robot
                        </div>
                        <div className="ml-auto text-xs text-gray-500">
                            <div>reCAPTCHA</div>
                            <div>Privacy - Terms</div>
                        </div>
                    </div>

                    {/* Keep Me Signed In & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                checked={keepSignedIn}
                                onChange={(e) => setKeepSignedIn(e.target.checked)}
                            />
                            <div className="ml-2 block text-sm text-gray-700">
                                Keep Me Signed In
                            </div>
                        </div>

                        <div className="flex space-x-4 text-sm">
                            <button className="text-gray-600 hover:text-gray-900">
                                Forget Password
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                                Get Password
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            onClick={handleSubmit}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
                        >
                            Account Login
                        </button>
                    </div>
                </div>

                {/* Sign Up a */}
                <div className="text-center">
                    <span className="text-sm text-gray-600">
                        DONT HAVE AN ACCOUNT?{' '}
                        <button className="font-medium text-gray-900 hover:text-orange-500">
                            SIGN UP NOW.
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
}