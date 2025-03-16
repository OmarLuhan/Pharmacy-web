import { Button, Checkbox, Table as FBTable, Pagination, Spinner } from "flowbite-react";
import { formatDate } from "../utils/utils";

import {
  PencilSquareIcon, TrashIcon, UserIcon
} from '@heroicons/react/24/solid';

const Table = ({
  columnProperties,
  data,
  pagination = true,
  currentPage = 0,
  totalPages = 0,
  onPageChange,
  fnEdit,
  fnDelete,
  fnActions = [],
  positionActions = "end",
  isLoading,
}) => {
  return (
    <div className="overflow-x-auto">
      <FBTable hoverable>
        <FBTable.Head className="bg-gray-100 ">
          <FBTable.HeadCell className="p-4">
            <Checkbox />
          </FBTable.HeadCell>
          {columnProperties.map(({ name }, i) => (
            <FBTable.HeadCell key={`headCell${i}`}>{name}</FBTable.HeadCell>
          ))}
          <FBTable.HeadCell>
            <span>Acciones</span>
          </FBTable.HeadCell>
        </FBTable.Head>
        {isLoading ? (
          <FBTable.Body className="divide-y">
            <FBTable.Row>
              <FBTable.Cell colSpan={columnProperties.length + 3} className="text-center">
                <div className="flex justify-center items-center gap-20 py-6">
                  {Array.from({ length: columnProperties.length + 3}).map((_, index) => (
                    <Spinner key={`spinner-${index}`} />
                  ))}
                </div>
              </FBTable.Cell>
            </FBTable.Row>
          </FBTable.Body>
        ) : (
          <FBTable.Body className="divide-y">
            {data.map((row, i) => (
              <FBTable.Row
                key={`row${i}`}
                className="bg-white "
              >
                <FBTable.Cell className="p-4">
                  <Checkbox />
                </FBTable.Cell>
                {columnProperties.map(({ property, type }, j) => {
                  if (type === "user") {
                    return (
                      <FBTable.Cell
                        key={`cell${j}`}
                        className="flex items-center p-4 mr-12 space-x-6 whitespace-nowrap"
                      >
                        {row[property["photo"]] ? (
                          <img
                            className="w-10 h-10 rounded-full"
                            src={row[property["photo"]]}
                          />
                        ) : (
                          <UserIcon className="w-10 h-10" />
                        )}
                        <div className="text-sm font-normal text-gray-500 ">
                          <div className="text-base font-semibold text-gray-900 ">
                            {row[property["fullName"]]}
                          </div>
                          <div className="text-sm font-normal text-gray-500 ">
                            {row[property["email"]]}
                          </div>
                        </div>
                      </FBTable.Cell>
                    );
                  }

                  if (type === "date") {
                    return (
                      <FBTable.Cell key={`cell${j}`}>
                        {formatDate(new Date(row[property]), "DD/MM/YYYY")}
                      </FBTable.Cell>
                    );
                  }

                  if (j === 1) {
                    return (
                      <FBTable.Cell
                        key={`cell${j}`}
                        className="whitespace-nowrap font-medium text-gray-900"
                      >
                        {row[property]}
                      </FBTable.Cell>
                    );
                  }



                  if (type === "boolean") {
                    if (row[property]) {
                      return (
                        <FBTable.Cell key={`cell${j}`}>
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>{" "}
                            Activo
                          </div>
                        </FBTable.Cell>
                      );
                    } else {
                      return (
                        <FBTable.Cell key={`cell${j}`}>
                          <div className="flex items-center">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-400 mr-2"></div>{" "}
                            Desactivo
                          </div>
                        </FBTable.Cell>
                      );
                    }
                  }

                  return (
                    <FBTable.Cell key={`cell${j}`}>{row[property]}</FBTable.Cell>
                  );
                })}
                <FBTable.Cell className="flex gap-4">
                  {positionActions === "start" &&
                    fnActions.map(({ name, fn }, i) => {
                      return (
                        <Button
                          key={`fn${name}-${i}`}
                          size="sm"
                          onClick={() => {
                            fn({ ...row });
                          }}
                        >
                          {name}
                        </Button>
                      );
                    })}
                  {fnEdit && (
                    <Button
                      size="sm"
                      onClick={() => {
                        fnEdit({ ...row });
                      }}
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </Button>
                  )}
                  {fnDelete && (
                    <Button
                      color="failure"
                      size="sm"
                      onClick={() => {
                        fnDelete({ ...row });
                      }}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </Button>
                  )}
                  {positionActions === "end" &&
                    fnActions.map(({ name, fn }, i) => {
                      return (
                        <Button
                          className="bg-cyan-600"
                          key={`fn${name}-${i}`}
                          size="sm"
                          onClick={() => {
                            fn({ ...row });
                          }}
                        >
                          {name}
                        </Button>
                      );
                    })}
                </FBTable.Cell>
              </FBTable.Row>
            ))}
          </FBTable.Body>
        )}
      </FBTable>
      {pagination && (
        <div className="flex overflow-x-auto sm:justify-center p-6">
          <Pagination
            layout="pagination"
            currentPage={currentPage}
            totalPages={totalPages}
            showIcons
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Table;
