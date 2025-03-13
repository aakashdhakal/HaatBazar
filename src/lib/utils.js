export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-NP", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Format currency
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NP", {
        style: "currency",
        currency: "Rs ",
        maximumFractionDigits: 0,
    }).format(amount);
};