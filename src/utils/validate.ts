export interface validateParams {
    value: string | number;
    mandatory ? : boolean;
    minlen ? : number;
    maxlen ? : number;
    min ? : number;
    max ? : number;
  }
  
  //validate function
 export function validate(toValidateData: validateParams) {
    let isvalid = true;
    if (toValidateData.mandatory) {
      isvalid = isvalid && toValidateData.value.toString().trim().length != 0;
    }
  
    if (typeof toValidateData.value === 'string' && toValidateData.minlen != null) {
      isvalid = isvalid && toValidateData.value.trim().length >= toValidateData.minlen
    }
  
    if (typeof toValidateData.value === 'string' && toValidateData.maxlen != null) {
      isvalid = isvalid && toValidateData.value.trim().length <= toValidateData.maxlen
    }
  
    if (typeof toValidateData.value === 'number' && toValidateData.min != null) {
      isvalid = isvalid && toValidateData.value >= toValidateData.min
    }
  
    if (typeof toValidateData.value === 'number' && toValidateData.max != null) {
      isvalid = isvalid && toValidateData.value <= toValidateData.max
    }
    return isvalid;
  }