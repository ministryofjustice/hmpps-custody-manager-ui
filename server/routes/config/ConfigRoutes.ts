import { RequestHandler } from 'express'
import PrisonerService from '../../services/prisonerService'
import ConfigurationViewModel from '../../model/ConfigurationViewModel'
import readOnlyNomisScreens from '../../model/ReadOnlyNomisScreens'
import ReadOnlyPrisonResult from '../../model/ReadOnlyPrisonResult'
import { PrisonApiPrisonDetails } from '../../@types/prisonApi/types'

export default class ConfigRoutes {
  constructor(private readonly prisonerService: PrisonerService) {
    // intentionally left blank
  }

  public getConfig: RequestHandler = async (req, res) => {
    const { token, hasReadOnlyNomisConfigAccess } = res.locals.user
    const activePrisons = await this.prisonerService.getActivePrisons(token)
    const updateId = req.flash('id')
    const readOnly = req.flash('readOnly')
    const notReadOnly = req.flash('notReadOnly')

    let readOnlyChanges
    let notReadOnlyChanges
    let updatedScreen

    if (readOnly && readOnly[0]) {
      readOnlyChanges = readOnly[0].split(',').map(it => activePrisons.find(i => i.agencyId === it).description)
    }
    if (notReadOnly && notReadOnly[0]) {
      notReadOnlyChanges = notReadOnly[0].split(',').map(it => activePrisons.find(i => i.agencyId === it).description)
    }
    if (updateId && updateId[0]) {
      updatedScreen = readOnlyNomisScreens.find(it => it.id === updateId[0]).display
    }

    const readOnlyPrisonResults = await Promise.all(
      readOnlyNomisScreens.map(async it => {
        return new ReadOnlyPrisonResult(
          it.id,
          (await this.prisonerService.getPrisonsWithServiceCode(it.apiId)).map(i => i.prisonId),
        )
      }),
    )
    if (hasReadOnlyNomisConfigAccess) {
      return res.render('pages/config/index', {
        model: new ConfigurationViewModel(
          activePrisons,
          readOnlyPrisonResults,
          readOnlyChanges,
          notReadOnlyChanges,
          updatedScreen,
        ),
      })
    }
    return res.redirect('/')
  }

  public update: RequestHandler = async (req, res): Promise<void> => {
    req.flash('id', req.query.id as string)
    req.flash('readOnly', req.query.readonly as string)
    req.flash('notReadOnly', req.query.notreadonly as string)
    return res.redirect(`/config`)
  }

  public postConfig: RequestHandler = async (req, res) => {
    const currentEnabledPrisons = await this.prisonerService.getPrisonsWithServiceCode(req.body.apiId)
    const checkedBoxes = [req.body.checkedBoxes === undefined ? [] : req.body.checkedBoxes].flat()
    const redirectSection = readOnlyNomisScreens.find(it => it.apiId === req.body.apiId).id

    const newReadOnly = this.enableCheckedBoxes(checkedBoxes, currentEnabledPrisons, req.body.apiId)
    const newUnchecked = this.disableUncheckedBoxes(checkedBoxes, currentEnabledPrisons, req.body.apiId)

    res.redirect(
      `/config/update?id=${redirectSection}&readonly=${newReadOnly.join(',')}&notreadonly=${newUnchecked.join(',')}`,
    )
  }

  private enableCheckedBoxes(checkedBoxes: string[], currentEnabledPrisons: PrisonApiPrisonDetails[], apiId: string) {
    const newBoxes = checkedBoxes.filter(it => !currentEnabledPrisons.map(i => i.prisonId).includes(it))
    newBoxes.forEach(it => this.prisonerService.postServiceCodeForPrison(apiId, it))
    return newBoxes
  }

  private disableUncheckedBoxes(
    checkedBoxes: string[],
    currentEnabledPrisons: PrisonApiPrisonDetails[],
    apiId: string,
  ) {
    const newboxes = currentEnabledPrisons.filter(it => !checkedBoxes.includes(it.prisonId))
    newboxes.forEach(it => this.prisonerService.deleteServiceCodeForPrison(apiId, it.prisonId))
    return newboxes.map(it => it.prisonId)
  }
}
