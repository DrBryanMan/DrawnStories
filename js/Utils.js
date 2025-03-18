export function formatDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
}
export function formatMonthYear(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1)
    return date.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })
}