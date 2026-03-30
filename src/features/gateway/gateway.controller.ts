import { Body, Controller, Get, Headers, Inject, InternalServerErrorException, Param, ParseIntPipe, Post, Req, Res } from "@nestjs/common";
import AuthServiceClient from "./clients/AuthServiceClient";
import FinancesServcieClient from "./clients/FinancesServiceClient";
import { UserDto } from "./dtos/UserDto";
import type { CreateUserDto } from "./dtos/CreateUserDto";
import express from "express";
import LoggedResDto from "./dtos/LoggedResDto";
import LoggedInDto from "./dtos/LoggedInDto";
import type LoginDto from "./dtos/LoginDto";
import RefreshedTokensDto from "./dtos/RefreshedTokensDto";
import AccountDto from "./dtos/AccountDto";
import TransactionDto from "./dtos/TransactionDto";


@Controller("api/v1")
export class GatewayController {
  constructor(
    @Inject("AUTH_SERVICE_CLIENT") private readonly authServiceClient: AuthServiceClient,
    @Inject("FINANCES_SERVICE_CLIENT") private readonly financesServiceClient: FinancesServcieClient,
  ) {}

  @Post("register")
  async register(@Body() user: CreateUserDto): Promise<UserDto> {
    try {
      const savedUser: UserDto = await this.authServiceClient.register(user);
      return savedUser;
    } catch (error) {
      let err = error as Error;
      throw new InternalServerErrorException({message: err.message});
    }
  }

  @Post("login")
  async login(@Body() user: LoginDto, @Res({passthrough: true}) res: express.Response): Promise<LoggedResDto> {
    try {
      const loggedData: LoggedInDto = await this.authServiceClient.login(user);

      res.cookie("refresh_token", loggedData.refreshToken, {
        maxAge: 302400,
        secure: false, //change later
        httpOnly: true,
        sameSite: "strict"
      })

      return {accessToken: loggedData.accessToken, userInfo: loggedData.userInfo};
    } catch (error) {
      let err = error as Error;
      throw new InternalServerErrorException({message: err.message});
    }
  }

  @Get("logout/:id")
  async logout(@Param("id", ParseIntPipe)  id: number): Promise<void> {
    try {
      await this.authServiceClient.logout(id);
      return
    } catch (error) {
      let err = error as Error;
      throw new InternalServerErrorException({message: err.message});
    }
  }

  @Post("refresh-tokens")
  async refreshTokens(@Req() req: express.Request ,@Res({passthrough: true}) res: express.Response): Promise<{accessToken: string}> {
    try {
      const token: string = String(req.cookies["refresh_token"]);
      const newTokens: RefreshedTokensDto = await this.authServiceClient.refreshTokens({token});

      res.cookie("refresh_token", newTokens.refreshToken, {
        maxAge: 302400,
        secure: false, //change later
        httpOnly: true,
        sameSite: "strict"
      });

      return {accessToken: newTokens.accessToken}
    } catch (error) {
      let err = error as Error;
      throw new InternalServerErrorException({message: err.message});
    }
  }

  @Get("accounts")
  async getAccounts(@Headers("Authorization") authHeader: string): Promise<AccountDto[]> {
    try {
      console.log("se ejecuta")
      console.log(authHeader)
      const accessToken: string = authHeader.split(" ")[1].replace(/"/g, "")
      const accounts: AccountDto[] = await this.financesServiceClient.getAccounts(accessToken);
      return accounts;
    } catch (error) {
      let err = error as Error;
      throw new InternalServerErrorException({message: err.message});
    }
  }

  @Get("transactions")
  async getTransactions(@Headers("Authorization") authHeader: string): Promise<TransactionDto[]> {
    try {
      const accessToken: string = authHeader.split(" ")[1].replace(/"/g, "")
      const transactions: TransactionDto[] = await this.financesServiceClient.getTransactions(accessToken);
      return transactions;
    } catch (error) {
      let err = error as Error;
      throw new InternalServerErrorException({message: err.message});
    }
  }


}

export default GatewayController;
