import {
    intervalToDuration,
    differenceInSeconds,
    differenceInMinutes,
    differenceInHours,
    differenceInDays,
    differenceInWeeks,
    differenceInMonths,
    differenceInYears,
} from "date-fns";
import { Movie, MovieDetails, TV, TvShowDetails } from "tmdb-ts";

export const movieDurationString = (minutes?: number): string => {
    if (!minutes) return "N/A";
    const duration = intervalToDuration({ start: 0, end: minutes * 60 * 1000 });
    const hours = duration.hours ? `${duration.hours}h ` : "";
    const mins = duration.minutes ? `${duration.minutes}m` : "";
    return `${hours}${mins}`;
};

export const formatDuration = (seconds: number): string => {
    const s = Math.round(seconds);

    const hrs = Math.floor(s / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    } else {
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }
};

export const timeAgo = (date: Date | string): string => {
    const now = new Date();
    const dateObj = typeof date === "string" ? new Date(date) : date;

    const seconds = differenceInSeconds(now, dateObj);
    const minutes = differenceInMinutes(now, dateObj);
    const hours = differenceInHours(now, dateObj);
    const days = differenceInDays(now, dateObj);
    const weeks = differenceInWeeks(now, dateObj);
    const months = differenceInMonths(now, dateObj);
    const years = differenceInYears(now, dateObj);

    if (seconds < 20) return "Just now";
    if (seconds < 60) return `${seconds} seconds ago`;

    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;

    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;

    if (days === 1) return "yesterday";
    if (days < 7) return `${days} days ago`;

    if (weeks === 1) return "1 week ago";
    if (weeks < 5) return `${weeks} weeks ago`;

    if (months === 1) return "last month";
    if (months < 12) return `${months} months ago`;

    if (years === 1) return "last year";
    return `${years} years ago`;
};

export const getImageUrl = (
    path?: string,
    type: "poster" | "backdrop" | "title" | "avatar" = "poster",
    fullSize?: boolean,
): string => {
    const size = fullSize ? "original" : "w500";
    const fallback =
        type === "poster"
            ? "https://dancyflix.com/placeholder.png"
            : type === "backdrop"
                ? "https://wallpapercave.com/wp/wp1945939.jpg"
                : "";
    return path ? `http://image.tmdb.org/t/p/${size}/${path}` : fallback;
};

export const mutateMovieTitle = (movie?: MovieDetails | Movie, language: string = "id"): string => {
    if (!movie) return "N/A";
    return movie.original_language === language ? movie.original_title : movie.title;
};

export const mutateTvShowTitle = (tv?: TvShowDetails | TV, language: string = "id"): string => {
    if (!tv) return "N/A";
    return tv.original_language === language ? tv.original_name : tv.name;
};
