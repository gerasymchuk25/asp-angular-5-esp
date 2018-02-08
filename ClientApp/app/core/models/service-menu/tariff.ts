export class Tariff {
  constructor(
    public name: string,
    public tariffValue: number,
    public rangeFrom: number,
    public rangeTo: number
  ) {}
}
