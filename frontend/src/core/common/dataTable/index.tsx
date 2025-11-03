import React, { useEffect, useState, useMemo } from "react";
import { Table } from "antd";
import type { DatatableProps } from "../../common/data/interface/index";

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface ExtendedDatatableProps extends DatatableProps {
  pagination?: PaginationInfo;
  onPageChange?: (page: number, pageSize?: number) => void;
  onSearch?: (value: string) => void;
  pageSize?: number;
  currentPage?: number;
  loading?: boolean;
}

const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = ['10', '20', '50', '100'];

const Datatable: React.FC<ExtendedDatatableProps> = ({ 
  columns, 
  dataSource = [], 
  Search = false,
  pagination,
  onPageChange,
  onSearch,
  pageSize = DEFAULT_PAGE_SIZE,
  loading = false
}) => {
  const [searchText, setSearchText] = useState<string>("");

  // Determine if we're using server-side or client-side operations
  const isServerSide = Boolean(pagination);

  // Filter data locally only when not using server-side pagination
  const filteredDataSource = useMemo(() => {
    if (isServerSide || !searchText.trim()) {
      return dataSource;
    }

    return dataSource.filter((record) =>
      Object.values(record).some((field) =>
        String(field).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [dataSource, searchText, isServerSide]);

  // Handle search input changes
  const handleSearch = (value: string) => {
    setSearchText(value);
    
    if (isServerSide && onSearch) {
      onSearch(value);
    }
  };

  // Handle pagination changes
  const handlePageChange = (page: number, size?: number) => {
    onPageChange?.(page, size || pageSize);
  };

  // Handle page size changes
  const handlePageSizeChange = (current: number, size: number) => {
    onPageChange?.(current, size); // Reset to first page when changing page size
  };

  // Configure pagination settings
  const paginationConfig = useMemo(() => {
    if (isServerSide && pagination) {
      return {
        current: pagination.currentPage,
        total: pagination.totalCourses,
        pageSize,
        showSizeChanger: true,
        showTotal: (total: number, range: [number, number]) => 
          `Showing ${range[0]}-${range[1]} of ${total} entries`,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
        onChange: handlePageChange,
        onShowSizeChange: handlePageSizeChange,
        nextIcon: <i className="fas fa-angle-right" />,
        prevIcon: <i className="fas fa-angle-left" />,
        className: "custom-pagination"
      };
    }

    // Client-side pagination or default settings
    return {
      showSizeChanger: true,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      nextIcon: <i className="fas fa-angle-right" />,
      prevIcon: <i className="fas fa-angle-left" />,
      showTotal: (total: number, range: [number, number]) => 
        `Showing ${range[0]}-${range[1]} of ${total} entries`,
      className: "custom-pagination"
    };
  }, [isServerSide, pagination, pageSize, handlePageChange, handlePageSizeChange]);

  // Reset search when data source changes (for server-side scenarios)
  useEffect(() => {
    if (isServerSide) {
      setSearchText("");
    }
  }, [dataSource, isServerSide]);

  return (
    <div className="custom-table antd-custom-table">
      {Search && (
        <div className="table-search mb-3">
          <div className="input-icon">
            <span className="input-icon-addon">
              <i className="isax isax-search-normal-14" />
            </span>
            <input 
              type="search" 
              className="form-control form-control-md w-auto float-end" 
              value={searchText} 
              placeholder="Search courses..." 
              onChange={(e) => handleSearch(e.target.value)} 
              aria-label="Search table data"
            />
          </div>
        </div>
      )}
      
      <Table
        className="table datanew dataTable no-footer"
        columns={columns}
        rowHoverable={false}
        dataSource={isServerSide ? dataSource : filteredDataSource}
        pagination={paginationConfig}
        loading={loading}
      />
    </div>
  );
};

export default Datatable;