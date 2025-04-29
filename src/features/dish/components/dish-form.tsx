import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { dishCreateSchema } from "@/features/dish/schema";
import { ImageUploader } from "@/features/file/components/input-uploader";
import { useUploadFile } from "@/features/file/hooks/use-upload-file";
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
import { DishCreate } from "../types";
import { getDishCategories, getDishTypes } from "../utils";
import { ApiError } from "@/shared/lib/api/errors";

interface DishFormProps {
  onSubmit: (values: DishCreate) => Promise<void>;
  isPending: boolean;
  defaultValues?: DishCreate;
}

export const DishForm = ({
  onSubmit,
  isPending,
  defaultValues,
}: DishFormProps) => {
  const dishCategories = getDishCategories();
  const dishTypes = getDishTypes();
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();

  const form = useForm({
    resolver: zodResolver(dishCreateSchema),
    defaultValues: defaultValues || {
      name: "",
      description: "",
      price: 0,
      isAvailable: true,
      category: dishCategories[0].value,
      type: dishTypes[0].value,
      imageUrl: "",
      prepTime: 0,
    },
  });

  const handleSubmit = async (values: DishCreate) => {
    try {
      const imageUrl = await uploadFile(values.imageUrl);
      onSubmit({ ...values, imageUrl });
    } catch (error) {
      if (error instanceof ApiError)
        console.error(`${error.code}: ${error.message}`);
      else console.error("Error al subir imagen", error);
    }
  };

  return (
    <Form {...form}>
      <View className="p-6 bg-[#fffaf3] rounded-3xl shadow-lg">
        <Text className="text-2xl font-semibold text-[#3e2f1c] mb-4">
          🌿 Añadir un nuevo plato
        </Text>

        <FormField
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Select
                  className="rounded-2xl bg-[#f8f4ef] text-[#5e4632]"
                  items={dishTypes}
                  selectedValue={field.value}
                  onValueChange={field.onChange}
                  placeholder="Selecciona un tipo"
                />
              </FormControl>
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

        <FormField
          name="isAvailable"
          render={({ field }) => (
            <FormItem className="flex-row justify-between items-center">
              <View>
                <FormLabel className="mb-0">Disponible?</FormLabel>
                <FormDescription>
                  Activa esto para mostrarlo en el menu
                </FormDescription>
              </View>
              <FormControl>
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  className="rounded-2xl bg-[#f8f4ef]"
                  accessibilityLabel="Disponible?"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          title={
            form.formState.isSubmitting || isPending || isUploading
              ? "📸 Subiendo..."
              : "🍃 Guardar Plato"
          }
          onPress={form.handleSubmit(handleSubmit)}
          className="bg-[#f4a261] rounded-full py-3 shadow-md active:scale-95 transition"
        />
      </View>
    </Form>
  );
};
