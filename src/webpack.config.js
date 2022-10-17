const path = require("path");
const webpack = require("webpack");

const configFile = path.resolve(__dirname, "../tsconfig.json");

module.exports = {
    entry: "./src/createTransformer.ts",
    mode: "production",
    target: "web",
    output: {
        filename: "createTransformerForBrowser.js",
        path: path.join(__dirname, "..", "dist"),
        library: "createTransformer"
    },
    devtool: "source-map",
    stats: "errors-only",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: "ts-loader",
                options: {
                    configFile,
                    onlyCompileBundledFiles: true,
                    compilerOptions: {
                        lib: ["es5"]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        fallback: {
            fs: false
        }
    }
};
