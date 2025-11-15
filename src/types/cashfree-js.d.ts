declare module '@cashfreepayments/cashfree-js' {
  type CashfreeMode = 'sandbox' | 'production'
  interface LoadOptions {
    mode: CashfreeMode
  }
  interface CheckoutOptions {
    paymentSessionId: string
    redirectTarget?: '_modal' | '_self'
  }
  interface CashfreeInstance {
    checkout: (options: CheckoutOptions) => Promise<any>
  }
  export function load(options: LoadOptions): Promise<CashfreeInstance>
}
