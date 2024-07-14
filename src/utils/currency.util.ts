export function currency(amount: number) {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency: 'USD',
  })
    .format(amount)
    .replace(/^\./, '')
    .replace('$', '')
    .trim();
}
