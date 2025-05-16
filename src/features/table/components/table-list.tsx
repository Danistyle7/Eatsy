import React from "react";
import { FlatList } from "react-native";

import { TableResponse } from "../types";
import { TableListItem } from "./table-list-item";

export function TableList({ data }: { data: TableResponse[] }) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      className="gap-2"
      renderItem={({ item }) => (
        <TableListItem
          table={item}
          listKey={item.id}
          onScan={(t) => console.log("Escanear mesa", t.id)}
          onDelete={(t) => console.log("Eliminar mesa", t.id)}
        />
      )}
    />
  );
}
