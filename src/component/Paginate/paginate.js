import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import classnames from "classnames";
import { usePagination, DOTS } from "./usePagination";
import './pagination.scss'
const Paginate = (props) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    page,
    pageSize,
    className,
  } = props;

  const [jumpPage, setJumpPage] = useState();

  const paginationRange = usePagination({
    page,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (page === 0 || paginationRange?.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(page + 1, "next");
  };

  const onPrevious = () => {
    onPageChange(page - 1, 'prev');
  };

  const jumpToPage = () => {
    if (jumpPage && jumpPage > 0) {
      onPageChange(parseInt(jumpPage));
    }

  }

  let lastPage = paginationRange?.length > 0 && paginationRange[paginationRange?.length - 1];

  return (
    <>
      <ul
        className={classnames("pagination-container", { [className]: className })}
      >
        <li
          className={classnames("pagination-item border", {
            disabled: page === 1,
          })}
          onClick={onPrevious}
        >
          <div className="arrow left" />
        </li>
        {paginationRange?.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <li key={index} className="pagination-item dots border ">
                &#8230;
              </li>
            );
          }

          return (
            <li
              key={index}
              className={classnames("pagination-item border", {
                selected: pageNumber === page,
              })}
              // onClick={() => pageNumber !== page && onPageChange(pageNumber)}
            >
              {pageNumber}
            </li>
          );
        })}
        <li
          className={classnames("pagination-item border", {
            disabled: page === lastPage,
          })}
          onClick={onNext}
        >
          <div className="arrow right" />
        </li>
      </ul>
     
    </>
  );
};

export default React.memo(Paginate);
