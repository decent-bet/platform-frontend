// tslint:disable:no-bitwise
export function FF(a, b, c, d, x, s, t) {
    let n = a + ((b & c) | (~b & d)) + x + t
    return ((n << s) | (n >>> (32 - s))) + b
}

export function GG(a, b, c, d, x, s, t) {
    let n = a + ((b & d) | (c & ~d)) + x + t
    return ((n << s) | (n >>> (32 - s))) + b
}

export function HH(a, b, c, d, x, s, t) {
    let n = a + (b ^ c ^ d) + x + t
    return ((n << s) | (n >>> (32 - s))) + b
}

export function II(a, b, c, d, x, s, t) {
    let n = a + (c ^ (b | ~d)) + x + t
    return ((n << s) | (n >>> (32 - s))) + b
}
