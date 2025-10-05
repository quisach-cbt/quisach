import { CDN_API_KEY } from "$env/static/private";

export async function uploadToCDN(file: File): Promise<string> {
    return new Promise(async (resolve, reject) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('https://cdn.btoi.info.vn/upload', {
            method: 'POST',
            headers: {
                'X-API-Key': CDN_API_KEY
            },
            body: formData
        });
    
        if (!response.ok) return reject();
        const json = await response.json();
        return resolve(json.url);
    });
}