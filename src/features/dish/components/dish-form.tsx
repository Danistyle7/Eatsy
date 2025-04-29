import { useForm } from "react-hook-form";
import { View, Text } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { dishCreateSchema } from "@/features/dish/schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { getDishCategories } from "../utils";
import { Button } from "@/shared/components/ui/button";
import { ImageUploader } from "@/shared/components/ui/input-uploader";

interface DishFormProps {
  onSubmit: (values: any) => void;
}

export const DishForm = ({ onSubmit }: DishFormProps) => {
  const dishCategories = getDishCategories();

  const form = useForm({
    resolver: zodResolver(dishCreateSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "APPETIZER",
      imageUrl: "",
      prepTime: 30,
    },
  });

  return (
    <Form {...form}>
      <View className="p-6 bg-[#fffaf3] rounded-3xl shadow-lg">
        <Text className="text-2xl font-semibold text-[#3e2f1c] mb-4">
          🌿 Añadir un nuevo plato
        </Text>

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

        <View className="flex-row gap-4">
          <FormField
            name="price"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Precio (S/.)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Select
                  className="rounded-2xl bg-[#f8f4ef] text-[#5e4632]"
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
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imagen</FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value}
                  onChange={field.onChange}
                  className="rounded-2xl bg-[#f8f4ef]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          title="🍃 Guardar Plato"
          onPress={form.handleSubmit(onSubmit)}
          className="bg-[#f4a261] rounded-full py-3 shadow-md active:scale-95 transition"
        />
      </View>
    </Form>
  );
};
