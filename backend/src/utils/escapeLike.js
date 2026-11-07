// % and _ are wildcards to the database, so they're escaped to match as plain text.
export const escapeLike = (text) => text.replace(/[\\%_]/g, "\\$&");

export const toContains = (text) => ({ contains: escapeLike(text), mode: "insensitive" });
