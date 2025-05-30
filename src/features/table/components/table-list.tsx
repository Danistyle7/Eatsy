import React from "react";
import { FlatList } from "react-native";

import { TableResponse } from "../types";
import { TableListItem } from "./table-list-item";

interface TableListProps {
  data: TableResponse[];
  onEdit?: (table: TableResponse) => void;
  onScan?: (table: TableResponse) => void;
  onDelete?: (table: TableResponse) => void;
}

export function TableList({ data, ...rest }: TableListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      className="gap-2"
      renderItem={({ item }) => (
        <TableListItem table={item} listKey={item.id} {...rest} />
      )}
    />
  );
}
