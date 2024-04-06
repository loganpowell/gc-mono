declare enum Ports {
    APP = "app",
    MEDIC = "medic",
    ADMIN = "admin"
}
type Constants = {
    ports: {
        [key in Ports]: number;
    };
};
export type Config = {
    constants: Constants;
    isLocal: boolean;
};
export declare function getConfig(): Promise<Config>;
export {};
//# sourceMappingURL=index.d.ts.map