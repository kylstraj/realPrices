const logBase = (n, base) => Math.log(n) / Math.log(base);

const onTheOrderOf = number => 
  Math.floor(logBase(number, 10));

const roundUpPrice = (exactPrice) => {
  const order = 10 ** onTheOrderOf(exactPrice);
  return Math.ceil(exactPrice / order) * order;
};

const breakDigits = number => {
  const order = 10 ** onTheOrderOf(number);
  const leftDigit = Math.floor(number / order) * order;
  const rightDigits = number - leftDigit;
  return { leftDigit, rightDigits };
}

const makePriceGetter = threshold =>
  function priceGetter(exactPrice) {
    if (exactPrice === 0) {
      return 0;
    }
    const order = 10 ** onTheOrderOf(exactPrice);
    const maxDiff = threshold * order;
    const rounded = roundUpPrice(exactPrice);
    const { leftDigit, rightDigits } = breakDigits(exactPrice);
    return rounded - exactPrice > maxDiff ?
      leftDigit + priceGetter(rightDigits) :
      rounded;
  };

const getRealPrice = makePriceGetter(0.1);
