import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { FeatureIcon } from '../FeatureIcon'
import { Button } from '../Button'
import { ButtonSuccess } from '../ButtonSuccess'
import { ButtonDanger } from '../ButtonDanger'
import { Link } from '../Link'
import { IconButton } from '../IconButton'
import styles from './Alert.module.css'

/**
 * Alert — баннер-сообщение в потоке страницы. Figma: кит, `Alert` `12074:6202` (State default · info · success · warning · danger; +11).
 * Внешняя рамка (Inverse-white/alpha-2 + Blur/24) → List-wrap: Icon (Feature-icon primary-light xs) · Heading-top + Description ·
 * CTAs: слева Button-3 (tertiary) + Link, справа Button-1 (secondary) + Button-2 (primary-light). Right — крестик (Icon-button tertiary xs).
 * State в ките меняет только Button-2: success — Button-success, danger — Button-danger, остальные — Button.
 */
export type AlertState = 'default' | 'info' | 'success' | 'warning' | 'danger'

export interface AlertAction {
  label: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

export interface AlertLink {
  label: ReactNode
  href?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 💡 State. */
  state?: AlertState
  /** Icon — иконка в Feature-icon (передана — показана). */
  icon?: string
  /** Heading-top — заголовок (слот). */
  title?: ReactNode
  /** Description. */
  description?: ReactNode
  /** → Button-2 — главная кнопка (primary-light, цвет по State). */
  primaryAction?: AlertAction
  /** → Button-1 — secondary. */
  secondaryAction?: AlertAction
  /** → Button-3 — tertiary слева. */
  tertiaryAction?: AlertAction
  /** → Link слева. */
  link?: AlertLink
  /** CTAs — свой ряд действий вместо собранного из кнопок. */
  actions?: ReactNode
  /** ↪ ➡️ Right — крестик (передан обработчик — показан). */
  onClose?: MouseEventHandler<HTMLButtonElement>
  closeLabel?: string
}

export function Alert({
  state = 'default',
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  link,
  actions,
  onClose,
  closeLabel = 'Закрыть',
  className,
  ...rest
}: AlertProps) {
  const hasLeft = Boolean(tertiaryAction || link)
  const hasRight = Boolean(secondaryAction || primaryAction)
  const Primary = state === 'success' ? ButtonSuccess : state === 'danger' ? ButtonDanger : Button

  return (
    <div
      role={state === 'danger' || state === 'warning' ? 'alert' : 'status'}
      {...rest}
      data-state={state}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <div className={[styles.wrap, onClose && styles.withClose].filter(Boolean).join(' ')}>
        {icon && <FeatureIcon type="primary-light" size="xs" icon={icon} />}

        {(title != null || description != null) && (
          <div className={styles.textWrap}>
            {title != null && <div className={[styles.title, 'ui-body-2-medium'].join(' ')}>{title}</div>}
            {description != null && <p className={[styles.description, 'ui-para-normal'].join(' ')}>{description}</p>}
          </div>
        )}

        {(actions != null || hasLeft || hasRight) && (
          <div className={styles.ctas}>
            {actions ?? (
              <>
                {hasLeft && (
                  <div className={styles.left}>
                    {tertiaryAction && (
                      <Button type="tertiary" size="sm" onClick={tertiaryAction.onClick} disabled={tertiaryAction.disabled}>
                        {tertiaryAction.label}
                      </Button>
                    )}
                    {link && (
                      <Link type="secondary" size="sm" href={link.href} onClick={link.onClick}>
                        {link.label}
                      </Link>
                    )}
                  </div>
                )}
                {hasRight && (
                  <div className={styles.right}>
                    {secondaryAction && (
                      <Button type="secondary" size="sm" onClick={secondaryAction.onClick} disabled={secondaryAction.disabled}>
                        {secondaryAction.label}
                      </Button>
                    )}
                    {primaryAction && (
                      <Primary type="primary-light" size="sm" onClick={primaryAction.onClick} disabled={primaryAction.disabled}>
                        {primaryAction.label}
                      </Primary>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {onClose && (
          <span className={styles.close}>
            <IconButton type="tertiary" size="xs" icon="cross" aria-label={closeLabel} onClick={onClose} />
          </span>
        )}
      </div>
    </div>
  )
}
