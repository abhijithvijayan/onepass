// Sample test case
export function getVaultItem(vault, id) {
    return vault.find(item => {
        return item.product.id === id;
    });
}
