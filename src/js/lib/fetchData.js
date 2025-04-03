export async function fetchBerufsberatungData(
    path = 'src/data/berufsberatung.json'
) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        throw new Error(error.message || 'Unknown fetch error');
    }
}
