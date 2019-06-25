
// this function can't pass compile
export function nullCheck<T>(a: T | undefined, b: T): T {
    if(a) {
        return a;
    } else {
        return b;
    }
}