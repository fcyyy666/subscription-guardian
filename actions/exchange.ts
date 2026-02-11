'use server';

export async function getExchangeRate(from: string, to: string): Promise<number | null> {
    try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${from}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.rates[to] || null;
    } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
        return null;
    }
}
