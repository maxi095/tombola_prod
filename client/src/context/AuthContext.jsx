import { createContext, useState, useContext, useEffect } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
import { useFormState } from "react-hook-form";
import Cookies from 'js-cookie';

export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context){
        throw new Error ("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signup = async (user) => {
    try {
        
            const res = await registerRequest(user)
            //console.log(res.data);
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            // console.log(error.response);
            setErrors(error.response.data);
        }
    };
    
    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            setIsAuthenticated(true);
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data)); // 👈 Guardar user
        } catch (error) {
            if (Array.isArray(error.response.data)) {
                return setErrors(error.response.data)
            }  
            setErrors([error.response.data.message])
        }
    };

    const logout = () => {
        Cookies.remove("token");
        localStorage.removeItem("user"); // 👈 limpiar también el user
        setIsAuthenticated(false);
        setUser(null);
    };
    

    const hasRole = (role) => {
        return user?.roles === role; // Aquí verificamos si el rol del usuario coincide con el rol esperado
    };

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [errors])

    useEffect(() => {
        async function checkLogin () {
            const cookies = Cookies.get();
    
            if (!cookies.token) {
                setIsAuthenticated(false);
                setLoading(false);
                setUser(null);
                return;
            }
    
            try {
                const res = await verifyTokenRequest(cookies.token);
    
                if (!res.data) {
                    setIsAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                    return;
                }
    
                setIsAuthenticated(true);
                setUser(res.data);
                localStorage.setItem("user", JSON.stringify(res.data)); // 👈 también aquí
                setLoading(false);
    
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem("user"); // 👈 limpiar si falla
                setLoading(false);
            }
        }
    
        // 👇 Restaurar si hay un user en localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    
        checkLogin();
    }, []);

    return (
        <AuthContext.Provider value = {{
            signup,
            signin,
            logout,
            loading,
            user,
            isAuthenticated,
            errors,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    )
}