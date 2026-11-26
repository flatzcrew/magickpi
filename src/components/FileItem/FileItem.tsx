import type { HTMLAttributes, MouseEventHandler, ReactNode } from 'react'
import { FeatureIcon } from '../FeatureIcon'
import { IconButton } from '../IconButton'
import styles from './FileItem.module.css'

/**
 * FileItem — строка прикреплённого файла в форме (закрытие задачи, SCR-07).
 * Figma: kpi-bro · web, ext `FileItem` `225:1041` (State: loading 225:1001 · done 225:1015 · error 225:1027), сверено 2026-11-26.
 * Не интерактивна целиком: действие — только иконка-кнопка (Cross в loading — отмена, Bin в done / error — удалить).
 */
export type FileItemState = 'loading' | 'done' | 'error'

export interface FileItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** State: loading · done · error */
  state?: FileItemState
  /** name — 1 строка с «…». */
  name?: ReactNode
  /** size — показывается только в done. */
  size?: ReactNode
  /** Текст ошибки в error (в Figma задан в варианте), 1 строка, до ~45 символов. */
  errorText?: ReactNode
  /** Иконка Feature-icon (exposed swap): doc — документ, image — фото. */
  icon?: string
  /** Cross (loading) / Bin (done, error). */
  onRemove?: MouseEventHandler<HTMLButtonElement>
}

export function FileItem({
  state = 'loading',
  name = 'Фото_дегустация_1.jpg',
  size = '2,4 МБ',
  errorText = 'Файл больше 20 МБ — прикрепите поменьше',
  icon = 'doc',
  onRemove,
  className,
  ...rest
}: FileItemProps) {
  const meta = state === 'loading' ? 'Загрузка…' : state === 'error' ? errorText : size
  return (
    <div
      {...rest}
      data-state={state}
      aria-busy={state === 'loading' || undefined}
      className={[styles.root, className].filter(Boolean).join(' ')}
    >
      <FeatureIcon type="tertiary" size="xs" icon={icon} />
      <div className={styles.content}>
        <span className={[styles.name, 'ui-body-1-medium'].join(' ')}>{name}</span>
        <span className={[styles.meta, 'ui-caption-2-normal'].join(' ')} role={state === 'error' ? 'alert' : undefined}>
          {meta}
        </span>
      </div>
      <IconButton
        type="tertiary"
        size="sm"
        icon={state === 'loading' ? 'cross' : 'bin'}
        aria-label={state === 'loading' ? 'Отменить загрузку' : 'Удалить файл'}
        onClick={onRemove}
      />
    </div>
  )
}
