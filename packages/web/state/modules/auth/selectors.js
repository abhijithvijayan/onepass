// Sample test case
export function getVaultItem(vault, id) {
    return vault.find(item => item.product.id === id);
}
