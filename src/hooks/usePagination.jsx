import { useState } from "react";

const usePagination = ({ currentPage = 1, totalPages = 1 } = {}) => {
  const [pagination, setPagination] = useState({ currentPage, totalPages });

  const onPageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const setTotalPages = (totalPages) => {
    setPagination((prev) => ({ ...prev, totalPages }));
  };

  const resetPagination = () => {
    setPagination({ currentPage, totalPages });
  };

  return {
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    onPageChange,
    setTotalPages,
    resetPagination
  };
};

export default usePagination;