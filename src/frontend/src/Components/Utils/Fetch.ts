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
    return {
        code: response.status,
        data: await response.json().catch(() => undefined)
    };
}