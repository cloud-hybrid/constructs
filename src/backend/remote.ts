import { HttpBackend as HTTP } from "cdktf";

interface Backend {
    readonly address?: string | undefined;
    readonly lockAddress?: string | undefined;
    readonly lockMethod?: string | undefined;
    readonly unlockAddress?: string | undefined;
    readonly unlockMethod?: string | undefined;
    readonly username?: string | undefined;
    readonly password?: string | undefined;
    readonly skipCertVerification?: boolean | undefined;
}

class Remote implements Backend {
    public readonly address: Backend["address"];
    public readonly lockAddress: Backend["lockAddress"];
    public readonly lockMethod: Backend["lockMethod"];
    public readonly password: Backend["password"];
    public readonly skipCertVerification: Backend["skipCertVerification"];
    public readonly unlockAddress: Backend["unlockAddress"];
    public readonly unlockMethod: Backend["unlockMethod"];
    public readonly username: Backend["username"];

    constructor(settings: Backend) {
        this.address = settings.address;
        this.lockAddress = settings.lockAddress;
        this.lockMethod = settings.lockMethod;
        this.password = settings.password;
        this.skipCertVerification = settings.skipCertVerification;
        this.unlockAddress = settings.unlockAddress;
        this.unlockMethod = settings.unlockMethod;
        this.username = settings.username;
    }
}

export { Remote, Backend, HTTP };

export default Remote;