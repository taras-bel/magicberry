// Утилиты для работы со строками и slug

/**
 * Создает slug из строки
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Удаляем спецсимволы
    .replace(/[\s_-]+/g, '-') // Заменяем пробелы, подчеркивания и дефисы на один дефис
    .replace(/^-+|-+$/g, ''); // Удаляем дефисы в начале и конце
}

