import { components } from './index'

export type ApiRecall = components['schemas']['Recall']

type RecallType = { code: string; description: string }

const RecallTypes = {
  STANDARD_RECALL: { code: 'STANDARD_RECALL', description: 'Standard' },
  FOURTEEN_DAY_FIXED_TERM_RECALL: {
    code: 'FOURTEEN_DAY_FIXED_TERM_RECALL',
    description: '14-day fixed term',
  },
  TWENTY_EIGHT_DAY_FIXED_TERM_RECALL: {
    code: 'TWENTY_EIGHT_DAY_FIXED_TERM_RECALL',
    description: '28-day fixed term',
  },
  HDC_STANDARD_RECALL: { code: 'HDC_STANDARD_RECALL', description: 'Standard recall from HDC' },
  HDC_FOURTEEN_DAY_RECALL: {
    code: 'HDC_FOURTEEN_DAY_RECALL',
    description: '14-day fixed term from HDC',
  },
  HDC_TWENTY_EIGHT_DAY_RECALL: {
    code: 'HDC_TWENTY_EIGHT_DAY_RECALL',
    description: '28-day fixed term from HDC',
  },
  HDC_CURFEW_VIOLATION_RECALL: {
    code: 'HDC_CURFEW_VIOLATION_RECALL',
    description: 'HDC recalled from curfew conditions',
  },
  HDC_INABILITY_TO_MONITOR_RECALL: {
    code: 'HDC_CURFEW_VIOLATION_RECALL',
    description: 'HDC recalled from inability to monitor',
  },
} as const

export { RecallTypes, RecallType }

export interface Recall {
  recallId: string
  recallDate: Date
  returnToCustodyDate: Date
  ual: string
  recallType: RecallType
}
