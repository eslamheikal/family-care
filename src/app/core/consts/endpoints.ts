export class Endpoints {
    static readonly Generic = {
        Actions: {
            GetAll: 'all',
            GetPaged: 'paged',
            Get: (id: string | number) => `get&id=${id}`,
            Create: 'create',
            Update: 'update',
            Delete: (id: string | number) => `delete&id=${id}`,
            Activate: (id: string | number) => `activate&id=${id}`,
            Deactivate: (id: string | number) => `deactivate&id=${id}`,
        }
    };

    static readonly AUTH = {
        Controller: 'auth',
        Actions: {
            Login: 'login',
            RefreshToken: 'refresh-token',
            ForgetPassword: (email: string) => `forget-password&email=${email}`,
        }
    };

    static readonly USERS = {
        Controller: 'users',
        Actions: {
            FamilyParents: `parents`,
            FamilyMembers: (parentId: number) => `members&parentId=${parentId}`,
            Get: (id: number) => `get&id=${id}`,
        }
    };

    static readonly ATTACHMENTS = {
        Controller: 'attachment',
        Actions: {
            View: (fileName: string) => `view&fileName=${encodeURIComponent(fileName)}`,
            Download: (fileName: string) => `download&fileName=${encodeURIComponent(fileName)}`,
        }
    };

}