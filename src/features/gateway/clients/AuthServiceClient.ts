import { Injectable } from "@nestjs/common";
import CircuitBraker from "src/common/CircuitBraker";
import { CreateUserDto } from "../dtos/CreateUserDto";
import LoginDto from "../dtos/LoginDto";
import RefreshDto from "../dtos/RefreshDto";
import TokenPayloadDto from "../dtos/TokenPayloadDto";
import { UserDto } from "../dtos/UserDto";
import LoggedInDto from "../dtos/LoggedInDto";
import RefreshedTokensDto from "../dtos/RefreshedTokensDto";


@Injectable()
class AuthServiceClient {
    private braker: CircuitBraker
    constructor() {
        this.braker = new CircuitBraker({serviceName: "AuthService", timeout: 10000});
    }

    async logout(id: number): Promise<void> {
        try {
            await this.braker.execute(`${String(process.env.AUTH_SERVICE_URL)}/auth/logout/${id}`, {method: "GET"});
        } catch (error) {
            throw error;
        }
    }

    async validateToken(token: string): Promise<TokenPayloadDto> {
        try {
            const decoded: TokenPayloadDto = await this.braker.execute(`${String(process.env.AUTH_SERVICE_URL)}/auth/validate-token`, {method: "GET", data: {token}});
            return decoded;
        } catch (error) {
            throw error;
        }
    }

    async register(user: CreateUserDto): Promise<UserDto> {
        try {
            const userSaved: UserDto = await this.braker.execute(`${String(process.env.AUTH_SERVICE_URL)}/auth/register`, {method: "POST", data: user});
            return userSaved;
        } catch (error) {
            throw error;
        }
    }

    async login(user: LoginDto): Promise<LoggedInDto> {
        try {
            const res: LoggedInDto = await this.braker.execute(`${String(process.env.AUTH_SERVICE_URL)}/auth/login`, {method: "POST", data: user});
            return res;
        } catch (error) {
            throw error;
        }
    }

    async refreshTokens(token: RefreshDto): Promise<RefreshedTokensDto> {
        try {
            const tokens: RefreshedTokensDto = await this.braker.execute(`${String(process.env.AUTH_SERVICE_URL)}/auth/refresh-tokens`, {method: "POST", data: token});
            return tokens;
        } catch (error) {
            throw error;
        }
    }
}

export default AuthServiceClient;