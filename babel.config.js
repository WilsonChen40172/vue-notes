module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    // 支援 IE11
                    ie: '11'
                },
                useBuiltIns: 'usage',
                corejs: 3
            }
        ]
    ]
}
