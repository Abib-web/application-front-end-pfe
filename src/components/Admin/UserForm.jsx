import React, { useState } from 'react';
import { userAPI } from "../../api/users";


const UserForm = () => {
    const roles ={
        admin: 10,
        user: 11,
        guest: 12
    }
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        userAPI.create(formData).then((res) => {
            console.log('User created:', res);
        });
        // Handle form submission logic here
        console.log('Form submitted:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="role">Role:</label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="">Select a role</option>
                    {Object.keys(roles).map((role) => (
                        <option key={role} value={roles[role]}>
                            {role}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit">Ajouter</button>
        </form>
    );
};

export default UserForm;