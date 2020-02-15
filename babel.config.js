const presets = [
    [
        "@babel/env",
        {
            targets: {
                // edge: "17",
                edge: "10",
                chrome: "64",
                firefox: "60",
                safari: "11.1"
            },
            useBuiltIns: "usage"
        }
    ]
]

module.exports = {
    presets
};