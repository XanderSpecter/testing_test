const headers = {
    'Content-Type': 'application/json',
};

export const savePage = async (pageName: string, pageData: Record<string, string>) => {
    try {
        const body = JSON.stringify({
            pageName,
            pageData,
        });

        const res = await fetch('/api/savePage', {
            method: 'POST',
            headers,
            body,
        });

        console.log(res);
    } catch (e) {
        console.log(e);
    }
};
