export default function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let isActivate: boolean = false;
  let tmpTimeout: number;

  return function debounced(...args: Parameters<T>) {        


    if(!isActivate) {
      isActivate = true;
      func(...args);
      clearTimeout(tmpTimeout);
      tmpTimeout = setTimeout(() => {
        isActivate = false;
      }, delay);
    }
  };
}