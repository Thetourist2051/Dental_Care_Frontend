import { useState, useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column, ColumnProps } from "primereact/column";
import style from "./CustomTable.module.scss";
import { v4 as uuidv4 } from "uuid";
import CustomButton from "../custom-button/CustomButton";
import { ThemeButtonProps } from "../../utils/TypescriptEnum";

interface CustomColumnProps extends ColumnProps {
  minWidth?: string;
  colkeyid?: string;
  isActionColumn?: boolean;
}

interface TableProps {
  tabledata?: any[];
  scrollHeight?: string;
  tablecolumns: CustomColumnProps[];
  actionButtonArray?: ActionButtonInterface[];
  loading?: boolean;
}

interface ActionButtonInterface extends ThemeButtonProps {
  buttonId?: string;
}

const CustomTable = ({
  tabledata = [],
  scrollHeight = "calc(100vh - 210px)",
  tablecolumns,
  actionButtonArray = [],
  loading,
}: TableProps) => {
  const [globalFilters, setGlobalFilters] = useState("");
  const [value, setValue] = useState<boolean>(false);

  const processedColumns = useMemo(
    () =>
      tablecolumns.map((column) => ({
        ...column,
        minWidth: column.minWidth ?? "180px",
        body: column?.body ?? null,
        colkeyid: column.colkeyid ?? uuidv4(),
        sortable: column.isActionColumn ? false : true,
      })),
    [tablecolumns]
  );

  const processedData = useMemo(
    () => tabledata.map((data) => ({ ...data, id: data.id ?? uuidv4() })),
    [tabledata]
  );

  const processedActions = useMemo(
    () =>
      actionButtonArray.map((action) => ({
        ...action,
        buttonId: action.buttonId ?? uuidv4(),
        type: action.type ?? "success",
      })),
    [actionButtonArray]
  );

  const onExportExcel = () => console.log("onExportExcel");

  return (
    <>
      <div className="flex justify-between items-center pb-3 table_caption">
        <div
          role="button"
          className={`${style["global-filter"]} transition relative ${
            value ? style["has-value"] : style["no-value"]
          }`}
        >
          <span
            className={`${style["filter-span"]} cursor-pointer`}
            onClick={() => setValue(!value)}
          >
            <i className="pi pi-search"></i>
          </span>

          <input
            type="text"
            value={globalFilters}
            onChange={(e) => setGlobalFilters(e.target.value)}
            className={`${style["filter-input"]} transition`}
            placeholder="Search here..."
            id="global_filter"
          />

          {globalFilters && (
            <span
              className={`${style["filter-span"]} absolute right-0 cursor-pointer transition`}
              onClick={() => setGlobalFilters("")}
            >
              <i className="pi pi-times text-[12px]"></i>
            </span>
          )}
        </div>
        <div className={style["action_section"] + " flex gap-x-2"}>
          {processedActions?.map((action) => {
            return (
              <>
                <CustomButton
                  key={action.buttonId}
                  {...action}
                  onSubmitEvent={action.onSubmitEvent}
                />
              </>
            );
          })}
          <CustomButton
            label="Excel"
            type="success"
            icon="file-excel"
            size="md"
            iconPosition="left"
            onSubmitEvent={() => onExportExcel()}
          />
        </div>
      </div>
      <DataTable
        value={processedData}
        className="global-table-style rounded-tl-none rounded-tr-none"
        size="large"
        showGridlines
        stripedRows
        scrollable
        scrollHeight={scrollHeight}
        reorderableColumns
        globalFilter={globalFilters}
        paginator
        rows={15}
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginatorClassName="custom_paginator_class"
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        removableSort
        loading={loading}
      >
        {processedColumns.map((col) => (
          <Column
            {...col}
            key={col.colkeyid}
            headerStyle={{ minWidth: col.minWidth }}
          />
        ))}
      </DataTable>
    </>
  );
};

export default CustomTable;
