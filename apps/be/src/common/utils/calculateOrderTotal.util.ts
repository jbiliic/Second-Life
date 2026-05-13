export function calculateOrderTotal(params: { quantity: number; price_per_unit: number }): {
    platform_fee: number;
    total: number;
} {
    const { quantity, price_per_unit } = params;

    const platform_fee_percent = 0.05; // 5% platform fee

    const subtotal = quantity * price_per_unit;

    const platform_fee = subtotal * platform_fee_percent;

    const total = subtotal + platform_fee;

    return {
        platform_fee,
        total,
    };
}
