export interface PlayersProps {
    title: string;
    source: string;
    recommended?: boolean;
    fast?: boolean;
    ads?: boolean;
    resumable?: boolean;
}

export const getMoviePlayers = (id: string | number, startAt?: number): PlayersProps[] => {
    return [
        {
            title: "VidLink",
            source: `https://vidlink.pro/movie/${id}?player=jw&primaryColor=006fee&secondaryColor=a2a2a2&iconColor=eefdec&autoplay=false&startAt=${startAt || ""}`,
            recommended: true,
            fast: true,
            ads: true,
            resumable: true,
        },
        {
            title: "VidLink 2",
            source: `https://vidlink.pro/movie/${id}?primaryColor=006fee&autoplay=false&startAt=${startAt}`,
            recommended: true,
            fast: true,
            ads: true,
            resumable: true,
        },
        {
            title: "VidKing",
            source: `https://www.vidking.net/embed/movie/${id}?color=006fee&autoplay=false`,
            recommended: true,
            fast: true,
            resumable: true,
        },
        {
            title: "SuperEmbed",
            source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
            fast: true,
            ads: true,
        },
        {
            title: "VidSrc 1",
            source: `https://vidsrc.xyz/embed/movie/${id}`,
            ads: true,
        }
    ];
};

export const getTvShowPlayers = (
    id: string | number,
    season: number,
    episode: number,
    startAt?: number,
): PlayersProps[] => {
    return [
        {
            title: "VidLink",
            source: `https://vidlink.pro/tv/${id}/${season}/${episode}?player=jw&primaryColor=f5a524&secondaryColor=a2a2a2&iconColor=eefdec&autoplay=false&startAt=${startAt || ""}`,
            recommended: true,
            fast: true,
            ads: true,
            resumable: true,
        },
        {
            title: "VidLink 2",
            source: `https://vidlink.pro/tv/${id}/${season}/${episode}?primaryColor=f5a524&autoplay=false&startAt=${startAt}`,
            recommended: true,
            fast: true,
            ads: true,
            resumable: true,
        },
        {
            title: "VidKing",
            source: `https://www.vidking.net/embed/tv/${id}/${season}/${episode}?color=f5a524&autoplay=false`,
            recommended: true,
            fast: true,
            resumable: true,
        },
        {
            title: "SuperEmbed",
            source: `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
            fast: true,
            ads: true,
        },
        {
            title: "VidSrc 1",
            source: `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`,
            ads: true,
        }
    ];
};
