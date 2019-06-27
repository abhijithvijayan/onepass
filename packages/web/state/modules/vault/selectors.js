/* Test case : toberemoved */
export const isRequesting = state => {
    const vault = state.get('vault');
    if (vault && vault.get) {
        return vault.get('isRequesting');
    }
};
