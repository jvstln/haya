"use client";

import { flexRender, type Table } from "@tanstack/react-table";
import React from "react";
import { cn } from "@/lib/utils";

interface DataTableResponsiveProps<TData> {
  table: Table<TData>;
  classNames?: Partial<
    Record<
      | "root"
      | "card"
      | "cardHeader"
      | "cardContent"
      | "cardRow"
      | "cardLabel"
      | "cardValue",
      string
    >
  >;
}

export function DataTableResponsive<TData>({
  table,
  classNames = {},
}: DataTableResponsiveProps<TData>) {
  // Get all flat headers to lookup headers by column ID
  const headers = table.getFlatHeaders();
  const headerMap = React.useMemo(() => {
    return new Map(headers.map((h) => [h.column.id, h]));
  }, [headers]);

  const rows = table.getRowModel().rows;

  return (
    <div className={cn("flex flex-col gap-4", classNames.root)}>
      {rows.map((row) => {
        const cells = row.getVisibleCells();
        // Separate the cells: first cell as header preview, last cell as badge/action, middle as details
        const headerCell = cells[0];
        const actionCell = cells.length > 1 ? cells[cells.length - 1] : null;
        const detailCells = cells.slice(
          1,
          cells.length - (cells.length > 1 ? 1 : 0),
        );

        // Get header labels for the top part
        const headerCol = headerCell
          ? headerMap.get(headerCell.column.id)
          : null;
        const actionCol = actionCell
          ? headerMap.get(actionCell.column.id)
          : null;

        return (
          <div
            key={row.id}
            className={cn(
              "flex flex-col gap-3 rounded-xl border border-secondary bg-muted/20 p-4 transition-all hover:bg-muted/30",
              classNames.card,
            )}
          >
            {/* Card Header Section: Primary cell + Status/Badge cell */}
            {(headerCell || actionCell) && (
              <div
                className={cn(
                  "flex items-start justify-between gap-4 border-border/20 border-b pb-3",
                  classNames.cardHeader,
                )}
              >
                {headerCell && (
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    {headerCol && (
                      <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                        {flexRender(
                          headerCol.column.columnDef.header,
                          headerCol.getContext(),
                        )}
                      </span>
                    )}
                    <div className="truncate font-medium text-sm text-white">
                      {flexRender(
                        headerCell.column.columnDef.cell,
                        headerCell.getContext(),
                      )}
                    </div>
                  </div>
                )}
                {actionCell && (
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {actionCol && (
                      <span className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                        {flexRender(
                          actionCol.column.columnDef.header,
                          actionCol.getContext(),
                        )}
                      </span>
                    )}
                    <div>
                      {flexRender(
                        actionCell.column.columnDef.cell,
                        actionCell.getContext(),
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Card Body Section: Detailed rows */}
            {detailCells.length > 0 && (
              <div
                className={cn("flex flex-col gap-2.5", classNames.cardContent)}
              >
                {detailCells.map((cell) => {
                  const header = headerMap.get(cell.column.id);
                  if (!header) return null;

                  return (
                    <div
                      key={cell.id}
                      className={cn(
                        "flex items-center justify-between gap-4 text-xs",
                        classNames.cardRow,
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 font-medium text-muted-foreground",
                          classNames.cardLabel,
                        )}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </span>
                      <div
                        className={cn(
                          "max-w-[70%] break-words text-right font-medium text-white",
                          classNames.cardValue,
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
