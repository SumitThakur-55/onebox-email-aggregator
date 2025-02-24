"use client"
import React from 'react'

export default function page() {
    const connectGoogle = async () => {
        const res = await fetch("/api/email/connect");
        const data = await res.json();
        window.location.href = data.url; // Redirect to Gmail OAuth
    };

    return (
        <div>
            <div className="p-5">
                <h1 className="text-2xl font-bold">Add Email Account</h1>
                <button onClick={connectGoogle} className="bg-blue-500 text-white p-2">
                    Connect Google Account
                </button>
            </div>
        </div>
    )
}
