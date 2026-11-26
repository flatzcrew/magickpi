import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { FeatureIcon } from '../FeatureIcon'
import { Icon } from '../Icon'
import styles from './DashboardInfo.module.css'

/** DashboardInfo — блок-сводка дашборда (метрика + изменение). Figma: кит, `Dashboard-info` `16189:4286`. */
export type DashboardInfoChangeTone = 'success' | 'neutral'

export interface DashboardInfoAction {
  'aria-label': string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export interface DashboardInfoProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Label — подпись метрики. */
  label?: ReactNode
  /** Icons / Info слева от подписи (в карточках-сводках SMART скрывается). */
  labelIcon?: string | false
  /** Primary-text — крупное значение. */
  value?: ReactNode
  /** Change — текст изменения. */
  change?: ReactNode
  /** Icons / Up у изменения; `false` скрывает. */
  changeIcon?: string | false
  /** Цвет изменения: success (Text/success-med-em, по умолчанию) · neutral (Text/med-em, оверрайд карточек-сводок). */
  changeTone?: DashboardInfoChangeTone
  /** Feature-icon tertiary xs со стрелкой; `false` скрывает. */
  featureIcon?: string | false
  /** Переход по стрелке: Feature-icon становится кнопкой. */
  action?: DashboardInfoAction
}

export function DashboardInfo({
  label = 'All Revenue:',
  labelIcon = 'info',
  value = '$1820.27',
  change = '24%',
  changeIcon = 'up',
  changeTone = 'success',
  featureIcon = 'arrow-right-up',
  action,
  className,
  ...rest
}: DashboardInfoProps) {
  const feature = featureIcon ? <FeatureIcon type="tertiary" size="xs" icon={featureIcon} /> : null
  return (
    <div {...rest} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <div className={styles.textWrap}>
            {label != null && (
              <span className={styles.label}>
                {labelIcon && <Icon name={labelIcon} size={16} />}
                <span className="ui-body-1-medium">{label}</span>
              </span>
            )}
            <div className={styles.primary}>
              <span className={[styles.value, 'ui-heading-3-medium'].join(' ')}>{value}</span>
              {change != null && (
                <span className={[styles.change, styles[changeTone]].join(' ')}>
                  {changeIcon && <Icon name={changeIcon} size={24} />}
                  <span className="ui-body-1-semibold">{change}</span>
                </span>
              )}
            </div>
          </div>
          {feature &&
            (action ? (
              <button type="button" className={styles.action} aria-label={action['aria-label']} onClick={action.onClick}>
                {feature}
              </button>
            ) : (
              feature
            ))}
        </div>
      </div>
    </div>
  )
}
