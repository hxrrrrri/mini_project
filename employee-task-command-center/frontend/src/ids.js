let counter = 0;
const nextId = (prefix) => `${prefix}-${Date.now().toString(36)}-${(counter += 1)}`;

export const makeId = (prefix) => nextId(prefix);
