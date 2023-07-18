const path = require("path");

module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "./src/index.tsx"),
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
}