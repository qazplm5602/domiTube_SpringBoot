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

export function dateWithKorean(value: Date) {
  const diff = new Date(new Date().getTime() - value.getTime());

  let num: number;
  let prefix: string;

  if (diff.getFullYear() - 1970 > 0) {
    num = diff.getFullYear() - 1970;
    prefix = "년";
  } else if (diff.getMonth() > 0) {
    num = diff.getMonth();
    prefix = "달";
  } else if (diff.getDate() - 1 > 0) {
    num = diff.getDate() - 1;
    prefix = "일";
  } else if (diff.getHours() - 9 > 0) {
    num = diff.getHours() - 9;
    prefix = "시간";
  } else if (diff.getMinutes() > 0) {
    num = diff.getMinutes();
    prefix = "분";
  } else {
    num = diff.getSeconds();
    prefix = "초";
  }

  return `${num}${prefix}`;
}

export function secondsToHMS(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  const s = Math.floor(seconds % 3600 % 60);

  return `${(h >= 1 ? h.toString().padStart(2, '0') : '')}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}