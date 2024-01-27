import defaultStore, { Store } from "./defaultStore";

const subscribers: Partial<Record<keyof Store, Set<() => void>>> = {};
const syncedStore: Store = { ...defaultStore };

const getStore = (key: keyof Store) => {
    return syncedStore[key];
};
const setStore = <T extends keyof Store>(key: T, value: Store[T]) => {
    syncedStore[key] = value;
    if (subscribers[key]) {
        subscribers[key]?.forEach((callback) => callback());
    }
};

const syncStore: <T extends keyof Store>(
    key: T
) => [(callback: () => void) => () => void, () => Store[T]] = <
    T extends keyof Store
>(
    key: T
) => {
    return [
        // Subscribe
        (callback: () => void) => {
            if (!subscribers[key]) {
                subscribers[key] = new Set();
            }
            subscribers[key]?.add(callback);

            return () => {
                subscribers[key]?.delete(callback);
            };
        },
        // Get snapshot,
        () => {
            return getStore(key);
        },
    ];
};

export { getStore, setStore, syncStore };
