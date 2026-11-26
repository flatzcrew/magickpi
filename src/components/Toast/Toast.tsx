import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { FeatureIcon } from '../FeatureIcon'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import styles from './Toast.module.css'

/**
 * Toast — всплывающее временное уведомление. Figma: кит, `Toast` `12071:5771` (State default · info · success · warning · danger; +8).
 * Внешняя рамка (цвет по State + Blur/24) → List-wrap в строку: ⬅️ Left (Feature-icon primary-light xs) · Text-wrap
 * (заголовок + Secondary-text, Description) · ➡️ Right (Button-1 secondary sm, Button-2 tertiary sm) · Icon-button (крестик tertiary sm).
 * Под карточкой — 🖍️ Support-text (например, таймер автозакрытия).
 */
export type ToastState = 'default' | 'info' | 'success' | 'warning' | 'danger'

export interface ToastAction {
  label: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** 💡 State: success · warning · danger красят внешнюю рамку (Surface/*-base-em-alpha). */
  state?: ToastState
  /** ⬅️ Left — иконка в Feature-icon (передана — показана). */
  icon?: string
  /** Primary-text — заголовок. */
  title?: ReactNode
  /** Secondary-text — рядом с заголовком (в ките по умолчанию скрыт). */
  secondaryText?: ReactNode
  /** Description. */
  description?: ReactNode
  /** ↪ Button-1 (secondary). */
  primaryAction?: ToastAction
  /** ↪ Button-2 (tertiary). */
  secondaryAction?: ToastAction
  /** Icon-button — крестик (передан обработчик — показан). */
  onClose?: MouseEventHandler<HTMLButtonElement>
  closeLabel?: string
  /** 🖍️ Support-text — подпись под карточкой. */
  supportText?: ReactNode
}

export function Toast({
  state = 'default',
  icon,
  title,
  secondaryText,
  description,
  primaryAction,
  secondaryAction,
  onClose,
  closeLabel = 'Закрыть',
  supportText,
  className,
  ...rest
}: ToastProps) {
  return (
    <div
      role={state === 'danger' || state === 'warning' ? 'alert' : 'status'}
      {...rest}
      data-state={state}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <div className={styles.wrap}>
        {icon && (
          <span className={styles.left}>
            <FeatureIcon type="primary-light" size="xs" icon={icon} />
          </span>
        )}

        <div className={styles.textWrap}>
          {(title != null || secondaryText != null) && (
            <div className={styles.headingTop}>
              {title != null && <span className={[styles.title, 'ui-body-2-medium'].join(' ')}>{title}</span>}
              {secondaryText != null && (
                <span className={[styles.secondary, 'ui-body-2-normal'].join(' ')}>{secondaryText}</span>
              )}
            </div>
          )}
          {description != null && <p className={[styles.description, 'ui-para-normal'].join(' ')}>{description}</p>}
        </div>

        {(primaryAction || secondaryAction) && (
          <div className={styles.right}>
            {primaryAction && (
              <Button type="secondary" size="sm" onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button type="tertiary" size="sm" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}

        {onClose && <IconButton type="tertiary" size="sm" icon="cross" aria-label={closeLabel} onClick={onClose} />}
      </div>

      {supportText != null && <p className={[styles.support, 'ui-caption-2-normal'].join(' ')}>{supportText}</p>}
    </div>
  )
}
