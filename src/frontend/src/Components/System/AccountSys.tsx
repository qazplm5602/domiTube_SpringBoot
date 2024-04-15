import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { request } from "../Utils/Fetch";

export default function AccountSys() {
    const dispatch = useDispatch();
    
    const loadUser = async function() {
        const response = await request("/api/user/my");
        console.log(response);
    }

    useEffect(() => {
        loadUser();
    }, []);

    return null;
}