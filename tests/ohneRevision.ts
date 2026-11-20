/** Historische Sicherungen enthalten noch den inzwischen verworfenen Revisionszähler. */
export const ohneRevision = <T extends object>(raw: T): T => {
  const { revision: _revision, ...rest } = raw as T & { revision?: unknown };
  return rest as T;
};
