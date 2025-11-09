import { UsersService } from './user.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllRecipients(req: any): Promise<import("../../common/entities/user.entity").User[]>;
}
