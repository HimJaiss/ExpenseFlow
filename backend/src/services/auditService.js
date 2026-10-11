export function auditEvent(message, voucher, actor) {
  console.log(JSON.stringify({ at: new Date().toISOString(), event: message, voucher: voucher?.voucherNumber, actor: actor?.email }));
}
