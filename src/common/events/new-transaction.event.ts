export class NewTransactionEvent {
  constructor(
    public readonly email: string,
    public readonly auto_id: number,
    public readonly id: string,
    public readonly source_id: string,
    public readonly source_type: string,
    public readonly method: string,
    public readonly from_user_id: string,
    public readonly to_user_id: string,
    public readonly amount: number,
    public readonly fee: number,
    public readonly note: string,
    public readonly status: string,
    public readonly created_at: string,
    public readonly from_address: string,
    public readonly to_address: string,
    public readonly network: string,
    public readonly txid_url: string,
    public readonly updated_at: string,
    public readonly payment_settled: string,
  ) {}
}
