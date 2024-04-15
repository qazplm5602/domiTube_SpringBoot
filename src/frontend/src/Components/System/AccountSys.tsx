import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { request } from "../Utils/Fetch";

export default function AccountSys() {
    const dispatch = useDispatch();
    
    const loadUser = async function() {
        // 어차피 토큰 없음
        if (localStorage.getItem("accessToken") === null && localStorage.getItem("refreshToken") === null) {
            dispatch({type: "login.set", loading: false});
            return;
        }
        
        const response = await request("/api/user/my");
        
        // 안됨
        if (response.code !== 200 || response.data === undefined || response.data.result !== true) {
            dispatch({type: "login.set", loading: false});
            return;
        }

        dispatch({
            type: "login.set",
            logined: true,
            loading: false,

            id: response.data.id,
            name: response.data.name
        });
    }

    useEffect(() => {
        loadUser();
    }, []);

    return null;
}