import {
  FEE_RATE_MIN_CONFIRMATION_TARGET,
  FEE_RATE_MAX_CONFIRMATION_TARGET,
} from "./const";

export const getFeeRatesRange = (feeEstimates) => {
  if (feeEstimates && Object.keys(feeEstimates).length > 0) {
    return {
      min: feeEstimates[FEE_RATE_MIN_CONFIRMATION_TARGET],
      max:
        feeEstimates[FEE_RATE_MAX_CONFIRMATION_TARGET] >
        feeEstimates[FEE_RATE_MIN_CONFIRMATION_TARGET]
          ? feeEstimates[FEE_RATE_MAX_CONFIRMATION_TARGET]
          : feeEstimates[FEE_RATE_MIN_CONFIRMATION_TARGET] + 1,
    };
  }
  return { min: 1, max: 10 };
};
