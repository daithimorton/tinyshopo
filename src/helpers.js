export function convertWholeDollarsToCents(dollars) {
  return dollars * 100;
}

export function convertCentsToEuros(cents) {
  return cents / 100;
}

export function calculateProductTotals(items) {
  const totalQuantity = (items && items.length > 0 && items
    .map(item => item.quantity)
    .reduce((total, currentQuantity) => total + currentQuantity)) || 0;

  const totalPrice = (items && items.length > 0 && items
    .map(item => item.price)
    .reduce((total, currentPrice) => Number(total) + Number(currentPrice))) || 0;

  return {
    quantity: totalQuantity,
    price: totalPrice
  };
}

export function pluralize(item) {
  return item === 1 ? '' : 's';
}
