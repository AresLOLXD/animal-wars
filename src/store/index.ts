import defaultStore, { Store } from "./defaultStore";

export type StoreCallback<T extends Store[keyof Store] = Store[keyof Store]> = (
    value?: T
) => void;

const subscribers: Partial<Record<keyof Store, Set<StoreCallback<any>>>> = {};
const syncedStore: Store = { ...defaultStore };

const getStore = <T extends Store[keyof Store] = Store[keyof Store]>(
    key: keyof Store
) => {
    return syncedStore[key] as T;
};
const setStore = <T extends keyof Store>(key: T, value: Store[T]) => {
    syncedStore[key] = value;
    if (subscribers[key]) {
        subscribers[key]?.forEach((callback) => callback(value));
    }
};

const subscribeStore = <T extends Store[keyof Store] = Store[keyof Store]>(
    key: keyof Store,
    callback: StoreCallback<T>
) => {
    if (!subscribers[key]) {
        subscribers[key] = new Set();
    }
    subscribers[key]?.add(callback);

    return () => {
        subscribers[key]?.delete(callback);
    };
};

const syncStore: <T extends Store[keyof Store] = Store[keyof Store]>(
    key: keyof Store
) => [(callback: StoreCallback) => () => void, () => T] = <
    T extends Store[keyof Store] = Store[keyof Store]
>(
    key: keyof Store
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
        (): T => {
            return getStore(key);
        },
    ];
};

export { getStore, setStore, subscribeStore, syncStore };
