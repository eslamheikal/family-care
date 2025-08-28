export class TableColumn {
    title!: string;
    field!: string;
    show?: boolean;
    type?: 'time' | 'text' | 'date' | 'number' | 'boolean';
    onClick?: ((row: any) => void ) | null;
}