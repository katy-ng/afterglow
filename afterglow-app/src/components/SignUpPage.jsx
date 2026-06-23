import { useState } from "react";

export function SignUpPage(){
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");

    async function handleSignUp() {
        if (!name || !email) {
        setStatus("Please fill in both fields.");
        return;
        }

        try {
        const newUserID = await window.db.addUser(name, email);
        setStatus(`Success! User added with ID: ${newUserID}`);
        setName("");
        setEmail("");
        } catch (err) {
        setStatus(`Error: ${err.message}`);
        }
    }

    return(
        <>
            <h1>Sign Up</h1>

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleSignUp}>Sign Up</button>

            {status && <p>{status}</p>}
        </>
    );
}