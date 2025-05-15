import { FieldValues, UseFormReturn } from "react-hook-form";
import { ScrollView, View } from "react-native";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { getTableStatuses } from "../utils";

interface TableFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
}

export const TableForm = <T extends FieldValues>({
  form,
}: TableFormProps<T>) => {
  const tableStatuses = getTableStatuses();

  return (
    <Form {...form}>
      <ScrollView
        className="flex-1 min-h-fit"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la mesa</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChangeText={field.onChange}
                  placeholder="Ej: Mesa 1"
                  maxLength={150}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidad</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChangeText={(value) => field.onChange(Number(value))}
                  placeholder="Ej: 10"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <View className="flex-row gap-4 mb-2">
                {tableStatuses.map((status) => (
                  <Button
                    key={status.value}
                    title={status.label}
                    onPress={() => field.onChange(status.value)}
                    variant={
                      field.value === status.value ? "default" : "outline"
                    }
                    size="sm"
                  />
                ))}
              </View>
              <FormMessage />
            </FormItem>
          )}
        />
      </ScrollView>
    </Form>
  );
};
