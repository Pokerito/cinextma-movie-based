import { tmdb } from "@/api/tmdb";

export const siteConfig = {
    name: "Cinextma",
    description: "Your only choice for a free movies and tv shows streaming website.",
    queryLists: {
        movies: [
            {
                name: "Today's Trending Movies",
                query: () => tmdb.trending.trending("movie", "day"),
                param: "todayTrending",
            },
            {
                name: "This Week's Trending Movies",
                query: () => tmdb.trending.trending("movie", "week"),
                param: "thisWeekTrending",
            },
            {
                name: "Popular Movies",
                query: () => tmdb.movies.popular(),
                param: "popular",
            },
            {
                name: "Now Playing Movies",
                query: () => tmdb.movies.nowPlaying(),
                param: "nowPlaying",
            },
            {
                name: "Upcoming Movies",
                query: () => tmdb.movies.upcoming(),
                param: "upcoming",
            },
            {
                name: "Top Rated Movies",
                query: () => tmdb.movies.topRated(),
                param: "topRated",
            },
        ],
        tvShows: [
            {
                name: "Today's Trending TV Shows",
                query: () => tmdb.trending.trending("tv", "day"),
                param: "todayTrending",
            },
            {
                name: "This Week's Trending TV Shows",
                query: () => tmdb.trending.trending("tv", "week"),
                param: "thisWeekTrending",
            },
            {
                name: "Popular TV Shows",
                query: () => tmdb.tvShows.popular(),
                param: "popular",
            },
            {
                name: "On The Air TV Shows",
                query: () => tmdb.tvShows.onTheAir(),
                param: "onTheAir",
            },
            {
                name: "Top Rated TV Shows",
                query: () => tmdb.tvShows.topRated(),
                param: "topRated",
            },
        ],
    },
};
