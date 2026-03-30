import { Injectable } from "@nestjs/common";
import CircuitBraker from "src/common/CircuitBraker";
import AccountDto from "../dtos/AccountDto";
import TransactionDto from "../dtos/TransactionDto";


@Injectable()
class FinancesServcieClient {
    private braker: CircuitBraker

    constructor() {
        this.braker = new CircuitBraker({serviceName: "FinancesService", timeout: 10000});
    }

    async getAccounts(accessToken: string): Promise<Array<AccountDto>> {
        try {
            const accounts: Array<AccountDto> = await this.braker.execute(`${String(process.env.FINANCES_SERVICE_URL)}/finances/accounts`, {method: "GET", data: {token: accessToken}});
            return accounts;
        } catch (error) {
            throw error;
        }
    }

    async getTransactions(accessToken: string): Promise<Array<TransactionDto>> {
        try {
            const transactions: Array<TransactionDto> = await this.braker.execute(`${String(process.env.FINANCES_SERVICE_URL)}/finances/transactions`, {method: "GET", data: {token: accessToken}});
            return transactions;
        } catch (error) {
            throw error;
        }
    }


    
}

export default FinancesServcieClient;