interface Item {
  id: number;
  date: number;
  operator: number;
  cid: any;
}

export default function groupByDay(items: Item[]): Record<string, Item[]> {
  const result: Record<string, Item[]> = {};
  for (const item of items) {
    const date = new Date(item.date);
    // console.log(date.getDate(),"date");
    
    const day = date.getFullYear() + date.getMonth() + 1 + date.getDate();
    if (!result[day]) {
      result[day] = [];
    }
    result[day].push(item);
  }
  return result;
}
