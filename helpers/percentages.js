/**
 * Helper to calculate rounded percentages that sum exactly to 100%
 * Uses the Largest Remainder Method (Hamilton Method)
 */
export function calculatePercentages(counts) {
  const keys = Object.keys(counts);
  const total = keys.reduce((acc, k) => acc + (counts[k] || 0), 0);

  if (total === 0) {
    const zeroRes = {};
    keys.forEach(k => { zeroRes[`${k}_pct`] = 0; });
    return zeroRes;
  }

  const items = keys.map(k => {
    const val = (counts[k] || 0);
    const exact = (val / total) * 100;
    const floor = Math.floor(exact);
    const rem = exact - floor;
    return { key: k, floor, rem };
  });

  const currentSum = items.reduce((acc, item) => acc + item.floor, 0);
  let remainderToDistribute = 100 - currentSum;

  // Sort by remainder descending to distribute excess to highest fractional parts
  items.sort((a, b) => b.rem - a.rem);

  for (let i = 0; i < remainderToDistribute; i++) {
    items[i % items.length].floor += 1;
  }

  const result = {};
  items.forEach(item => {
    result[`${item.key}_pct`] = item.floor;
  });
  return result;
}
