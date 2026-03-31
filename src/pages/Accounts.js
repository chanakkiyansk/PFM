import React, { useState } from "react";
import supabase from "../supabaseClient";

const Accounts = () => {
    const [email, setEmail] = useState("");

    const familyId = localStorage.getItem("family_id");

    const addMember = async () => {
        await supabase.from("members").insert([
            {
                family_id: familyId,
                email: email
            }
        ]);

        alert("Member Added ✅");
    };

    return (
        <div className="card">
            <h2>Family Accounts</h2>

            <input
                placeholder="Enter member email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={addMember}>Add Member</button>
        </div>
    );
};

export default Accounts;