// Template code
async function getSightList() {
    try {
        const response = await fetch('/getSightList', { method: 'GET' });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}


