import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { request } from "../Utils/Fetch";
import Istore from "../Redux/Type";

export default function AccountSys() {
    const loading = useSelector<Istore, boolean>(value => value.login.loading);
    const dispatch = useDispatch();
    
    const loadUser = async function() {
        // 어차피 토큰 없음
        if (localStorage.getItem("accessToken") === null && localStorage.getItem("refreshToken") === null) {
            dispatch({type: "login.set", loading: false});
            return;
        }
        
        const response = await request("/api/user/my");
        console.log("/api/user/my", response);
        
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
            name: response.data.name,
            image: response.data.image
        });
    }

    useEffect(() => {
        if (loading)
            loadUser();
    }, [loading]);

    return null;
}