import { PrisonApiPrison } from '../@types/prisonApi/types'
import readOnlyNomisScreens from './ReadOnlyNomisScreens'
import ReadOnlyPrisonResult from './ReadOnlyPrisonResult'

export default class ConfigurationViewModel {
  constructor(
    public allPrisons: PrisonApiPrison[],
    public readOnlyPrisonResults: ReadOnlyPrisonResult[],
    public readOnlyChanges: string[],
    public notReadOnlyChanges: string[],
    public updatedScreen: string,
  ) {}

  public checkboxes(adjustmentId: string) {
    const displayText = readOnlyNomisScreens.find(it => it.id === adjustmentId).display
    return {
      classes: 'govuk-checkboxes--small',
      name: 'checkedBoxes',
      fieldset: {
        legend: {
          text: `Select the status of the ${displayText} screen`,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      hint: { text: `Checked prisons are read only` },
      items: this.getItems(adjustmentId),
    }
  }

  public updateHtml() {
    let html = ''
    if (this.readOnlyChanges.length > 0 && this.readOnlyChanges.every(it => it !== undefined)) {
      html += this.getBannerText('read only', this.readOnlyChanges)
    }
    if (this.notReadOnlyChanges.length > 0 && this.notReadOnlyChanges.every(it => it !== undefined)) {
      html += this.getBannerText('active', this.notReadOnlyChanges)
    }
    return html
  }

  private getBannerText(action: string, prisons: string[]) {
    return `<h3 class="govuk-notification-banner__heading">
            The ${this.updatedScreen} screen is now ${action} in ${this.getEnding(prisons.length)}</h3>
            <p>${prisons.join('<br>')}</p>`
  }

  private getEnding(length: number) {
    return length === 1 ? 'this prison' : 'these prisons'
  }

  public tabs() {
    return readOnlyNomisScreens.map(it => {
      const readOnlyPrisonCount = this.readOnlyPrisonResults.find(i => it.id === i.id).prisonIds.length
      return {
        id: it.id,
        display: `${it.display} (${readOnlyPrisonCount}/${this.allPrisons.length})`,
        table: this.checkboxes(it.id),
        apiId: it.apiId,
      }
    })
  }

  private getItems(adjustmentId: string) {
    const readOnlyPrisons = this.readOnlyPrisonResults.filter(it => it.id === adjustmentId).flatMap(it => it.prisonIds)
    return this.allPrisons.map(it => {
      return { text: it.description, value: it.agencyId, checked: readOnlyPrisons.includes(it.agencyId) }
    })
  }
}
