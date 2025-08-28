export interface DropdownProps {
    value: any;
    label: string;
    disabled?: boolean;
}

export function getDropdownOptions(items: any[]): DropdownProps[] {
    return items.map(item => ({
      label: item.name,
      value: item.id
    }));
  }