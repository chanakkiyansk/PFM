import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import "../styles/dashboard.css";

const Accounts = () => {
    const [email, setEmail] = useState("");
    const [members, setMembers] = useState([]);

    const familyId = localStorage.getItem("family_id");

    // ✅ FETCH MEMBERS
    const fetchMembers = async () => {
        const { data, error } = await supabase
            .from("members")
            .select("*")
            .eq("family_id", familyId);

        if (!error) {
            setMembers(data);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // ✅ ADD MEMBER
    const addMember = async () => {
        if (!email) return alert("Enter email");

        const { error } = await supabase.from("members").insert([
            {
                family_id: familyId,
                email: email
            }
        ]);

        if (!error) {
            alert("Member Added ✅");
            setEmail("");
            fetchMembers(); // refresh
        } else {
            alert("Error adding member");
        }
    };

    // ✅ REMOVE MEMBER
    const removeMember = async (id) => {
        await supabase.from("members").delete().eq("id", id);
        fetchMembers();
    };

    return (
        <div>

            <h2>👨‍👩‍👧 Family Management</h2>

            <div style={{
                display: "flex",
                gap: "20px",
                marginTop: "20px"
            }}>

                {/* LEFT - ADD MEMBER */}
                <div className="card" style={{ flex: 1 }}>
                    <h3>Add Member</h3>

                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button style={{ marginTop: "10px" }} onClick={addMember}>
                        Add Member
                    </button>
                </div>

                {/* RIGHT - MEMBER LIST */}
                <div className="card" style={{ flex: 2 }}>
                    <h3>Family Members</h3>

                    {members.length === 0 ? (
                        <p>No members yet</p>
                    ) : (
                        members.map((m) => (
                            <div key={m.id} style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px",
                                borderBottom: "1px solid #334155"
                            }}>
                                <span>{m.email}</span>

                                <button
                                    style={{ background: "red" }}
                                    onClick={() => removeMember(m.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default Accounts;