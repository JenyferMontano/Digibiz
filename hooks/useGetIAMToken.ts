export async function getIAMToken() {
    const response = await fetch('/api/auth/token', {
        method: "POST"
    });

    if (!response.ok) {
        throw new Error('Failed to fetch IAM Token')
    };

    return response.json();
}