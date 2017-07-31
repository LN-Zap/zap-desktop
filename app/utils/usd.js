export function usdToBtc(usd, rate) {
  if (usd == undefined || usd === '') return

  return (usd / rate).toFixed(8)
}

export default {
	usdToBtc
}