import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";

const Accounts = () => {
    const [email, setEmail] = useState("");
    const [members, setMembers] = useState([]);

    const family_id = localStorage.getItem("family_id") || "FAM001";

    // 🔥 FETCH MEMBERS
    const fetchMembers = async () => {
        const { data, error } = await supabase
            .from("family_members")
            .select("*")
            .eq("family_id", family_id);

        if (!error) {
            setMembers(data);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    // 🔥 ADD MEMBER
    const addMember = async () => {
        if (!email) return alert("Enter email");

        const { error } = await supabase
            .from("family_members")
            .insert([
                {
                    family_id,
                    email
                }
            ]);

        if (!error) {
            alert("Member added ✅");
            setEmail("");
            fetchMembers();
        } else {
            alert(error.message);
        }
    };

    // 🔥 DELETE MEMBER
    const removeMember = async (id) => {
        await supabase
            .from("family_members")
            .delete()
            .eq("id", id);

        fetchMembers();
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>👨‍👩‍👧 Family Management</h2>

            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

                {/* ADD MEMBER */}
                <div style={{
                    flex: 1,
                    background: "#1e293b",
                    padding: "20px",
                    borderRadius: "10px",
                    color: "white"
                }}>
                    <h3>Add Member</h3>

                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", marginTop: "10px", padding: "8px" }}
                    />

                    <button
                        onClick={addMember}
                        style={{
                            marginTop: "10px",
                            padding: "8px",
                            width: "100%",
                            background: "#00adb5",
                            border: "none",
                            color: "white",
                            borderRadius: "6px"
                        }}
                    >
                        Add Member
                    </button>
                </div>

                {/* MEMBER LIST */}
                <div style={{
                    flex: 2,
                    background: "#1e293b",
                    padding: "20px",
                    borderRadius: "10px",
                    color: "white"
                }}>
                    <h3>Family Members</h3>

                    {members.length === 0 ? (
                        <p>No members yet</p>
                    ) : (
                        members.map((m) => (
                            <div key={m.id} style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "10px",
                                background: "#0f172a",
                                padding: "10px",
                                borderRadius: "6px"
                            }}>
                                <span>{m.email}</span>

                                <button
                                    onClick={() => removeMember(m.id)}
                                    style={{
                                        background: "red",
                                        border: "none",
                                        color: "white",
                                        padding: "5px 10px",
                                        borderRadius: "5px"
                                    }}
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