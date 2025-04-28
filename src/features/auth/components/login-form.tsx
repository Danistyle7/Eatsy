import { Text, View } from "react-native";
import { Credentials } from "../schema";

interface LoginFormProps {
  loading: boolean;
  onSubmit: (credentials: Credentials) => Promise<void>;
}

export const LoginForm = ({ loading, onSubmit }: LoginFormProps) => {
  return (
    // crear un formulario en react native
    <View>
      <Text>LoginForm</Text>
    </View>
  );
};

// // Componente de login
// const LoginScreen = () => {
//   const [{ isLoading }, { login }] = useAuth();

//   const handleSubmit = async (credentials) => {
//     const token = await api.login(credentials);
//     login(token);
//   };

//   return <LoginForm loading={isLoading} onSubmit={handleSubmit} />;
// };
