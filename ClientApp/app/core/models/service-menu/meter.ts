import { Privilege } from './privilege';
import { Tariff } from './tariff';

export class Meter {
  constructor(
    public id: string,
    public name?: string,
    public tariffs?: Tariff[],
    public oldValue?: number,
    public newValue?: number,
    public amount?: number,
    public unit?: string,
    public privileges?: Privilege[]
  ) {}
}
