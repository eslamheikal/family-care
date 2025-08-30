export class Endpoints {
    static readonly Generic = {
        Actions: {
            GetAll: 'all',
            GetPaged: 'paged',
            Get: (id: string | number) => `/${id}`,
            Create: 'create',
            Update: 'update',
            Delete: (id: string | number) => `/${id}`,
        }
    };

    static readonly AUTH = {
        Controller: 'auth',
        Actions: {
            Login: 'login',
            RefreshToken: 'refresh-token',
            ForgetPassword: (email: string) => `forget-password/${email}`,
        }
    };

    static readonly USERS = {
        Controller: 'users',
        Actions: {
            Paged: `paged`,
            Add: 'add',
            Activate: (id: string | number) => `activate/${id}`,
            Deactivate: (id: string | number) => `deactivate/${id}`,
        }
    };

    static readonly ATTACHMENTS = {
        Controller: 'attachment',
        Actions: {
            View: (fileName: string) => `view/${encodeURIComponent(fileName)}`,
            Download: (fileName: string) => `download/${encodeURIComponent(fileName)}`,
        }
    };

}