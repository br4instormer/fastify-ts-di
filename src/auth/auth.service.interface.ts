import { TokenDto } from "./dto/token.dto";
import { Tokens } from "./types";

export interface IAuthService {
  refresh(payload: TokenDto, signFn: Function): Promise<Tokens | null>;
}
