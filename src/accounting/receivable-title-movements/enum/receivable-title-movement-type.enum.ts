export enum ReceivableTitleMovementType {
  Issuing = 1, // Emissão (aberto)
  Payment = 2, // Pagemento (liquidado/aberto)
  Reversal = 3, // Estorno (cancelado)
  Cancellation = 4, // Cancelamento (cancelado)
}
