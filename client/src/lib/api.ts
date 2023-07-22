export const post = async(path: string, body?: any) => {
    try {
        const url = "/api" + path;
        const headers = {
            "Content-Type": "application/json",
        };
        const requestOptions = {
            method: "POST",
            headers: headers,
            body
        }
        if(body) {
            requestOptions.body = JSON.stringify(body);
        }
        const response = await fetch(url, requestOptions);
        if(!response.ok) {
            throw new Error("API request failed");
        }
        return await response.json();
    } catch(error) {
        throw new Error("API request failed");
    }
}