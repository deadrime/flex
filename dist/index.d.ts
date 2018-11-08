interface InterfaceState {
    [key: string]: any;
}
declare type Listener = ((newState: any, prevState: any) => any);
interface InterfaceMutations<T> {
    [method: string]: (state: T, args?: any) => void;
}
interface InterfacePersisted {
    property: string;
    set: (key: string, value: any) => any;
    get: (key: string) => any;
    listener?: (value: any, prevValue: any) => {};
}
interface InterfaceStore<T> {
    state: T;
    mutations: InterfaceMutations<T>;
    persisted?: (string | InterfacePersisted)[];
}
export declare class Store<T extends InterfaceState> {
    state: T;
    private mutations;
    private listeners;
    private persisted?;
    constructor({ state, mutations, persisted }: InterfaceStore<T>);
    run(action: string, args?: any): any;
    getState(): InterfaceState;
    subscribe(newListener: Listener): void;
    unsubscribe(cb: () => any): void;
}
export default Store;
