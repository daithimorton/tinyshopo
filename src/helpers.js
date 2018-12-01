export function convertWholeDollarsToCents(dollars) {
  return dollars * 100;
}

export function convertCentsToWholeDollars(cents) {
  return cents / 100;
}

export function calculateProductTotals(items) {
  const totalQuantity = items
    .map(item => item.quantity)
    .reduce((total, currentQuantity) => total + currentQuantity);

  const totalPrice = items
    .map(item => item.price)
    .reduce((total, currentPrice) => Number(total) + Number(currentPrice));

  return {
    quantity: totalQuantity,
    price: totalPrice
  };
}

export function pluralize(item) {
  return item === 1 ? '' : 's';
}
