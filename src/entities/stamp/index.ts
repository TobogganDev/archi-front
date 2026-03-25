export { addStamp } from './api/stamp.api';
export type { CustomerStampStat, Stamp, StampInsert, StampWithProgram, StampWithRelations } from './model/stamp.types';
export { useActiveStampsCount, useStampsByCustomer, useStampsByMerchant, useStampStatsByMerchant } from './model/useStamps';

