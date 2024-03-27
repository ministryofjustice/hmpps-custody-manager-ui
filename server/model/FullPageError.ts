import FullPageErrorType from './FullPageErrorType'

class FullPageError extends Error {
  errorKey: FullPageErrorType

  status: number

  static notInCaseLoadError(): FullPageError {
    const error = new FullPageError('Prisoner is not in caseload')
    error.errorKey = FullPageErrorType.NOT_IN_CASELOAD
    error.status = 404
    return error
  }

  static prisonerOutError(): FullPageError {
    const error = new FullPageError('Prisoner is out')
    error.errorKey = FullPageErrorType.PRISONER_OUT
    error.status = 404
    return error
  }
}

export default FullPageError
