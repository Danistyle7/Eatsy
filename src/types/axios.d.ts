// En algún archivo de tipos (ej: `src/types/axios.d.ts`)
import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}
