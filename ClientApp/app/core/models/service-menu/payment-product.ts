import { Meter } from './meter';

export class Period {
  constructor(
    public dateFrom: string,
    public dateTo: string
  ) {}
}

export class PaymentProduct {
  constructor(
    public productId: string,
    public amount: number,
    public period?: Period,
    public meters?: Meter[],
  ) {}
}
