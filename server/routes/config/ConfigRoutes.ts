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
        model: new ConfigurationViewModel(activePrisons, readOnlyPrisonResults),
      })
    }
    return res.redirect('/')
  }

  public postConfig: RequestHandler = async (req, res) => {
    const currentEnabledPrisons = await this.prisonerService.getPrisonsWithServiceCode(req.body.apiId)
    const checkedBoxes = [req.body.checkedBoxes === undefined ? [] : req.body.checkedBoxes].flat()
    const redirectSection = readOnlyNomisScreens.find(it => it.apiId === req.body.apiId).id

    this.enableCheckedBoxes(checkedBoxes, currentEnabledPrisons, req.body.apiId)
    this.disableUncheckedBoxes(checkedBoxes, currentEnabledPrisons, req.body.apiId)

    res.redirect(`/config#${redirectSection}`)
  }

  private enableCheckedBoxes(checkedBoxes: string[], currentEnabledPrisons: PrisonApiPrisonDetails[], apiId: string) {
    checkedBoxes
      .filter(it => !currentEnabledPrisons.map(i => i.prisonId).includes(it))
      .forEach(it => this.prisonerService.postServiceCodeForPrison(apiId, it))
  }

  private disableUncheckedBoxes(
    checkedBoxes: string[],
    currentEnabledPrisons: PrisonApiPrisonDetails[],
    apiId: string,
  ) {
    currentEnabledPrisons
      .filter(it => !checkedBoxes.includes(it.prisonId))
      .forEach(it => this.prisonerService.deleteServiceCodeForPrison(apiId, it.prisonId))
  }
}
