import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrgSelectorProps {
  organization?: {
    id: string;
    name: string;
  };
}

export default function OrgSelector({ organization }: OrgSelectorProps) {
  // For now, just display the current organization
  // In the future, this could allow switching between multiple orgs for super admins
  return (
    <Select value={organization?.id} disabled>
      <SelectTrigger className="bg-primary-700 text-white border-0 min-w-[150px]" data-testid="select-organization">
        <SelectValue placeholder="Select Organization" />
      </SelectTrigger>
      <SelectContent>
        {organization && (
          <SelectItem value={organization.id} data-testid={`org-option-${organization.id}`}>
            {organization.name}
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
