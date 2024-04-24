export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function numberWithKorean(value: number) {
  let num: number = 0;
  let prefix: string = "";

  if (value >= 10000) {
    num = Math.round((value / 10000) * 10) / 10;
    prefix = "만";
  } else if (value >= 1000) {
    num = Math.round((value / 1000) * 10) / 10;
    prefix = "천";
  } else num = value;

  return `${num}${prefix}`;
}

console.log(numberWithKorean(1500));