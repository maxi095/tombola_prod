import { createContext, useContext, useState, useEffect } from 'react';
import { getUserRequest, getUsersRequest, createUserRequest, updateUserRequest, deleteUserRequest, getStudentsRequest, getDirectorsRequest, createStudentRequest } from "../api/user";

const UserContext = createContext();

export const useUsers = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUsers must be used within a UserProvider");
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]); 

    const getUser = async (id) => {
        try {
            const res = await getUserRequest(id);
            return res.data;
        } catch (error) {
            console.error(error);
        }
    };
    
    const getUsers = async () => {
        try {
            const res = await getUsersRequest();
            setUsers(res.data); // Asegúrate de que 'res.data' sea un arreglo
        } catch (error) {
            console.error(error);
        }
    };

    const createUser = async (user) => {
        const res = await createUserRequest(user);
        setUsers((prev) => [...prev, res.data]); // Agrega el nuevo usuario a la lista
    };

    const createStudent = async (user) => {
        const res = await createStudentRequest(user);
        setUsers((prev) => [...prev, res.data]); // Agrega el nuevo estudiante a la lista
    };

    const updateUser = async (id, user) => {
        const res = await updateUserRequest(id, user); // Corrige el uso de la función
        setUsers((prev) => prev.map(u => (u._id === id ? res.data : u)));
    };

    const deleteUser = async (id) => {
        await deleteUserRequest(id); // Corrige el uso de la función
        setUsers((prev) => prev.filter(u => u._id !== id));
    };

    const getStudents = async () => {
        try {
            const res = await getStudentsRequest();
            setUsers(res.data); // Asegúrate de que 'res.data' sea un arreglo
        } catch (error) {
            console.error(error);
        }
    };

    const getDirectors = async () => {
        try {
            const res = await getDirectorsRequest();
            setUsers(res.data); // Asegúrate de que 'res.data' sea un arreglo
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <UserContext.Provider value={{ users, createUser, updateUser, deleteUser, getUsers, getUser, getStudents, getDirectors, createStudent }}>
            {children}
        </UserContext.Provider>
    );
};
