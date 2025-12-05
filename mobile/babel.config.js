module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: [
            [
                "transform-inline-environment-variables",
                {
                    include: [
                        "NEXT_PUBLIC_TMDB_ACCESS_TOKEN",
                        "NEXT_PUBLIC_SUPABASE_URL",
                        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
                        "NEXT_PUBLIC_CAPTCHA_SITE_KEY",
                        "NEXT_PUBLIC_AVATAR_PROVIDER_URL"
                    ],
                },
            ],
            ["module:react-native-dotenv"]
        ],
    };
};
