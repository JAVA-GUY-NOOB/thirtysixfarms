export const formatKES = (value, options = {}) => {
  if (value === null || value === undefined) return 'KSh —';
  const num = typeof value === 'number' ? value : parseFloat(value);
  if (Number.isNaN(num)) return 'KSh —';
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0,
      ...options,
    }).format(num);
  } catch {
    return `KSh ${Math.round(num).toLocaleString('en-KE')}`;
  }
};

export default formatKES;
