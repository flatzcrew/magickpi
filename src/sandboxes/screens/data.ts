/* Демо-данные песочниц с окнами из макетов: показатели и задачи KPI-сервиса. */
import type { MatrixRowStatus, TaskStatusStatus } from '../../components'

export interface Kpi {
  id: string
  name: string
  status: MatrixRowStatus
  weight: number
  plan: string
  fact: string
  /** Процент выполнения (число). */
  completion: number
  about: string
  unit: string
  source: string
}

/** Результат по шкале (как в ScaleChart): ниже 80% — 0, 80–105% — равен выполнению, выше 105% — 117,5%. */
export const scaleScore = (completion: number) => (completion < 80 ? 0 : completion <= 105 ? completion : 117.5)
export const fmtPct = (n: number) => `${String(Math.round(n * 10) / 10).replace('.', ',')}%`

export const KPIS: Kpi[] = [
  {
    id: 'revenue',
    name: 'Выручка по торговым точкам',
    status: 'progress',
    weight: 40,
    plan: '1 200 000 ₽',
    fact: '980 000 ₽',
    completion: 82,
    about:
      'Сумма выручки всех торговых точек, закреплённых за сотрудником, за месяц учёта. Возвраты вычитаются, предзаказы считаются в месяце отгрузки.',
    unit: 'рубли',
    source: 'Учёт продаж (1С)',
  },
  {
    id: 'conversion',
    name: 'Конверсия в сделку',
    status: 'done',
    weight: 30,
    plan: '20%',
    fact: '22%',
    completion: 110,
    about: 'Доля квалифицированных лидов, дошедших до подписанного договора в месяце учёта.',
    unit: 'проценты',
    source: 'CRM',
  },
  {
    id: 'nps',
    name: 'NPS клиентов',
    status: 'progress',
    weight: 20,
    plan: '60',
    fact: '51',
    completion: 85,
    about: 'Индекс лояльности по опросу клиентов после сделки.',
    unit: 'баллы',
    source: 'Опросы клиентов',
  },
  {
    id: 'crm',
    name: 'Заполнение CRM',
    status: 'fail',
    weight: 10,
    plan: '100%',
    fact: '70%',
    completion: 70,
    about: 'Доля сделок с заполненными обязательными полями в CRM.',
    unit: 'проценты',
    source: 'CRM',
  },
]

export interface Person {
  name: string
  role: string
  initials: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatusStatus
  plan: string
  fact: string
  weight: string
  assignee: Person
  history: { who: string; what: string; when: string }[]
}

export const TASKS: Task[] = [
  {
    id: 't1',
    title: 'Провести дегустацию в трёх магазинах сети',
    description:
      'Провести дегустацию новой линейки в трёх магазинах сети в Заречном районе: договориться с управляющими, выставить стойку на выходные, собрать отзывы покупателей и фото с точек.',
    status: 'in-progress',
    plan: '25',
    fact: '—',
    weight: '—',
    assignee: { name: 'Пётр Сидоров', role: 'Торговый представитель', initials: 'ПС' },
    history: [
      { who: 'Андрей Смирнов', what: 'перевёл в «В работе»', when: '04.11, 10:12' },
      { who: 'Пётр Сидоров', what: 'создал задачу, план 25', when: '03.11, 17:40' },
    ],
  },
  {
    id: 't2',
    title: 'Обновить выкладку в пяти точках',
    description: 'Привести выкладку к новому планограмму, прислать фото до и после.',
    status: 'on-approval',
    plan: '5',
    fact: '—',
    weight: '—',
    assignee: { name: 'Мария Белова', role: 'Мерчендайзер', initials: 'МБ' },
    history: [{ who: 'Мария Белова', what: 'создала задачу, план 5', when: '05.11, 09:30' }],
  },
  {
    id: 't3',
    title: 'Согласовать план на декабрь',
    description: 'Собрать предложения по весам и планам показателей отдела на декабрь.',
    status: 'done',
    plan: '1',
    fact: '1',
    weight: '—',
    assignee: { name: 'Денис Орлов', role: 'Руководитель группы', initials: 'ДО' },
    history: [
      { who: 'Андрей Смирнов', what: 'принял результат', when: '20.11, 16:05' },
      { who: 'Денис Орлов', what: 'создал задачу, план 1', when: '12.11, 11:20' },
    ],
  },
]

export const EMPLOYEES: (Person & { id: string; completion: number; status: MatrixRowStatus; tasks: number })[] = [
  { id: 'e1', name: 'Пётр Сидоров', role: 'Торговый представитель', initials: 'ПС', completion: 97, status: 'progress', tasks: 2 },
  { id: 'e2', name: 'Мария Белова', role: 'Мерчендайзер', initials: 'МБ', completion: 104, status: 'done', tasks: 1 },
  { id: 'e3', name: 'Денис Орлов', role: 'Руководитель группы', initials: 'ДО', completion: 68, status: 'fail', tasks: 1 },
]
