export const beautifySecretKey = secretKey => {
    return `${secretKey.slice(0, 2)}-${secretKey.slice(2, 8)}-${secretKey.slice(8, 14)}-${secretKey.slice(
        14,
        19
    )}-${secretKey.slice(19, 24)}-${secretKey.slice(24, 29)}-${secretKey.slice(29, 34)}`;
};
