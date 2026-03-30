import Opossum from "opossum";
import { request, axiosOptions } from "./helpers/axioshttpHelper";

class CircuitBraker {
    public constructor({ serviceName, timeout }: { serviceName: string, timeout: number }) {
        this.serviceName = serviceName;
        this.timeout = timeout;

        this.circuitBraker = new Opossum(request, { 
            errorThresholdPercentage: 50,
            volumeThreshold: 10,
            rollingCountBuckets: 10,      
            rollingCountTimeout: 10000,
            resetTimeout: 30000,
            timeout: this.timeout, 
            name: this.serviceName
        });

        this.circuitBraker.on('open', () => console.log(`Open circuit ${this.serviceName}`));
        this.circuitBraker.on('close', () => console.log(`Closed circuit ${this.serviceName}`));
    }

    public async execute(url: string, options: axiosOptions, fallBack?: any): Promise<any> {
        try {
            if (fallBack) this.circuitBraker.fallback(() => fallBack);
            return await this.circuitBraker.fire(url, options)
        } catch (error) {
            throw error;
        }
    }

    private circuitBraker: Opossum;
    private serviceName: string;
    private timeout: number;
}

export default CircuitBraker;