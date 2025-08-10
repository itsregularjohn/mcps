/**
 * @type {import("prettier").Config}
 * @see https://github.com/trivago/prettier-plugin-sort-imports?tab=readme-ov-file#apis
 * */
module.exports = {
    plugins: ["@trivago/prettier-plugin-sort-imports"],
    tabWidth: 2,
    semi: false,
    trailingComma: "none",
    importOrder: ["^@modelcontextprotocol/(.*)$", "^@googleapis/(.*)$", "^[./]"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true
}
