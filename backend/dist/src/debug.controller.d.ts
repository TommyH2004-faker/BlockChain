export declare class DebugController {
    debugAuth(req: any): Promise<{
        message: string;
        user: any;
    }>;
    debugPublic(): Promise<{
        message: string;
        timestamp: string;
    }>;
}
