import Link from "next/link";
import { Currency } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatCurrency } from "@/lib/currency";
import { SalaryRecord } from "@/types";

interface SalaryTableProps {
  salaries: SalaryRecord[];
}

export function SalaryTable({ salaries }: SalaryTableProps) {
  return (
    <Table>
      <TableHead>
        <TableHeader>Company</TableHeader>
        <TableHeader>Role</TableHeader>
        <TableHeader>Level</TableHeader>
        <TableHeader>Location</TableHeader>
        <TableHeader>Experience</TableHeader>
        <TableHeader>Base Salary</TableHeader>
        <TableHeader>Stock</TableHeader>
        <TableHeader>Total Comp</TableHeader>
      </TableHead>
      <TableBody>
        {salaries.map((salary) => (
          <TableRow key={salary.id}>
            <TableCell>
              <Link
                href={`/companies/${salary.company.slug}`}
                className="font-semibold text-foreground hover:text-[#ff5a5f] transition-colors"
              >
                {salary.company.name}
              </Link>
            </TableCell>
            <TableCell className="font-medium text-gray-800">{salary.role}</TableCell>
            <TableCell>
              <Badge level={salary.level} />
            </TableCell>
            <TableCell className="text-gray-700">{salary.location}</TableCell>
            <TableCell className="text-gray-700">{salary.experience_years} yrs</TableCell>
            <TableCell className="font-medium text-gray-900">
              {formatCurrency(
                Number(salary.base_salary),
                salary.currency as Currency
              )}
            </TableCell>
            <TableCell className="font-medium text-gray-900">
              {formatCurrency(
                Number(salary.stock),
                salary.currency as Currency
              )}
            </TableCell>
            <TableCell>
              <span className="text-base font-bold text-[#ff5a5f]">
                {formatCurrency(
                  Number(salary.total_compensation),
                  salary.currency as Currency
                )}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
