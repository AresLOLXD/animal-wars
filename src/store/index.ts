import defaultStore, { Store } from "./defaultStore";

export type StoreCallback = (value?: Store[keyof Store]) => void;

const subscribers: Partial<Record<keyof Store, Set<StoreCallback>>> = {};
const syncedStore: Store = { ...defaultStore };

const getStore = (key: keyof Store) => {
    return syncedStore[key];
};
const setStore = <T extends keyof Store>(key: T, value: Store[T]) => {
    syncedStore[key] = value;
    if (subscribers[key]) {
        subscribers[key]?.forEach((callback) => callback(value));
    }
};

const subscribeStore = <T extends keyof Store>(
    key: T,
    callback: StoreCallback
) => {
    if (!subscribers[key]) {
        subscribers[key] = new Set();
    }
    subscribers[key]?.add(callback);

    return () => {
        subscribers[key]?.delete(callback);
    };
};

const syncStore: (
    key: keyof Store
) => [(callback: StoreCallback) => () => void, () => Store[keyof Store]] = (
    key
) => {
    return [
        // Subscribe
        (callback: StoreCallback) => {
            if (!subscribers[key]) {
                subscribers[key] = new Set();
            }
            subscribers[key]?.add(callback);

            return () => {
                subscribers[key]?.delete(callback);
            };
        },
        // Get snapshot,
        (): Store[keyof Store] => {
            return getStore(key);
        },
    ];
};

export { getStore, setStore, subscribeStore, syncStore };
