export interface ShippingMethod {
  carrier_code: string;
  carrier_title: string;
  method_code: string;
  method_title: string;
  price_incl_tax: number;
  price_excl_tax: number;
  amount: number;
  base_amount: number;
  available: boolean;
  extension_attributes: any;
  error_message: string;
}
