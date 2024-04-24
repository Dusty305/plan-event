export const urlToPathnameSegments = (url) => {
    return url.pathname.split('/').slice(1)
}