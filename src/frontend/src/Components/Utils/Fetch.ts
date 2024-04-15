let processRefresh: Promise<boolean> | undefined;

export interface response {
    code: number,
    data: any
}


export async function request(url: string, option: RequestInit = {}): Promise<response> {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        Object.assign(option, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
    
    const response = await fetch(url, option);
    if (response.status === 401) {
        const data = await response.json().catch(() => {});
        if (data !== undefined && data.code === "JWT003") { // refresh 토큰으로 다시 에세스 토큰 받아옴
            if (processRefresh === undefined) {
                processRefresh = tokenRefresh();
            }

            // 대기...
            if (await processRefresh) {
                // 다시 호출 ㄱㄱ
                return await request(url, option);
            }
        }
    }
    
    return {
        code: response.status,
        data: await response.json().catch(() => undefined)
    };
}

async function tokenRefresh(): Promise<boolean> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken == null) // 리프레시 토큰이 없으니까 그냥 에세스 토큰 발급 못함 ㅅㄱ
        return false;

    const response = await fetch("/api/relogin", {
        method: "POST",
        body: refreshToken
    }).then(value => value.json()).catch(() => {});

    let success = false;
    if (response !== undefined && response.success === true && response.accessToken !== undefined) {
        localStorage.setItem("accessToken", response.accessToken);
        success = true;
    }
    
    processRefresh = undefined;
    return success;
}