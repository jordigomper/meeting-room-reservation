export enum MeetingErrorMessages {
  OutTimeMessage = 'No se pueden crear reuniónes fuera del rango establecido',
  MinimumTimeInsufficient = 'La duración mínima de la reunión debe de ser de 30 minutos.',
  MaxTimeExceeded = 'La reunión no puede exceder de un día.',
  AnyUsers = 'Se ha de añadir mínimo un participante en la reunión.',
  UnavailableUser = 'Hay usuarios que no tiene disponibilidad para esta reunión.',
}
