import { FieldValues, UseFormReturn } from "react-hook-form";
import { ScrollView, View } from "react-native";

import { ImageUploader } from "@/features/file/components/input-uploader";
import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import { getDishCategories, getDishTypes } from "../utils";

interface DishFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
}

export const DishForm = <T extends FieldValues>({ form }: DishFormProps<T>) => {
  const dishCategories = getDishCategories();
  const dishTypes = getDishTypes();

  return (
    <Form {...form}>
      <ScrollView
        className="flex-1 min-h-fit"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <FormField
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <View className="flex-row gap-4">
                {dishTypes.map((type) => (
                  <Button
                    key={type.value}
                    title={type.label}
                    onPress={() => field.onChange(type.value)}
                    variant={field.value === type.value ? "default" : "outline"}
                    size="sm"
                  />
                ))}
              </View>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Select
                  items={dishCategories}
                  selectedValue={field.value}
                  onValueChange={field.onChange}
                  placeholder="Selecciona una categoría"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del plato</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChangeText={field.onChange}
                  placeholder="Ej: Lomo saltado"
                  maxLength={150}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChangeText={field.onChange}
                  placeholder="Descripción del plato"
                  multiline
                  numberOfLines={3}
                  maxLength={500}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                <ImageUploader value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <View className="flex-row gap-4">
          <FormField
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Precio (Bs.)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej: 25.00"
                    keyboardType="numeric"
                    onChangeText={(value) => field.onChange(Number(value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="prepTime"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Tiempo (min)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ej: 30"
                    keyboardType="numeric"
                    onChangeText={(value) => field.onChange(Number(value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </View>

        <FormField
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex-row justify-between items-center">
              <View>
                <FormLabel className="mb-0">¿Disponible?</FormLabel>
                <FormDescription>
                  Activa esto para mostrarlo en el menú.
                </FormDescription>
              </View>
              <FormControl>
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  accessibilityLabel="¿Disponible?"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </ScrollView>
    </Form>
  );
};
