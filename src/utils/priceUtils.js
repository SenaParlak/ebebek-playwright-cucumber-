export function parsePrice(priceText) {
  if (!priceText) {
    throw new Error('Price text is empty');
  }

  const priceMatches = priceText.match(
    /\d{1,3}(?:\.\d{3})*,\d{2}|\d+,\d{2}/g
  );

  if (!priceMatches || priceMatches.length === 0) {
    throw new Error(`Price could not be parsed: ${priceText}`);
  }

  const selectedPrice = priceMatches[priceMatches.length - 1];

  const normalizedPrice = selectedPrice
    .replace(/\./g, '')
    .replace(',', '.');

  const parsedPrice = Number(normalizedPrice);

  if (Number.isNaN(parsedPrice)) {
    throw new Error(`Price could not be parsed: ${priceText}`);
  }

  return parsedPrice;
}